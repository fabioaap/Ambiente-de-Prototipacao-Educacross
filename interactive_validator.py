#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎯 CLI Interativo - Validador Universal Educacross
================================================

Interface interativa para executar validações em todo o ambiente de prototipação.
Permite seleção específica de áreas, tipos de arquivo e configurações.

Uso: python interactive_validator.py
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime

class Colors:
    """Cores para CLI"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

class InteractiveValidator:
    """CLI interativo para o validador universal"""
    
    def __init__(self):
        self.root_path = self._find_project_root()
        self.config = self._load_config()
        self.menu_history = []
    
    def _find_project_root(self) -> Path:
        """Encontra automaticamente a raiz do projeto"""
        current = Path.cwd()
        indicators = ['package.json', '.git', 'Front-office', 'Back-office', 'universal_validator.py']
        
        # Procurar indicadores na pasta atual e pais
        for path in [current] + list(current.parents):
            if any((path / indicator).exists() for indicator in indicators):
                return path
        
        return current
    
    def _load_config(self) -> Dict[str, Any]:
        """Carrega configuração ou usa padrão"""
        config_path = self.root_path / 'universal_validator_config.json'
        
        if config_path.exists():
            try:
                with open(config_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"{Colors.YELLOW}⚠️ Erro ao carregar config: {e}{Colors.END}")
        
        # Configuração padrão
        return {
            "areas": {
                "front_office": {"enabled": True},
                "back_office": {"enabled": True},
                "game": {"enabled": True},
                "components": {"enabled": True}
            }
        }
    
    def run(self):
        """Executa o CLI interativo"""
        self._show_header()
        
        while True:
            try:
                choice = self._show_main_menu()
                
                if choice == '0':
                    self._exit_gracefully()
                elif choice == '1':
                    self._quick_validation()
                elif choice == '2':
                    self._selective_validation()
                elif choice == '3':
                    self._full_project_validation()
                elif choice == '4':
                    self._show_project_structure()
                elif choice == '5':
                    self._configure_validator()
                elif choice == '6':
                    self._view_last_report()
                elif choice == '7':
                    self._help_menu()
                else:
                    print(f"{Colors.RED}❌ Opção inválida. Tente novamente.{Colors.END}")
                    
                if choice != '0':
                    input(f"\n{Colors.CYAN}Pressione ENTER para continuar...{Colors.END}")
                    
            except KeyboardInterrupt:
                self._exit_gracefully()
            except Exception as e:
                print(f"{Colors.RED}❌ Erro inesperado: {e}{Colors.END}")
                input(f"{Colors.CYAN}Pressione ENTER para continuar...{Colors.END}")
    
    def _show_header(self):
        """Mostra cabeçalho do aplicativo"""
        os.system('cls' if os.name == 'nt' else 'clear')
        print(f"{Colors.BOLD}{Colors.PURPLE}╔══════════════════════════════════════════════════════════╗{Colors.END}")
        print(f"{Colors.BOLD}{Colors.PURPLE}║          🏗️ VALIDADOR UNIVERSAL EDUCACROSS              ║{Colors.END}")
        print(f"{Colors.BOLD}{Colors.PURPLE}║              Ambiente de Prototipação v1                ║{Colors.END}")
        print(f"{Colors.BOLD}{Colors.PURPLE}╚══════════════════════════════════════════════════════════╝{Colors.END}")
        print(f"{Colors.CYAN}📁 Projeto: {self.root_path.name}{Colors.END}")
        print(f"{Colors.BLUE}🗂️ Caminho: {self.root_path}{Colors.END}")
        print()
    
    def _show_main_menu(self) -> str:
        """Mostra menu principal"""
        print(f"{Colors.BOLD}{Colors.WHITE}🎯 MENU PRINCIPAL{Colors.END}")
        print("=" * 50)
        print(f"{Colors.GREEN}1.{Colors.END} 🚀 Validação Rápida (HTML/CSS/JS)")
        print(f"{Colors.YELLOW}2.{Colors.END} 🎯 Validação Seletiva (Escolher áreas)")
        print(f"{Colors.BLUE}3.{Colors.END} 🌐 Validação Completa (Todo o projeto)")
        print(f"{Colors.PURPLE}4.{Colors.END} 📊 Visualizar Estrutura do Projeto")
        print(f"{Colors.CYAN}5.{Colors.END} ⚙️ Configurar Validador")
        print(f"{Colors.WHITE}6.{Colors.END} 📄 Ver Último Relatório")
        print(f"{Colors.YELLOW}7.{Colors.END} ❓ Ajuda e Documentação")
        print(f"{Colors.RED}0.{Colors.END} 🚪 Sair")
        print()
        
        return input(f"{Colors.BOLD}Escolha uma opção: {Colors.END}").strip()
    
    def _quick_validation(self):
        """Execução rápida com configurações padrão"""
        print(f"{Colors.BOLD}{Colors.GREEN}🚀 VALIDAÇÃO RÁPIDA{Colors.END}")
        print("=" * 40)
        print("Validando protótipos HTML/CSS/JS principais...")
        
        # Executar validador com opções rápidas
        cmd = [
            sys.executable, 
            str(self.root_path / 'universal_validator.py'),
            '--type', 'html',
            '--output', 'console'
        ]
        
        self._run_validator_command(cmd)
    
    def _selective_validation(self):
        """Validação seletiva com escolha de áreas"""
        print(f"{Colors.BOLD}{Colors.YELLOW}🎯 VALIDAÇÃO SELETIVA{Colors.END}")
        print("=" * 40)
        
        # Mostrar áreas disponíveis
        areas = self._discover_areas()
        
        if not areas:
            print(f"{Colors.RED}❌ Nenhuma área encontrada no projeto{Colors.END}")
            return
        
        print("Áreas disponíveis:")
        for i, (area_name, area_info) in enumerate(areas.items(), 1):
            status = f"{Colors.GREEN}✓{Colors.END}" if area_info['files'] > 0 else f"{Colors.YELLOW}⚠{Colors.END}"
            print(f"{status} {i}. {area_name.replace('_', '-').title()}: {area_info['files']} arquivo(s)")
        
        print()
        choice = input("Escolha as áreas (números separados por vírgula, ou 'all'): ").strip()
        
        if choice.lower() == 'all':
            selected_areas = list(areas.keys())
        else:
            try:
                indices = [int(x.strip()) - 1 for x in choice.split(',')]
                area_list = list(areas.keys())
                selected_areas = [area_list[i] for i in indices if 0 <= i < len(area_list)]
            except (ValueError, IndexError):
                print(f"{Colors.RED}❌ Seleção inválida{Colors.END}")
                return
        
        if not selected_areas:
            print(f"{Colors.RED}❌ Nenhuma área selecionada{Colors.END}")
            return
        
        print(f"\n{Colors.CYAN}Validando áreas: {', '.join(selected_areas)}{Colors.END}")
        
        # Executar validação para áreas selecionadas
        for area in selected_areas:
            area_path = areas[area]['path']
            cmd = [
                sys.executable,
                str(self.root_path / 'universal_validator.py'),
                '--path', str(area_path),
                '--output', 'console'
            ]
            
            print(f"\n{Colors.BLUE}📁 Validando {area}...{Colors.END}")
            self._run_validator_command(cmd)
    
    def _full_project_validation(self):
        """Validação completa do projeto"""
        print(f"{Colors.BOLD}{Colors.BLUE}🌐 VALIDAÇÃO COMPLETA{Colors.END}")
        print("=" * 40)
        print("Executando validação em TODAS as áreas do projeto...")
        print("Isso pode demorar alguns minutos...")
        
        # Executar validação completa
        cmd = [
            sys.executable,
            str(self.root_path / 'universal_validator.py'),
            '--type', 'all',
            '--output', 'json'
        ]
        
        self._run_validator_command(cmd)
        
        # Mostrar localização do relatório
        report_file = self.root_path / 'universal_validation_report.json'
        if report_file.exists():
            print(f"\n{Colors.GREEN}📁 Relatório completo salvo em:{Colors.END}")
            print(f"   {Colors.CYAN}{report_file}{Colors.END}")
    
    def _show_project_structure(self):
        """Mostra estrutura detalhada do projeto"""
        print(f"{Colors.BOLD}{Colors.PURPLE}📊 ESTRUTURA DO PROJETO{Colors.END}")
        print("=" * 50)
        
        areas = self._discover_areas()
        
        for area_name, area_info in areas.items():
            status_color = Colors.GREEN if area_info['files'] > 0 else Colors.YELLOW
            print(f"\n{status_color}📁 {area_name.replace('_', '-').upper()}{Colors.END}")
            print(f"   📍 Caminho: {area_info['path']}")
            print(f"   📊 Arquivos: {area_info['files']}")
            
            if area_info['types']:
                types_str = ', '.join(f"{t}: {c}" for t, c in area_info['types'].items())
                print(f"   📋 Tipos: {types_str}")
        
        # Mostrar estatísticas totais
        total_files = sum(area['files'] for area in areas.values())
        print(f"\n{Colors.BOLD}{Colors.WHITE}📊 TOTAIS:{Colors.END}")
        print(f"   📁 Áreas encontradas: {len(areas)}")
        print(f"   📄 Total de arquivos: {total_files}")
    
    def _configure_validator(self):
        """Menu de configuração"""
        print(f"{Colors.BOLD}{Colors.CYAN}⚙️ CONFIGURAÇÃO{Colors.END}")
        print("=" * 30)
        
        print("1. 📝 Editar configuração manual")
        print("2. 🎯 Configurar thresholds de qualidade")
        print("3. 📋 Ativar/Desativar validações")
        print("4. 🔄 Restaurar configuração padrão")
        print("0. ↩️ Voltar")
        
        choice = input("\nEscolha uma opção: ").strip()
        
        if choice == '1':
            self._edit_config_file()
        elif choice == '2':
            self._configure_thresholds()
        elif choice == '3':
            self._toggle_validations()
        elif choice == '4':
            self._reset_config()
    
    def _edit_config_file(self):
        """Abre arquivo de configuração para edição"""
        config_file = self.root_path / 'universal_validator_config.json'
        
        if os.name == 'nt':  # Windows
            os.startfile(str(config_file))
        else:  # Linux/Mac
            subprocess.run(['xdg-open', str(config_file)])
        
        print(f"{Colors.GREEN}📝 Arquivo de configuração aberto no editor padrão{Colors.END}")
    
    def _configure_thresholds(self):
        """Configurar limites de qualidade"""
        print(f"\n{Colors.BOLD}🎯 CONFIGURAR THRESHOLDS{Colors.END}")
        
        current_gates = self.config.get('quality_gates', {})
        
        print(f"Threshold geral atual: {current_gates.get('overall_threshold', 85)}%")
        print(f"Threshold por área atual: {current_gates.get('area_threshold', 70)}%")
        
        try:
            new_overall = input("Novo threshold geral (%) [ENTER para manter]: ").strip()
            new_area = input("Novo threshold por área (%) [ENTER para manter]: ").strip()
            
            if new_overall:
                self.config.setdefault('quality_gates', {})['overall_threshold'] = float(new_overall)
            
            if new_area:
                self.config.setdefault('quality_gates', {})['area_threshold'] = float(new_area)
            
            self._save_config()
            print(f"{Colors.GREEN}✅ Thresholds atualizados{Colors.END}")
            
        except ValueError:
            print(f"{Colors.RED}❌ Valores inválidos{Colors.END}")
    
    def _toggle_validations(self):
        """Ativar/desativar validações específicas"""
        print(f"\n{Colors.BOLD}📋 GERENCIAR VALIDAÇÕES{Colors.END}")
        
        areas = self.config.get('areas', {})
        
        for area_name, area_config in areas.items():
            enabled = area_config.get('enabled', True)
            status = f"{Colors.GREEN}✓ Ativado{Colors.END}" if enabled else f"{Colors.RED}✗ Desativado{Colors.END}"
            print(f"{area_name.replace('_', '-')}: {status}")
        
        area_to_toggle = input("\nQual área deseja alterar? ").strip().replace('-', '_')
        
        if area_to_toggle in areas:
            current_status = areas[area_to_toggle].get('enabled', True)
            areas[area_to_toggle]['enabled'] = not current_status
            self._save_config()
            
            new_status = "ativada" if not current_status else "desativada"
            print(f"{Colors.GREEN}✅ Área '{area_to_toggle}' {new_status}{Colors.END}")
        else:
            print(f"{Colors.RED}❌ Área não encontrada{Colors.END}")
    
    def _reset_config(self):
        """Restaura configuração padrão"""
        confirm = input(f"{Colors.YELLOW}⚠️ Restaurar configuração padrão? (s/N): {Colors.END}").lower()
        
        if confirm in ['s', 'sim', 'y', 'yes']:
            config_file = self.root_path / 'universal_validator_config.json'
            if config_file.exists():
                config_file.unlink()
            
            self.config = self._load_config()
            print(f"{Colors.GREEN}✅ Configuração restaurada{Colors.END}")
        else:
            print(f"{Colors.BLUE}ℹ️ Operação cancelada{Colors.END}")
    
    def _view_last_report(self):
        """Visualiza último relatório gerado"""
        report_file = self.root_path / 'universal_validation_report.json'
        
        if not report_file.exists():
            print(f"{Colors.YELLOW}⚠️ Nenhum relatório encontrado{Colors.END}")
            print("Execute uma validação completa primeiro.")
            return
        
        try:
            with open(report_file, 'r', encoding='utf-8') as f:
                report = json.load(f)
            
            print(f"{Colors.BOLD}{Colors.WHITE}📄 ÚLTIMO RELATÓRIO{Colors.END}")
            print("=" * 40)
            
            # Mostrar metadados
            metadata = report.get('metadata', {})
            print(f"🕒 Data: {metadata.get('timestamp', 'N/A')}")
            print(f"📁 Projeto: {Path(metadata.get('root_path', '')).name}")
            
            # Mostrar resumo
            summary = report.get('summary', {})
            print(f"\n📊 RESUMO:")
            print(f"   📄 Arquivos validados: {summary.get('total_files_validated', 0)}")
            print(f"   🧪 Testes executados: {summary.get('total_tests_run', 0)}")
            print(f"   ✅ Passaram: {summary.get('total_passed', 0)}")
            print(f"   ❌ Falharam: {summary.get('total_failed', 0)}")
            
            overall = summary.get('overall_percentage', 0)
            color = Colors.GREEN if overall >= 85 else Colors.YELLOW if overall >= 70 else Colors.RED
            print(f"   📈 Score geral: {color}{overall:.1f}%{Colors.END}")
            
        except Exception as e:
            print(f"{Colors.RED}❌ Erro ao ler relatório: {e}{Colors.END}")
    
    def _help_menu(self):
        """Menu de ajuda"""
        print(f"{Colors.BOLD}{Colors.YELLOW}❓ AJUDA E DOCUMENTAÇÃO{Colors.END}")
        print("=" * 50)
        
        print(f"{Colors.CYAN}🎯 SOBRE O VALIDADOR UNIVERSAL:{Colors.END}")
        print("   Sistema automatizado para validar protótipos HTML/CSS/JS")
        print("   do ambiente Educacross, garantindo qualidade e padrões.")
        
        print(f"\n{Colors.GREEN}🚀 VALIDAÇÃO RÁPIDA:{Colors.END}")
        print("   Executa testes básicos nos protótipos principais.")
        print("   Ideal para verificações durante desenvolvimento.")
        
        print(f"\n{Colors.YELLOW}🎯 VALIDAÇÃO SELETIVA:{Colors.END}")
        print("   Permite escolher quais áreas validar.")
        print("   Útil para focar em partes específicas do projeto.")
        
        print(f"\n{Colors.BLUE}🌐 VALIDAÇÃO COMPLETA:{Colors.END}")
        print("   Executa todos os testes em todas as áreas.")
        print("   Gera relatório JSON detalhado.")
        
        print(f"\n{Colors.PURPLE}📋 TIPOS DE VALIDAÇÃO:{Colors.END}")
        print("   • Estrutura HTML (DOCTYPE, meta tags, semântica)")
        print("   • Qualidade CSS (variáveis, layout moderno)")
        print("   • JavaScript (ES6+, funções descritivas)")
        print("   • Integração (links CSS/JS, assets)")
        print("   • Acessibilidade (ARIA, contraste)")
        print("   • Localização brasileira")
        
        print(f"\n{Colors.CYAN}⚙️ CONFIGURAÇÃO:{Colors.END}")
        print("   Edite 'universal_validator_config.json' para:")
        print("   • Ajustar thresholds de qualidade")
        print("   • Ativar/desativar validações específicas")
        print("   • Configurar exclusões de arquivos")
        
        print(f"\n{Colors.WHITE}📞 SUPORTE:{Colors.END}")
        print("   Para dúvidas ou problemas, consulte a documentação")
        print("   em 'docs/' ou entre em contato com a equipe.")
    
    def _discover_areas(self) -> Dict[str, Dict]:
        """Descobre áreas do projeto automaticamente"""
        areas = {}
        
        # Definir padrões de busca para cada área
        area_patterns = {
            'front_office': ['Front-office', 'front-office', 'frontend'],
            'back_office': ['Back-office', 'back-office', 'backend'], 
            'game': ['Game', 'games', 'gaming'],
            'components': ['src', 'components', 'prototype-react'],
            'docs': ['docs', 'documentation']
        }
        
        for area_name, patterns in area_patterns.items():
            for pattern in patterns:
                area_path = self.root_path / pattern
                if area_path.exists() and area_path.is_dir():
                    # Contar arquivos relevantes
                    file_counts = {
                        'html': len(list(area_path.rglob('*.html'))),
                        'css': len(list(area_path.rglob('*.css'))),
                        'js': len(list(area_path.rglob('*.js'))),
                        'ts': len(list(area_path.rglob('*.ts'))),
                        'tsx': len(list(area_path.rglob('*.tsx')))
                    }
                    
                    total_files = sum(file_counts.values())
                    
                    areas[area_name] = {
                        'path': area_path,
                        'files': total_files,
                        'types': {k: v for k, v in file_counts.items() if v > 0}
                    }
                    break
        
        return areas
    
    def _run_validator_command(self, cmd: List[str]):
        """Executa comando do validador"""
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
            
            if result.stdout:
                print(result.stdout)
            
            if result.stderr:
                print(f"{Colors.RED}Avisos/Erros:{Colors.END}")
                print(result.stderr)
            
            if result.returncode == 0:
                print(f"\n{Colors.GREEN}✅ Validação concluída com sucesso{Colors.END}")
            else:
                print(f"\n{Colors.YELLOW}⚠️ Validação concluída com avisos (código: {result.returncode}){Colors.END}")
                
        except Exception as e:
            print(f"{Colors.RED}❌ Erro ao executar validação: {e}{Colors.END}")
    
    def _save_config(self):
        """Salva configuração atual"""
        config_file = self.root_path / 'universal_validator_config.json'
        
        try:
            with open(config_file, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"{Colors.RED}❌ Erro ao salvar configuração: {e}{Colors.END}")
    
    def _exit_gracefully(self):
        """Sair do aplicativo"""
        print(f"\n{Colors.CYAN}👋 Obrigado por usar o Validador Universal Educacross!{Colors.END}")
        print(f"{Colors.BLUE}🚀 Continue criando protótipos incríveis!{Colors.END}")
        sys.exit(0)

def main():
    """Função principal"""
    try:
        validator = InteractiveValidator()
        validator.run()
    except Exception as e:
        print(f"{Colors.RED}❌ Erro crítico: {e}{Colors.END}")
        sys.exit(1)

if __name__ == "__main__":
    main()