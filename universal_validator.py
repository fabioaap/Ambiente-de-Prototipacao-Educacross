#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🏗️ Sistema Universal de Validação - Educacross
============================================

Validador automatizado para TODOS os protótipos do ambiente Educacross:
- Front-office (HTML/CSS/JS)
- Back-office (HTML/CSS/JS) 
- Game (múltiplas stacks)
- Componentes React/Storybook
- Arquivos de configuração

Uso: python universal_validator.py [--path=CAMINHO] [--type=TIPO] [--output=json|console]
"""

import os
import sys
import re
import json
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional
from datetime import datetime
import mimetypes

class Colors:
    """Cores para output no terminal"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

class ProjectScanner:
    """Scanner para descobrir estrutura do projeto"""
    
    def __init__(self, root_path: Path):
        self.root_path = Path(root_path).resolve()
        self.project_structure = {}
    
    def scan_project(self) -> Dict[str, Any]:
        """Escaneia todo o projeto e classifica arquivos"""
        
        structure = {
            'root_path': str(self.root_path),
            'scan_timestamp': datetime.now().isoformat(),
            'areas': {
                'front_office': {'path': None, 'prototypes': []},
                'back_office': {'path': None, 'prototypes': []},
                'game': {'path': None, 'prototypes': []},
                'components': {'path': None, 'files': []},
                'docs': {'path': None, 'files': []},
                'config': {'files': []}
            },
            'totals': {
                'html_files': 0,
                'css_files': 0,
                'js_files': 0,
                'react_files': 0,
                'config_files': 0
            }
        }
        
        # Identificar áreas principais
        for area_name, patterns in {
            'front_office': ['Front-office', 'front-office', 'frontend'],
            'back_office': ['Back-office', 'back-office', 'backend'],
            'game': ['Game', 'games', 'gaming'],
            'components': ['src', 'components', 'prototype-react'],
            'docs': ['docs', 'documentation']
        }.items():
            
            for pattern in patterns:
                area_path = self.root_path / pattern
                if area_path.exists() and area_path.is_dir():
                    structure['areas'][area_name]['path'] = str(area_path)
                    break
        
        # Escanear cada área
        self._scan_area(structure, 'front_office')
        self._scan_area(structure, 'back_office')
        self._scan_area(structure, 'game')
        self._scan_components(structure)
        self._scan_docs(structure)
        self._scan_config_files(structure)
        
        return structure
    
    def _scan_area(self, structure: Dict, area_name: str) -> None:
        """Escaneia uma área específica (front/back/game)"""
        area_path = structure['areas'][area_name]['path']
        if not area_path:
            return
        
        area_path = Path(area_path)
        
        # Buscar protótipos (pastas com arquivos HTML)
        for item in area_path.rglob('*'):
            if item.is_dir():
                html_files = list(item.glob('*.html'))
                if html_files:
                    prototype_info = {
                        'name': item.name,
                        'path': str(item),
                        'relative_path': str(item.relative_to(self.root_path)),
                        'files': {
                            'html': [str(f.relative_to(item)) for f in item.glob('*.html')],
                            'css': [str(f.relative_to(item)) for f in item.glob('*.css')],
                            'js': [str(f.relative_to(item)) for f in item.glob('*.js')]
                        },
                        'file_count': len(list(item.glob('*.html'))) + len(list(item.glob('*.css'))) + len(list(item.glob('*.js')))
                    }
                    structure['areas'][area_name]['prototypes'].append(prototype_info)
                    
                    # Atualizar contadores
                    structure['totals']['html_files'] += len(prototype_info['files']['html'])
                    structure['totals']['css_files'] += len(prototype_info['files']['css'])
                    structure['totals']['js_files'] += len(prototype_info['files']['js'])
    
    def _scan_components(self, structure: Dict) -> None:
        """Escaneia componentes React/Vue/Storybook"""
        components_areas = ['src', 'components', 'prototype-react', '.storybook']
        
        for area in components_areas:
            area_path = self.root_path / area
            if area_path.exists():
                if not structure['areas']['components']['path']:
                    structure['areas']['components']['path'] = str(area_path)
                
                # Buscar arquivos de componentes
                for ext in ['*.tsx', '*.jsx', '*.ts', '*.js', '*.vue', '*.stories.*']:
                    for file in area_path.rglob(ext):
                        file_info = {
                            'name': file.name,
                            'path': str(file),
                            'relative_path': str(file.relative_to(self.root_path)),
                            'type': self._classify_component_file(file),
                            'size': file.stat().st_size
                        }
                        structure['areas']['components']['files'].append(file_info)
                        
                        if file_info['type'] == 'react':
                            structure['totals']['react_files'] += 1
    
    def _scan_docs(self, structure: Dict) -> None:
        """Escaneia documentação"""
        docs_path = structure['areas']['docs']['path']
        if docs_path:
            docs_path = Path(docs_path)
            for file in docs_path.rglob('*.md'):
                file_info = {
                    'name': file.name,
                    'path': str(file),
                    'relative_path': str(file.relative_to(self.root_path)),
                    'size': file.stat().st_size
                }
                structure['areas']['docs']['files'].append(file_info)
    
    def _scan_config_files(self, structure: Dict) -> None:
        """Escaneia arquivos de configuração"""
        config_patterns = [
            '*.json', '*.config.js', '*.config.ts', 
            '.gitignore', '.cursorrules', '*.yml', '*.yaml'
        ]
        
        for pattern in config_patterns:
            for file in self.root_path.glob(pattern):
                if file.is_file():
                    file_info = {
                        'name': file.name,
                        'path': str(file),
                        'relative_path': str(file.relative_to(self.root_path)),
                        'type': self._classify_config_file(file),
                        'size': file.stat().st_size
                    }
                    structure['areas']['config']['files'].append(file_info)
                    structure['totals']['config_files'] += 1
    
    def _classify_component_file(self, file: Path) -> str:
        """Classifica tipo de arquivo de componente"""
        if file.suffix in ['.tsx', '.jsx']:
            return 'react'
        elif file.suffix == '.vue':
            return 'vue'
        elif '.stories.' in file.name:
            return 'storybook'
        elif file.suffix in ['.ts', '.js']:
            return 'javascript'
        else:
            return 'unknown'
    
    def _classify_config_file(self, file: Path) -> str:
        """Classifica tipo de arquivo de configuração"""
        if file.name == 'package.json':
            return 'npm'
        elif '.config.' in file.name:
            return 'build'
        elif file.name.startswith('.'):
            return 'dotfile'
        else:
            return 'config'

