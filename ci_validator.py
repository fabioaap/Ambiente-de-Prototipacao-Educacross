#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🤖 Automação CI/CD - Validador Universal Educacross
=================================================

Script para integração com pipelines de CI/CD, automação de validação
e geração de relatórios para o ambiente de prototipação.

Uso em CI/CD:
python ci_validator.py --mode=ci --threshold=85 --output=artifacts/

Uso local:
python ci_validator.py --mode=dev --watch --auto-fix
"""

import os
import sys
import json
import subprocess
import time
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import argparse
import hashlib
import shutil

class Colors:
    """Cores para output"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

# Watcher functionality removed - requires external dependency
# For file watching, use: pip install watchdog

class CIValidator:
    """Validador para ambientes de CI/CD e automação"""
    
    def __init__(self, root_path: Path):
        self.root_path = Path(root_path).resolve()
        self.config = self._load_config()
        self.artifacts_dir = None
        self.mode = 'dev'
        self.threshold = 85.0
    
    def _load_config(self) -> Dict[str, Any]:
        """Carrega configuração"""
        config_path = self.root_path / 'universal_validator_config.json'
        
        if config_path.exists():
            try:
                with open(config_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"{Colors.YELLOW}⚠️ Erro ao carregar config: {e}{Colors.END}")
        
        return {}
    
    def run_ci_validation(self, threshold: float = 85.0, 
                         output_dir: Optional[str] = None,
                         fail_fast: bool = False) -> int:
        """Executa validação para ambiente CI/CD"""
        
        print(f"{Colors.BOLD}{Colors.BLUE}🤖 VALIDAÇÃO CI/CD - EDUCACROSS{Colors.END}")
        print(f"{Colors.PURPLE}Ambiente de Prototipação - Automação{Colors.END}")
        print("=" * 60)
        
        self.mode = 'ci'
        self.threshold = threshold
        
        if output_dir:
            self.artifacts_dir = Path(output_dir)
            self.artifacts_dir.mkdir(parents=True, exist_ok=True)
        
        start_time = time.time()
        
        # 1. Executar validação universal
        print(f"\n{Colors.BLUE}🔍 Executando validação universal...{Colors.END}")
        validation_result = self._run_universal_validator()
        
        # 2. Analisar resultados
        results = self._analyze_validation_results(validation_result)

        # 2.1. Executar testes visuais (Playwright), se disponíveis
        print(f"\n{Colors.BLUE}🖼️ Executando validação visual (Playwright), se configurada...{Colors.END}")
        pixel_status = self._run_pixel_tests()
        if pixel_status is not None:
            results.setdefault('aux', {})['pixel_tests'] = pixel_status
            # Copiar artefatos do relatório visual, se houver
            try:
                self._collect_pixel_artifacts()
            except Exception as e:
                print(f"{Colors.YELLOW}⚠️ Falha ao coletar artefatos de pixel: {e}{Colors.END}")
        
        # 3. Gerar artefatos
        if self.artifacts_dir:
            self._generate_artifacts(results, validation_result)
        
        # 4. Determinar exit code
        exit_code = self._determine_exit_code(results, threshold, fail_fast)
        
        # 5. Resumo final
        duration = time.time() - start_time
        self._print_ci_summary(results, duration, exit_code)
        
        return exit_code

    def _run_pixel_tests(self) -> Optional[Dict[str, Any]]:
        """Executa testes de regressão visual (Playwright), se configurados.

        Retorna um dicionário com status e caminhos de relatório, ou None se não aplicável.
        """
        try:
            config = self.root_path / 'playwright.config.ts'
            tests_dir = self.root_path / 'tests' / 'pixel'
            if not config.exists() or not tests_dir.exists():
                print("  ℹ️ Playwright não configurado (playwright.config.ts ou tests/pixel ausentes). Pulando.")
                return None

            print("  ▶️ Rodando: npm run pixel:ci")
            result = subprocess.run(['npm', 'run', 'pixel:ci'], cwd=self.root_path, capture_output=True, text=True, encoding='utf-8')
            passed = (result.returncode == 0)
            if not passed:
                print(f"  {Colors.YELLOW}⚠️ Pixel tests retornaram código {result.returncode}{Colors.END}")
                if result.stdout:
                    print(result.stdout[-1000:])
                if result.stderr:
                    print(result.stderr[-1000:])

            report_dir = self.root_path / 'validation-artifacts' / 'pixel' / 'report'
            return {
                'configured': True,
                'passed': passed,
                'report_dir': str(report_dir) if report_dir.exists() else None
            }
        except Exception as e:
            print(f"  {Colors.YELLOW}⚠️ Erro ao executar pixel tests: {e}{Colors.END}")
            return {'configured': True, 'passed': False, 'error': str(e)}

    def _collect_pixel_artifacts(self) -> None:
        """Copia artefatos do relatório visual para a pasta de artefatos do CI."""
        if not self.artifacts_dir:
            return
        src = self.root_path / 'validation-artifacts' / 'pixel' / 'report'
        if src.exists():
            dst = self.artifacts_dir / 'pixel-report'
            if dst.exists():
                shutil.rmtree(dst, ignore_errors=True)
            shutil.copytree(src, dst)
            print(f"  {Colors.GREEN}📸 Relatório visual copiado para: {dst}{Colors.END}")
    
    def run_dev_mode(self, watch: bool = False, auto_fix: bool = False) -> None:
        """Executa validação em modo desenvolvimento"""
        
        print(f"{Colors.BOLD}{Colors.GREEN}🛠️ MODO DESENVOLVIMENTO{Colors.END}")
        print(f"{Colors.CYAN}Validação contínua para prototipagem{Colors.END}")
        print("=" * 50)
        
        self.mode = 'dev'
        
        if auto_fix:
            print(f"{Colors.YELLOW}🔧 Auto-fix ativado (experimental){Colors.END}")
        
        if watch:
            print(f"{Colors.BLUE}👁️ Modo watch ativado - monitorando alterações...{Colors.END}")
            self._start_file_watcher()
        else:
            # Executar validação única
            self._run_dev_validation()
    
    def validate_file_change(self, file_path: Path) -> None:
        """Valida mudança específica em arquivo"""
        
        try:
            # Determinar se é um arquivo de protótipo
            prototype_dir = self._find_prototype_directory(file_path)
            
            if prototype_dir:
                print(f"  📁 Protótipo: {prototype_dir.name}")
                
                # Executar validação rápida
                cmd = [
                    sys.executable,
                    str(self.root_path / 'universal_validator.py'),
                    '--path', str(prototype_dir),
                    '--output', 'console'
                ]
                
                result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
                
                # Mostrar resultado condensado
                if result.returncode == 0:
                    print(f"  {Colors.GREEN}✅ Validação OK{Colors.END}")
                else:
                    print(f"  {Colors.YELLOW}⚠️ Issues encontrados{Colors.END}")
                    if result.stdout:
                        # Mostrar apenas resumo
                        lines = result.stdout.split('\n')
                        summary_lines = [line for line in lines if 'RESUMO' in line or '%' in line]
                        for line in summary_lines[-3:]:  # Últimas 3 linhas relevantes
                            print(f"    {line}")
            
        except Exception as e:
            print(f"  {Colors.RED}❌ Erro na validação: {e}{Colors.END}")
    
    def _find_prototype_directory(self, file_path: Path) -> Optional[Path]:
        """Encontra o diretório do protótipo que contém o arquivo"""
        
        # Subir na hierarquia até encontrar diretório com index.html ou similar
        current = file_path.parent if file_path.is_file() else file_path
        
        while current != self.root_path and current.parent != current:
            # Verificar se é um diretório de protótipo
            html_files = list(current.glob('*.html'))
            if html_files:
                return current
            
            current = current.parent
        
        return None
    
    def _start_file_watcher(self) -> None:
        """Inicia monitoramento de arquivos (modo polling simples)"""
        
        print(f"{Colors.YELLOW}⚠️ Modo watch simplificado ativo{Colors.END}")
        print(f"Para watch avançado, instale: pip install watchdog")
        
        # Monitorar diretórios principais com polling simples
        watch_dirs = ['Front-office', 'Back-office', 'Game', 'src']
        last_modified = {}
        
        # Mapear tempos de modificação iniciais
        for watch_dir in watch_dirs:
            dir_path = self.root_path / watch_dir
            if dir_path.exists():
                print(f"  👁️ Monitorando: {dir_path}")
                for file_path in dir_path.rglob('*'):
                    if file_path.is_file() and file_path.suffix in ['.html', '.css', '.js']:
                        try:
                            last_modified[str(file_path)] = file_path.stat().st_mtime
                        except:
                            continue
        
        try:
            print(f"\n{Colors.GREEN}🚀 Monitoramento ativo (polling a cada 5s). Pressione Ctrl+C para parar.{Colors.END}")
            while True:
                time.sleep(5)  # Polling a cada 5 segundos
                
                # Verificar mudanças
                for watch_dir in watch_dirs:
                    dir_path = self.root_path / watch_dir
                    if dir_path.exists():
                        for file_path in dir_path.rglob('*'):
                            if file_path.is_file() and file_path.suffix in ['.html', '.css', '.js']:
                                try:
                                    current_mtime = file_path.stat().st_mtime
                                    file_key = str(file_path)
                                    
                                    if file_key in last_modified:
                                        if current_mtime > last_modified[file_key]:
                                            print(f"\n{Colors.YELLOW}� Alteração detectada: {file_path.name}{Colors.END}")
                                            self.validate_file_change(file_path)
                                            last_modified[file_key] = current_mtime
                                    else:
                                        last_modified[file_key] = current_mtime
                                        
                                except:
                                    continue
                        
        except KeyboardInterrupt:
            print(f"\n{Colors.CYAN}👋 Monitoramento encerrado{Colors.END}")
    
    def _run_universal_validator(self) -> Dict[str, Any]:
        """Executa o validador universal"""
        
        cmd = [
            sys.executable,
            str(self.root_path / 'universal_validator.py'),
            '--type', 'all',
            '--output', 'json'
        ]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
            
            # Carregar resultados do JSON
            report_file = self.root_path / 'universal_validation_report.json'
            if report_file.exists():
                with open(report_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            
            return {'error': 'Relatório não gerado'}
            
        except Exception as e:
            return {'error': f'Erro na execução: {e}'}
    
    def _analyze_validation_results(self, validation_result: Dict[str, Any]) -> Dict[str, Any]:
        """Analisa resultados da validação"""
        
        if 'error' in validation_result:
            return {
                'status': 'error',
                'message': validation_result['error'],
                'overall_score': 0,
                'critical_issues': 1,
                'areas': {}
            }
        
        summary = validation_result.get('summary', {})
        
        return {
            'status': 'success',
            'overall_score': summary.get('overall_percentage', 0),
            'total_tests': summary.get('total_tests_run', 0),
            'total_passed': summary.get('total_passed', 0),
            'total_failed': summary.get('total_failed', 0),
            'files_validated': summary.get('total_files_validated', 0),
            'areas_validated': summary.get('areas_validated', []),
            'critical_issues': self._count_critical_issues(validation_result),
            'areas': self._analyze_areas(validation_result.get('validation_results', {}))
        }
    
    def _count_critical_issues(self, validation_result: Dict[str, Any]) -> int:
        """Conta issues críticos"""
        
        critical_count = 0
        
        # Definir padrões críticos
        critical_patterns = [
            'DOCTYPE',
            'charset',
            'lang="pt-BR"',
            'viewport',
            'título'
        ]
        
        validation_results = validation_result.get('validation_results', {})
        
        for area_name, area_results in validation_results.items():
            for prototype_name, prototype_results in area_results.items():
                tests = prototype_results.get('tests', {})
                
                for test_category, test_list in tests.items():
                    for test in test_list:
                        if not test.get('passed', True):
                            test_name = test.get('name', '').lower()
                            if any(pattern.lower() in test_name for pattern in critical_patterns):
                                critical_count += 1
        
        return critical_count
    
    def _analyze_areas(self, validation_results: Dict[str, Any]) -> Dict[str, Any]:
        """Analisa resultados por área"""
        
        areas_analysis = {}
        
        for area_name, area_results in validation_results.items():
            area_passed = 0
            area_failed = 0
            prototypes = []
            
            for prototype_name, prototype_results in area_results.items():
                proto_passed = prototype_results['summary']['passed']
                proto_failed = prototype_results['summary']['failed']
                
                area_passed += proto_passed
                area_failed += proto_failed
                
                proto_total = proto_passed + proto_failed
                proto_score = (proto_passed / proto_total * 100) if proto_total > 0 else 0
                
                prototypes.append({
                    'name': prototype_name,
                    'score': proto_score,
                    'passed': proto_passed,
                    'failed': proto_failed
                })
            
            area_total = area_passed + area_failed
            area_score = (area_passed / area_total * 100) if area_total > 0 else 0
            
            areas_analysis[area_name] = {
                'score': area_score,
                'passed': area_passed,
                'failed': area_failed,
                'prototypes': prototypes
            }
        
        return areas_analysis
    
    def _generate_artifacts(self, results: Dict[str, Any], 
                          validation_result: Dict[str, Any]) -> None:
        """Gera artefatos para CI/CD"""
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # 1. Relatório JSON detalhado
        json_report = self.artifacts_dir / f'validation_report_{timestamp}.json'
        with open(json_report, 'w', encoding='utf-8') as f:
            json.dump(validation_result, f, indent=2, ensure_ascii=False)
        
        # 2. Resumo para badges/métricas
        summary_file = self.artifacts_dir / 'validation_summary.json'
        summary = {
            'timestamp': datetime.now().isoformat(),
            'overall_score': results['overall_score'],
            'total_tests': results.get('total_tests', 0),
            'total_passed': results.get('total_passed', 0),
            'total_failed': results.get('total_failed', 0),
            'critical_issues': results.get('critical_issues', 0),
            'status': 'pass' if results['overall_score'] >= self.threshold else 'fail'
        }
        
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        # 3. Badge SVG (opcional)
        self._generate_badge_svg(results['overall_score'])
        
        # 4. Relatório HTML (formato amigável)
        self._generate_html_report(results, validation_result)
        
        print(f"{Colors.GREEN}📁 Artefatos gerados em: {self.artifacts_dir}{Colors.END}")
    
    def _generate_badge_svg(self, score: float) -> None:
        """Gera badge SVG com o score"""
        
        # Determinar cor baseada no score
        if score >= 90:
            color = 'brightgreen'
        elif score >= 80:
            color = 'green'
        elif score >= 70:
            color = 'yellow'
        elif score >= 60:
            color = 'orange'
        else:
            color = 'red'
        
        badge_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="104" height="20">
    <linearGradient id="b" x2="0" y2="100%">
        <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
        <stop offset="1" stop-opacity=".1"/>
    </linearGradient>
    <mask id="a">
        <rect width="104" height="20" rx="3" fill="#fff"/>
    </mask>
    <g mask="url(#a)">
        <path fill="#555" d="M0 0h63v20H0z"/>
        <path fill="{color}" d="M63 0h41v20H63z"/>
        <path fill="url(#b)" d="M0 0h104v20H0z"/>
    </g>
    <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
        <text x="31.5" y="15" fill="#010101" fill-opacity=".3">quality</text>
        <text x="31.5" y="14">quality</text>
        <text x="82.5" y="15" fill="#010101" fill-opacity=".3">{score:.0f}%</text>
        <text x="82.5" y="14">{score:.0f}%</text>
    </g>
</svg>'''
        
        badge_file = self.artifacts_dir / 'quality_badge.svg'
        with open(badge_file, 'w', encoding='utf-8') as f:
            f.write(badge_svg)
    
    def _generate_html_report(self, results: Dict[str, Any], 
                             validation_result: Dict[str, Any]) -> None:
        """Gera relatório HTML amigável"""
        
        html_content = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Validação - Educacross</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }}
        .container {{ max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        .header {{ text-align: center; margin-bottom: 30px; }}
        .score {{ font-size: 48px; font-weight: bold; color: {'#28a745' if results['overall_score'] >= 85 else '#ffc107' if results['overall_score'] >= 70 else '#dc3545'}; }}
        .metrics {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }}
        .metric {{ text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; }}
        .areas {{ margin-top: 30px; }}
        .area {{ margin-bottom: 20px; padding: 15px; border-left: 4px solid #007bff; background: #f8f9fa; }}
        .timestamp {{ text-align: center; color: #666; font-size: 14px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏗️ Relatório de Validação - Educacross</h1>
            <p>Ambiente de Prototipação</p>
            <div class="score">{results['overall_score']:.1f}%</div>
        </div>
        
        <div class="metrics">
            <div class="metric">
                <h3>📄 Arquivos</h3>
                <p>{results.get('files_validated', 0)}</p>
            </div>
            <div class="metric">
                <h3>🧪 Testes</h3>
                <p>{results.get('total_tests', 0)}</p>
            </div>
            <div class="metric">
                <h3>✅ Passaram</h3>
                <p>{results.get('total_passed', 0)}</p>
            </div>
            <div class="metric">
                <h3>❌ Falharam</h3>
                <p>{results.get('total_failed', 0)}</p>
            </div>
        </div>
        
        <div class="areas">
            <h2>📊 Resultados por Área</h2>'''
        
        for area_name, area_data in results.get('areas', {}).items():
            html_content += f'''
            <div class="area">
                <h3>{area_name.replace('_', '-').title()}: {area_data['score']:.1f}%</h3>
                <p>✅ {area_data['passed']} | ❌ {area_data['failed']}</p>
            </div>'''
        
        html_content += f'''
        </div>
        
        <div class="timestamp">
            <p>Gerado em: {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}</p>
        </div>
    </div>
</body>
</html>'''
        
        html_file = self.artifacts_dir / 'validation_report.html'
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
    
    def _determine_exit_code(self, results: Dict[str, Any], 
                           threshold: float, fail_fast: bool) -> int:
        """Determina exit code baseado nos resultados"""
        
        if results['status'] == 'error':
            return 2  # Erro crítico
        
        overall_score = results['overall_score']
        critical_issues = results.get('critical_issues', 0)
        
        # Fail fast em issues críticos
        if fail_fast and critical_issues > 0:
            return 1
        
        # Verificar threshold
        if overall_score < threshold:
            return 1
        
        return 0  # Sucesso
    
    def _print_ci_summary(self, results: Dict[str, Any], 
                         duration: float, exit_code: int) -> None:
        """Imprime resumo final para CI"""
        
        print(f"\n{Colors.BOLD}{Colors.WHITE}🤖 RESUMO CI/CD{Colors.END}")
        print("=" * 50)
        
        # Status geral
        status_color = Colors.GREEN if exit_code == 0 else Colors.RED
        status_text = "PASSED" if exit_code == 0 else "FAILED"
        print(f"Status: {status_color}{status_text}{Colors.END}")
        
        # Métricas principais
        print(f"Score: {results['overall_score']:.1f}% (threshold: {self.threshold}%)")
        print(f"Duração: {duration:.1f}s")
        print(f"Arquivos: {results.get('files_validated', 0)}")
        print(f"Testes: {results.get('total_passed', 0)}/{results.get('total_tests', 0)}")
        
        if results.get('critical_issues', 0) > 0:
            print(f"{Colors.RED}⚠️ Issues críticos: {results['critical_issues']}{Colors.END}")
        
        # Artefatos
        if self.artifacts_dir:
            print(f"📁 Artefatos: {self.artifacts_dir}")
    
    def _run_dev_validation(self) -> None:
        """Executa validação única em modo dev"""
        
        print(f"{Colors.BLUE}🔍 Executando validação de desenvolvimento...{Colors.END}")
        
        cmd = [
            sys.executable,
            str(self.root_path / 'universal_validator.py'),
            '--output', 'console'
        ]
        
        try:
            result = subprocess.run(cmd, text=True, encoding='utf-8')
            
            if result.returncode == 0:
                print(f"\n{Colors.GREEN}✅ Validação concluída - Pronto para desenvolvimento!{Colors.END}")
            else:
                print(f"\n{Colors.YELLOW}⚠️ Algumas melhorias podem ser feitas{Colors.END}")
                
        except Exception as e:
            print(f"{Colors.RED}❌ Erro na validação: {e}{Colors.END}")

def main():
    """Função principal CLI"""
    
    parser = argparse.ArgumentParser(description='Automação CI/CD - Validador Universal')
    parser.add_argument('--mode', choices=['ci', 'dev'], default='dev',
                       help='Modo de execução')
    parser.add_argument('--threshold', type=float, default=85.0,
                       help='Threshold mínimo para CI (default: 85)')
    parser.add_argument('--output', type=str,
                       help='Diretório para artefatos CI')
    parser.add_argument('--watch', action='store_true',
                       help='Modo watch (apenas dev)')
    parser.add_argument('--auto-fix', action='store_true',
                       help='Auto-fix experimental (apenas dev)')
    parser.add_argument('--fail-fast', action='store_true',
                       help='Falhar imediatamente em issues críticos')
    parser.add_argument('--root', type=str,
                       help='Caminho raiz do projeto')
    
    args = parser.parse_args()
    
    # Encontrar raiz do projeto
    if args.root:
        root_path = Path(args.root)
    else:
        current = Path.cwd()
        indicators = ['package.json', '.git', 'universal_validator.py']
        
        for path in [current] + list(current.parents):
            if any((path / indicator).exists() for indicator in indicators):
                root_path = path
                break
        else:
            root_path = current
    
    try:
        validator = CIValidator(root_path)
        
        if args.mode == 'ci':
            exit_code = validator.run_ci_validation(
                threshold=args.threshold,
                output_dir=args.output,
                fail_fast=args.fail_fast
            )
            sys.exit(exit_code)
        
        elif args.mode == 'dev':
            validator.run_dev_mode(
                watch=args.watch,
                auto_fix=args.auto_fix
            )
        
    except KeyboardInterrupt:
        print(f"\n{Colors.CYAN}👋 Operação cancelada pelo usuário{Colors.END}")
        sys.exit(0)
    except Exception as e:
        print(f"{Colors.RED}❌ Erro crítico: {e}{Colors.END}")
        sys.exit(2)

if __name__ == "__main__":
    main()