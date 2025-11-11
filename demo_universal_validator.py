#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎯 Demo Rápida - Sistema Universal de Validação Educacross
=======================================================

Demonstração rápida das principais funcionalidades do sistema.
Executar todas as validações principais em sequência.
"""

import os
import sys
import subprocess
from pathlib import Path
import time

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header(title):
    """Imprime cabeçalho estilizado"""
    print(f"\n{Colors.BOLD}{Colors.PURPLE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.WHITE}{title:^60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.PURPLE}{'='*60}{Colors.END}")

def run_command(cmd, description):
    """Executa comando e mostra resultado"""
    print(f"\n{Colors.BLUE}🚀 {description}{Colors.END}")
    print(f"{Colors.CYAN}Comando: {' '.join(cmd)}{Colors.END}")
    
    start_time = time.time()
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
        duration = time.time() - start_time
        
        # Mostrar resultado resumido
        if result.returncode == 0:
            print(f"{Colors.GREEN}✅ Sucesso ({duration:.1f}s){Colors.END}")
        else:
            print(f"{Colors.YELLOW}⚠️ Concluído com avisos ({duration:.1f}s){Colors.END}")
        
        # Extrair linhas importantes do output
        if result.stdout:
            lines = result.stdout.split('\n')
            important_lines = []
            
            for line in lines:
                if any(keyword in line.lower() for keyword in ['resumo', 'total', '%', 'score', 'passou', 'falhou']):
                    important_lines.append(line)
            
            if important_lines:
                print(f"{Colors.WHITE}📊 Resultado:{Colors.END}")
                for line in important_lines[-5:]:  # Últimas 5 linhas importantes
                    if line.strip():
                        print(f"   {line}")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"{Colors.RED}❌ Erro: {e}{Colors.END}")
        return False

def demo_complete():
    """Demonstração completa do sistema"""
    
    print_header("🏗️ DEMO - SISTEMA UNIVERSAL EDUCACROSS")
    print(f"{Colors.CYAN}Demonstração das principais funcionalidades{Colors.END}")
    
    root_path = Path.cwd()
    print(f"📁 Projeto: {root_path.name}")
    
    demos = [
        # 1. Validação básica
        {
            'cmd': ['python', 'universal_validator.py'],
            'desc': 'Validação Universal Completa'
        },
        
        # 2. Validação específica HTML
        {
            'cmd': ['python', 'universal_validator.py', '--type=html'],
            'desc': 'Validação Focada em HTML'
        },
        
        # 3. Validação de área específica
        {
            'cmd': ['python', 'universal_validator.py', '--path=Front-office'],
            'desc': 'Validação do Front-office'
        },
        
        # 4. Geração de relatório JSON
        {
            'cmd': ['python', 'universal_validator.py', '--output=json'],
            'desc': 'Relatório JSON Detalhado'
        },
        
        # 5. Simulação CI/CD
        {
            'cmd': ['python', 'ci_validator.py', '--mode=ci', '--threshold=70'],
            'desc': 'Simulação Pipeline CI/CD'
        }
    ]
    
    successful_demos = 0
    
    for i, demo in enumerate(demos, 1):
        print_header(f"DEMO {i}/{len(demos)}: {demo['desc']}")
        
        success = run_command(demo['cmd'], demo['desc'])
        if success:
            successful_demos += 1
        
        # Pausa entre demos
        if i < len(demos):
            print(f"\n{Colors.YELLOW}⏳ Aguardando 2 segundos...{Colors.END}")
            time.sleep(2)
    
    # Resumo final
    print_header("📊 RESUMO DA DEMONSTRAÇÃO")
    
    success_rate = (successful_demos / len(demos)) * 100
    color = Colors.GREEN if success_rate >= 80 else Colors.YELLOW if success_rate >= 60 else Colors.RED
    
    print(f"{color}📈 Taxa de sucesso: {success_rate:.0f}% ({successful_demos}/{len(demos)}){Colors.END}")
    
    if successful_demos == len(demos):
        print(f"{Colors.GREEN}🎉 Todas as funcionalidades demonstradas com sucesso!{Colors.END}")
        print(f"{Colors.CYAN}✨ Sistema pronto para uso em produção{Colors.END}")
    else:
        print(f"{Colors.YELLOW}⚠️ Algumas funcionalidades precisam de ajustes{Colors.END}")
        print(f"{Colors.BLUE}🔧 Verificar logs específicos para detalhes{Colors.END}")
    
    # Mostrar arquivos gerados
    generated_files = [
        'universal_validation_report.json',
        'validation-artifacts/validation_summary.json',
        'validation-artifacts/quality_badge.svg'
    ]
    
    print(f"\n{Colors.BOLD}📁 ARQUIVOS GERADOS:{Colors.END}")
    for file_path in generated_files:
        if Path(file_path).exists():
            print(f"   {Colors.GREEN}✓{Colors.END} {file_path}")
        else:
            print(f"   {Colors.YELLOW}⚠{Colors.END} {file_path} (não encontrado)")
    
    print(f"\n{Colors.BOLD}{Colors.PURPLE}🚀 PRÓXIMOS PASSOS:{Colors.END}")
    print(f"   1. {Colors.GREEN}Usar CLI interativo:{Colors.END} python interactive_validator.py")
    print(f"   2. {Colors.BLUE}Integrar no CI/CD:{Colors.END} python ci_validator.py --mode=ci")
    print(f"   3. {Colors.YELLOW}Configurar thresholds:{Colors.END} Editar universal_validator_config.json")
    print(f"   4. {Colors.CYAN}Documentação completa:{Colors.END} README_VALIDACAO_UNIVERSAL.md")

def main():
    """Função principal"""
    try:
        demo_complete()
    except KeyboardInterrupt:
        print(f"\n{Colors.CYAN}👋 Demonstração interrompida pelo usuário{Colors.END}")
    except Exception as e:
        print(f"\n{Colors.RED}❌ Erro na demonstração: {e}{Colors.END}")

if __name__ == "__main__":
    main()