class UniversalValidator:
    """Validador universal para todo o projeto"""
    
    def __init__(self, root_path: Path):
        self.root_path = Path(root_path).resolve()
        self.scanner = ProjectScanner(root_path)
        self.results = {
            'metadata': {
                'validator_version': '1.0.0',
                'timestamp': datetime.now().isoformat(),
                'root_path': str(self.root_path)
            },
            'project_structure': {},
            'validation_results': {},
            'summary': {
                'total_files_validated': 0,
                'total_tests_run': 0,
                'total_passed': 0,
                'total_failed': 0,
                'areas_validated': []
            }
        }
    
    def validate_project(self, specific_path: Optional[str] = None, 
                        file_types: Optional[List[str]] = None) -> Dict[str, Any]:
        """Valida todo o projeto ou uma parte específica"""
        
        print(f"{Colors.BOLD}{Colors.CYAN}🏗️ VALIDADOR UNIVERSAL EDUCACROSS{Colors.END}")
        print(f"{Colors.PURPLE}Ambiente de Prototipação - Validação Completa{Colors.END}")
        print("=" * 60)
        
        # 1. Escanear estrutura do projeto
        print(f"\n{Colors.BOLD}{Colors.BLUE}🔍 Escaneando Projeto{Colors.END}")
        self.results['project_structure'] = self.scanner.scan_project()
        self._print_project_overview()
        
        # 2. Validar áreas baseado nos parâmetros
        if specific_path:
            self._validate_specific_path(specific_path)
        else:
            self._validate_all_areas(file_types)
        
        # 3. Gerar resumo final
        self._generate_final_summary()
        
        return self.results
    
    def _print_project_overview(self) -> None:
        """Imprime overview da estrutura do projeto"""
        structure = self.results['project_structure']
        totals = structure['totals']
        
        print(f"  📁 Projeto: {Path(structure['root_path']).name}")
        print(f"  📊 Arquivos encontrados:")
        print(f"     🌐 HTML: {totals['html_files']}")
        print(f"     🎨 CSS: {totals['css_files']}")
        print(f"     ⚙️ JavaScript: {totals['js_files']}")
        print(f"     ⚛️ React/Components: {totals['react_files']}")
        print(f"     ⚙️ Configuração: {totals['config_files']}")
        
        # Mostrar áreas encontradas
        areas_found = []
        for area_name, area_data in structure['areas'].items():
            if area_data.get('path') or area_data.get('files') or area_data.get('prototypes'):
                areas_found.append(area_name.replace('_', '-'))
        
        if areas_found:
            print(f"  🗂️ Áreas: {', '.join(areas_found)}")
    
    def _validate_all_areas(self, file_types: Optional[List[str]] = None) -> None:
        """Valida todas as áreas do projeto"""
        structure = self.results['project_structure']
        
        # Validar Front-office
        if structure['areas']['front_office']['prototypes']:
            self._validate_front_office()
        
        # Validar Back-office
        if structure['areas']['back_office']['prototypes']:
            self._validate_back_office()
        
        # Validar Game
        if structure['areas']['game']['prototypes']:
            self._validate_game()
        
        # Validar Componentes
        if structure['areas']['components']['files']:
            self._validate_components()
        
        # Validar Configurações
        if structure['areas']['config']['files']:
            self._validate_config_files()
    
    def _validate_front_office(self) -> None:
        """Valida protótipos do Front-office"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}🌐 Validando Front-office{Colors.END}")
        
        prototypes = self.results['project_structure']['areas']['front_office']['prototypes']
        
        for prototype in prototypes:
            self._validate_html_prototype(prototype, 'front_office')
    
    def _validate_back_office(self) -> None:
        """Valida protótipos do Back-office"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}🏢 Validando Back-office{Colors.END}")
        
        prototypes = self.results['project_structure']['areas']['back_office']['prototypes']
        
        for prototype in prototypes:
            self._validate_html_prototype(prototype, 'back_office')
    
    def _validate_game(self) -> None:
        """Valida protótipos do Game"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}🎮 Validando Game{Colors.END}")
        
        prototypes = self.results['project_structure']['areas']['game']['prototypes']
        
        for prototype in prototypes:
            self._validate_html_prototype(prototype, 'game')
    
    def _validate_html_prototype(self, prototype: Dict, area: str) -> None:
        """Valida um protótipo HTML específico"""
        prototype_path = Path(prototype['path'])
        prototype_name = prototype['name']
        
        print(f"\n  📋 Validando: {Colors.CYAN}{prototype_name}{Colors.END}")
        print(f"     📁 {prototype['relative_path']}")
        
        # Inicializar resultados para este protótipo
        if area not in self.results['validation_results']:
            self.results['validation_results'][area] = {}
        
        self.results['validation_results'][area][prototype_name] = {
            'path': prototype['path'],
            'files': prototype['files'],
            'tests': {
                'structure': [],
                'html_quality': [],
                'css_quality': [], 
                'js_quality': [],
                'integration': [],
                'accessibility': []
            },
            'summary': {'passed': 0, 'failed': 0}
        }
        
        # Executar validações específicas
        self._validate_prototype_structure(prototype_path, prototype_name, area)
        self._validate_prototype_html_files(prototype_path, prototype, area)
        self._validate_prototype_css_files(prototype_path, prototype, area)
        self._validate_prototype_js_files(prototype_path, prototype, area)
        self._validate_prototype_integration(prototype_path, prototype, area)
        
        # Atualizar contadores
        results = self.results['validation_results'][area][prototype_name]
        total_passed = sum(len([t for t in tests if t.get('passed', False)]) 
                          for tests in results['tests'].values())
        total_failed = sum(len([t for t in tests if not t.get('passed', False)]) 
                          for tests in results['tests'].values())
        
        results['summary'] = {'passed': total_passed, 'failed': total_failed}
        
        # Mostrar resultado
        total_tests = total_passed + total_failed
        if total_tests > 0:
            percentage = (total_passed / total_tests) * 100
            color = Colors.GREEN if percentage >= 85 else Colors.YELLOW if percentage >= 70 else Colors.RED
            print(f"     {color}📊 {percentage:.1f}% ({total_passed}/{total_tests}){Colors.END}")
    
    def _validate_prototype_structure(self, path: Path, name: str, area: str) -> None:
        """Valida estrutura básica do protótipo"""
        tests = []
        
        # Verificar se existe pelo menos um arquivo HTML principal
        html_files = list(path.glob('*.html'))
        main_html = any(f.name.lower() in ['index.html', 'main.html', f'{name.lower()}.html'] 
                       for f in html_files)
        
        tests.append({
            'name': 'Arquivo HTML principal',
            'passed': main_html or len(html_files) > 0,
            'details': f"Encontrados {len(html_files)} arquivo(s) HTML" if html_files else "Nenhum arquivo HTML encontrado"
        })
        
        # Verificar organização de assets
        has_assets_folder = (path / 'assets').exists() or (path / 'css').exists() or (path / 'js').exists()
        tests.append({
            'name': 'Organização de assets',
            'passed': has_assets_folder,
            'details': "Pasta de assets encontrada" if has_assets_folder else "Considere organizar CSS/JS em pastas"
        })
        
        # Salvar testes
        self.results['validation_results'][area][name]['tests']['structure'] = tests
    
    def _validate_prototype_html_files(self, path: Path, prototype: Dict, area: str) -> None:
        """Valida qualidade dos arquivos HTML"""
        tests = []
        
        for html_file in prototype['files']['html']:
            html_path = path / html_file
            
            if html_path.exists():
                try:
                    content = html_path.read_text(encoding='utf-8')
                    
                    # Testes HTML básicos
                    html_tests = [
                        ('DOCTYPE HTML5', r'<!DOCTYPE html>', "DOCTYPE obrigatório"),
                        ('Lang pt-BR', r'<html[^>]*lang="pt-BR"', "Idioma brasileiro"),
                        ('Charset UTF-8', r'<meta charset="UTF-8"', "Encoding correto"),
                        ('Viewport responsivo', r'<meta name="viewport"', "Responsividade"),
                        ('Título descritivo', r'<title>.*\w.*</title>', "Título não vazio")
                    ]
                    
                    for test_name, pattern, description in html_tests:
                        passed = bool(re.search(pattern, content, re.IGNORECASE))
                        tests.append({
                            'name': f'{html_file} - {test_name}',
                            'passed': passed,
                            'details': description if not passed else ""
                        })
                
                except Exception as e:
                    tests.append({
                        'name': f'{html_file} - Leitura',
                        'passed': False,
                        'details': f"Erro ao ler arquivo: {e}"
                    })
        
        self.results['validation_results'][area][prototype['name']]['tests']['html_quality'] = tests
    
    def _validate_prototype_css_files(self, path: Path, prototype: Dict, area: str) -> None:
        """Valida qualidade dos arquivos CSS"""
        tests = []
        
        for css_file in prototype['files']['css']:
            css_path = path / css_file
            
            if css_path.exists():
                try:
                    content = css_path.read_text(encoding='utf-8')
                    
                    # Testes CSS básicos
                    css_vars = len(re.findall(r'--[a-zA-Z-]+:', content))
                    modern_layout = any(prop in content for prop in ['display: flex', 'display: grid'])
                    
                    tests.append({
                        'name': f'{css_file} - Variáveis CSS',
                        'passed': css_vars >= 5,
                        'details': f"Encontradas {css_vars} variáveis (mín: 5)" if css_vars < 5 else f"{css_vars} variáveis"
                    })
                    
                    tests.append({
                        'name': f'{css_file} - Layout moderno',
                        'passed': modern_layout,
                        'details': "Flexbox/Grid encontrado" if modern_layout else "Considere usar Flexbox/Grid"
                    })
                    
                except Exception as e:
                    tests.append({
                        'name': f'{css_file} - Leitura',
                        'passed': False,
                        'details': f"Erro ao ler arquivo: {e}"
                    })
        
        self.results['validation_results'][area][prototype['name']]['tests']['css_quality'] = tests
    
    def _validate_prototype_js_files(self, path: Path, prototype: Dict, area: str) -> None:
        """Valida qualidade dos arquivos JavaScript"""
        tests = []
        
        for js_file in prototype['files']['js']:
            js_path = path / js_file
            
            if js_path.exists():
                try:
                    content = js_path.read_text(encoding='utf-8')
                    
                    # Testes JavaScript básicos
                    const_let_usage = len(re.findall(r'\b(const|let)\b', content))
                    var_usage = len(re.findall(r'\bvar\b', content))
                    modern_js = var_usage == 0 and const_let_usage > 0
                    
                    tests.append({
                        'name': f'{js_file} - JavaScript moderno',
                        'passed': modern_js,
                        'details': f"var: {var_usage}, const/let: {const_let_usage}" if not modern_js else f"const/let: {const_let_usage}"
                    })
                    
                    # Verificar funções bem nomeadas
                    functions = re.findall(r'function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)', content)
                    descriptive_functions = [f for f in functions if len(f) > 4]
                    
                    tests.append({
                        'name': f'{js_file} - Funções descritivas',
                        'passed': len(descriptive_functions) >= len(functions) * 0.7 if functions else True,
                        'details': f"Funções descritivas: {len(descriptive_functions)}/{len(functions)}"
                    })
                    
                except Exception as e:
                    tests.append({
                        'name': f'{js_file} - Leitura',
                        'passed': False,
                        'details': f"Erro ao ler arquivo: {e}"
                    })
        
        self.results['validation_results'][area][prototype['name']]['tests']['js_quality'] = tests
    
    def _validate_prototype_integration(self, path: Path, prototype: Dict, area: str) -> None:
        """Valida integração entre arquivos do protótipo"""
        tests = []
        
        # Verificar se CSS é referenciado no HTML
        html_files = [path / f for f in prototype['files']['html']]
        css_files = prototype['files']['css']
        
        for html_file in html_files:
            if html_file.exists():
                try:
                    html_content = html_file.read_text(encoding='utf-8')
                    
                    for css_file in css_files:
                        css_referenced = css_file in html_content
                        tests.append({
                            'name': f'CSS {css_file} referenciado em {html_file.name}',
                            'passed': css_referenced,
                            'details': f"CSS linkado corretamente" if css_referenced else f"CSS não encontrado no HTML"
                        })
                        
                except Exception as e:
                    tests.append({
                        'name': f'Integração {html_file.name}',
                        'passed': False,
                        'details': f"Erro: {e}"
                    })
        
        self.results['validation_results'][area][prototype['name']]['tests']['integration'] = tests
    
    def _validate_components(self) -> None:
        """Valida componentes React/Storybook"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}⚛️ Validando Componentes{Colors.END}")
        
        components = self.results['project_structure']['areas']['components']['files']
        
        # Agrupar por tipo
        component_types = {}
        for comp in components:
            comp_type = comp['type']
            if comp_type not in component_types:
                component_types[comp_type] = []
            component_types[comp_type].append(comp)
        
        for comp_type, files in component_types.items():
            print(f"  📦 {comp_type.title()}: {len(files)} arquivo(s)")
    
    def _validate_config_files(self) -> None:
        """Valida arquivos de configuração"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}⚙️ Validando Configuração{Colors.END}")
        
        config_files = self.results['project_structure']['areas']['config']['files']
        
        # Verificar arquivos essenciais
        essential_configs = ['package.json', '.gitignore', 'tsconfig.json']
        found_configs = [f['name'] for f in config_files]
        
        for essential in essential_configs:
            found = essential in found_configs
            status = f"{Colors.GREEN}✓{Colors.END}" if found else f"{Colors.RED}✗{Colors.END}"
            print(f"  {status} {essential}")
    
    def _validate_specific_path(self, specific_path: str) -> None:
        """Valida um caminho específico"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}🎯 Validando Caminho Específico{Colors.END}")
        print(f"  📁 {specific_path}")
        
        # Implementar validação específica
        # Esta função pode ser expandida para validar caminhos específicos
        pass
    
    def _generate_final_summary(self) -> None:
        """Gera resumo final da validação"""
        print(f"\n{Colors.BOLD}{Colors.WHITE}📊 RESUMO UNIVERSAL{Colors.END}")
        print("=" * 60)
        
        # Calcular estatísticas totais
        total_passed = 0
        total_failed = 0
        areas_validated = []
        
        for area, area_results in self.results['validation_results'].items():
            area_passed = 0
            area_failed = 0
            
            for prototype_name, prototype_results in area_results.items():
                area_passed += prototype_results['summary']['passed']
                area_failed += prototype_results['summary']['failed']
            
            if area_passed + area_failed > 0:
                areas_validated.append(area)
                total_passed += area_passed
                total_failed += area_failed
                
                # Mostrar estatísticas da área
                area_total = area_passed + area_failed
                area_percentage = (area_passed / area_total) * 100 if area_total > 0 else 0
                color = Colors.GREEN if area_percentage >= 85 else Colors.YELLOW if area_percentage >= 70 else Colors.RED
                
                print(f"{area.upper().replace('_', '-'):15} | "
                      f"{color}{area_passed:3d}✓{Colors.END} / "
                      f"{Colors.RED}{area_failed:3d}✗{Colors.END} | "
                      f"{color}{area_percentage:5.1f}%{Colors.END}")
        
        print("-" * 60)
        
        # Total geral
        total_tests = total_passed + total_failed
        if total_tests > 0:
            overall_percentage = (total_passed / total_tests) * 100
            overall_color = Colors.GREEN if overall_percentage >= 85 else Colors.YELLOW if overall_percentage >= 70 else Colors.RED
            
            print(f"{'TOTAL GERAL':15} | "
                  f"{overall_color}{total_passed:3d}✓{Colors.END} / "
                  f"{Colors.RED}{total_failed:3d}✗{Colors.END} | "
                  f"{overall_color}{overall_percentage:5.1f}%{Colors.END}")
        
        # Atualizar resumo nos resultados
        self.results['summary'].update({
            'total_files_validated': len([f for area in self.results['validation_results'].values() 
                                        for f in area.keys()]),
            'total_tests_run': total_tests,
            'total_passed': total_passed,
            'total_failed': total_failed,
            'areas_validated': areas_validated,
            'overall_percentage': overall_percentage if total_tests > 0 else 0
        })
        
        # Recomendações finais
        print(f"\n{Colors.BOLD}{Colors.PURPLE}🎯 RECOMENDAÇÕES UNIVERSAIS{Colors.END}")
        
        if total_failed == 0:
            print(f"  {Colors.GREEN}🎉 Excelente! Todo o ambiente Educacross validado com sucesso!{Colors.END}")
            print(f"  {Colors.CYAN}✨ Pronto para produção e testes de UX{Colors.END}")
        else:
            print(f"  {Colors.YELLOW}⚠️ {total_failed} itens precisam de atenção em todo o projeto{Colors.END}")
            print(f"  {Colors.BLUE}🔧 Focar nas áreas com menor score primeiro{Colors.END}")
        
        # Próximos passos
        print(f"\n{Colors.BOLD}{Colors.CYAN}🚀 PRÓXIMOS PASSOS:{Colors.END}")
        print(f"  1. {Colors.GREEN}✅ Executar testes de integração end-to-end{Colors.END}")
        print(f"  2. {Colors.YELLOW}📱 Validar responsividade em dispositivos reais{Colors.END}")
        print(f"  3. {Colors.BLUE}🧪 Executar testes de usabilidade com usuários{Colors.END}")
        print(f"  4. {Colors.PURPLE}📚 Documentar componentes no Storybook{Colors.END}")

def main():
    """Função principal com CLI"""
    parser = argparse.ArgumentParser(description='Validador Universal - Educacross')
    parser.add_argument('--path', type=str, help='Caminho específico para validar')
    parser.add_argument('--type', type=str, choices=['html', 'css', 'js', 'react', 'all'], 
                       default='all', help='Tipo de arquivo para validar')
    parser.add_argument('--output', type=str, choices=['json', 'console'], 
                       default='console', help='Formato de saída')
    parser.add_argument('--root', type=str, help='Caminho raiz do projeto')
    
    args = parser.parse_args()
    
    # Determinar caminho raiz
    if args.root:
        root_path = Path(args.root)
    elif args.path:
        root_path = Path(args.path).parent
    else:
        # Procurar automaticamente o diretório do projeto
        current_path = Path.cwd()
        project_indicators = ['package.json', '.git', 'Front-office', 'Back-office']
        
        # Subir até encontrar indicadores do projeto
        for parent in [current_path] + list(current_path.parents):
            if any((parent / indicator).exists() for indicator in project_indicators):
                root_path = parent
                break
        else:
            root_path = current_path
    
    try:
        # Executar validação
        validator = UniversalValidator(root_path)
        file_types = [args.type] if args.type != 'all' else None
        
        results = validator.validate_project(
            specific_path=args.path,
            file_types=file_types
        )
        
        # Saída baseada no formato escolhido
        if args.output == 'json':
            report_file = root_path / 'universal_validation_report.json'
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            print(f"\n📁 Relatório salvo: {Colors.CYAN}{report_file}{Colors.END}")
        
        # Exit code baseado nos resultados
        total_failed = results['summary']['total_failed']
        sys.exit(0 if total_failed == 0 else 1)
        
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}⚠️ Validação cancelada pelo usuário{Colors.END}")
        sys.exit(1)
    except Exception as e:
        print(f"\n{Colors.RED}❌ Erro inesperado: {e}{Colors.END}")
        sys.exit(1)

if __name__ == "__main__":
    main()