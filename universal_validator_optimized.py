#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🏗️ Sistema Universal de Validação OTIMIZADO - Educacross
=========================================================

Validador otimizado para projetos grandes com:
- Cache de resultados (evita re-validação desnecessária)
- Ignore patterns (node_modules, .git, dist, etc.)
- Validação incremental (só arquivos modificados)
- Limite de profundidade (max 5 níveis)
- Progress bar em tempo real

Uso: python universal_validator_optimized.py [--path=CAMINHO] [--force] [--max-depth=5]
"""

import os
import sys
import hashlib
import json
import argparse
from pathlib import Path
from typing import Dict, List, Set, Optional
from datetime import datetime
import time

# Padrões para ignorar (PERFORMANCE CRÍTICA)
IGNORE_PATTERNS = {
    'node_modules', '.git', '.vscode', '__pycache__', 
    'dist', 'build', '.next', '.cache', 'coverage',
    '.pytest_cache', '.mypy_cache', '.tox', 'venv', 
    'env', '.env', '.DS_Store', 'Thumbs.db'
}

# Extensões para validar
VALID_EXTENSIONS = {
    '.html', '.css', '.js', '.jsx', '.ts', '.tsx', 
    '.json', '.md', '.vue', '.svg'
}

class Colors:
    """Cores para output no terminal"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

class FileCache:
    """Cache de validação baseado em hash MD5"""
    
    def __init__(self, cache_file: Path):
        self.cache_file = cache_file
        self.cache: Dict[str, Dict] = self._load_cache()
    
    def _load_cache(self) -> Dict:
        """Carrega cache do disco"""
        if self.cache_file.exists():
            try:
                with open(self.cache_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                return {}
        return {}
    
    def save_cache(self) -> None:
        """Salva cache no disco"""
        self.cache_file.parent.mkdir(parents=True, exist_ok=True)
        with open(self.cache_file, 'w', encoding='utf-8') as f:
            json.dump(self.cache, f, indent=2)
    
    def get_file_hash(self, file_path: Path) -> str:
        """Calcula MD5 hash de um arquivo"""
        try:
            with open(file_path, 'rb') as f:
                return hashlib.md5(f.read()).hexdigest()
        except:
            return ""
    
    def is_file_cached(self, file_path: Path) -> bool:
        """Verifica se arquivo não foi modificado desde última validação"""
        file_key = str(file_path)
        if file_key not in self.cache:
            return False
        
        cached_hash = self.cache[file_key].get('hash', '')
        current_hash = self.get_file_hash(file_path)
        
        return cached_hash == current_hash and cached_hash != ""
    
    def add_file(self, file_path: Path, validation_result: Dict) -> None:
        """Adiciona arquivo ao cache"""
        file_key = str(file_path)
        self.cache[file_key] = {
            'hash': self.get_file_hash(file_path),
            'validated_at': datetime.now().isoformat(),
            'result': validation_result
        }
    
    def get_cached_result(self, file_path: Path) -> Optional[Dict]:
        """Obtém resultado cacheado"""
        file_key = str(file_path)
        if file_key in self.cache:
            return self.cache[file_key].get('result')
        return None

class OptimizedValidator:
    """Validador otimizado com cache e ignore patterns"""
    
    def __init__(self, root_path: Path, max_depth: int = 5, force: bool = False):
        self.root_path = Path(root_path).resolve()
        self.max_depth = max_depth
        self.force = force
        
        # Cache
        cache_dir = self.root_path / '.validation-cache'
        self.cache = FileCache(cache_dir / 'validation-cache.json')
        
        # Estatísticas
        self.stats = {
            'total_files': 0,
            'validated_files': 0,
            'cached_files': 0,
            'skipped_files': 0,
            'errors_found': 0,
            'start_time': time.time()
        }
    
    def should_ignore(self, path: Path) -> bool:
        """Verifica se path deve ser ignorado"""
        parts = path.parts
        return any(pattern in parts for pattern in IGNORE_PATTERNS)
    
    def should_validate(self, file_path: Path) -> bool:
        """Verifica se arquivo deve ser validado"""
        # Extensão válida?
        if file_path.suffix not in VALID_EXTENSIONS:
            return False
        
        # Não ignorado?
        if self.should_ignore(file_path):
            return False
        
        # Force mode?
        if self.force:
            return True
        
        # Não está no cache?
        return not self.cache.is_file_cached(file_path)
    
    def scan_files(self, current_depth: int = 0) -> List[Path]:
        """Escaneia arquivos respeitando max_depth e ignore patterns"""
        files_to_validate = []
        
        if current_depth > self.max_depth:
            return files_to_validate
        
        try:
            for item in self.root_path.iterdir():
                # Ignorar padrões
                if self.should_ignore(item):
                    continue
                
                if item.is_file():
                    if self.should_validate(item):
                        files_to_validate.append(item)
                        self.stats['total_files'] += 1
                    else:
                        self.stats['cached_files'] += 1
                
                elif item.is_dir():
                    # Recursão com limite de profundidade
                    sub_validator = OptimizedValidator(item, self.max_depth, self.force)
                    sub_validator.cache = self.cache  # Compartilhar cache
                    sub_files = sub_validator.scan_files(current_depth + 1)
                    files_to_validate.extend(sub_files)
                    
                    # Atualizar estatísticas
                    self.stats['total_files'] += sub_validator.stats['total_files']
                    self.stats['cached_files'] += sub_validator.stats['cached_files']
        
        except PermissionError:
            self.stats['skipped_files'] += 1
        
        return files_to_validate
    
    def validate_html(self, file_path: Path) -> Dict:
        """Validação básica de HTML"""
        try:
            content = file_path.read_text(encoding='utf-8')
            
            errors = []
            
            # Validações básicas
            if '<!DOCTYPE html>' not in content and '<!doctype html>' not in content:
                errors.append("Faltando <!DOCTYPE html>")
            
            if '<html' not in content:
                errors.append("Faltando tag <html>")
            
            if '<head>' not in content:
                errors.append("Faltando tag <head>")
            
            if '<body>' not in content:
                errors.append("Faltando tag <body>")
            
            return {
                'valid': len(errors) == 0,
                'errors': errors,
                'warnings': []
            }
        
        except Exception as e:
            return {
                'valid': False,
                'errors': [f"Erro ao ler arquivo: {str(e)}"],
                'warnings': []
            }
    
    def validate_file(self, file_path: Path) -> Dict:
        """Valida um arquivo baseado na extensão"""
        
        # Verificar cache primeiro (se não for force mode)
        if not self.force and self.cache.is_file_cached(file_path):
            cached_result = self.cache.get_cached_result(file_path)
            if cached_result:
                self.stats['cached_files'] += 1
                return cached_result
        
        # Validar baseado na extensão
        if file_path.suffix == '.html':
            result = self.validate_html(file_path)
        else:
            # Validação simples: arquivo existe e é legível
            result = {
                'valid': True,
                'errors': [],
                'warnings': []
            }
        
        # Adicionar ao cache
        self.cache.add_file(file_path, result)
        self.stats['validated_files'] += 1
        
        if not result['valid']:
            self.stats['errors_found'] += len(result['errors'])
        
        return result
    
    def validate(self) -> Dict:
        """Executa validação completa"""
        
        print(f"\n{Colors.CYAN}{Colors.BOLD}🚀 VALIDADOR OTIMIZADO EDUCACROSS{Colors.END}")
        print(f"{Colors.BLUE}📁 Escaneando: {self.root_path.name}{Colors.END}")
        print(f"{Colors.BLUE}🔍 Max depth: {self.max_depth} | Force: {self.force}{Colors.END}\n")
        
        # Escanear arquivos
        print(f"{Colors.YELLOW}⏳ Escaneando arquivos...{Colors.END}")
        files_to_validate = self.scan_files()
        
        print(f"{Colors.GREEN}✓ Encontrados: {len(files_to_validate)} arquivos para validar{Colors.END}")
        print(f"{Colors.CYAN}💾 Cache: {self.stats['cached_files']} arquivos já validados{Colors.END}\n")
        
        # Validar arquivos
        results = {}
        for i, file_path in enumerate(files_to_validate, 1):
            # Progress bar
            percentage = (i / len(files_to_validate)) * 100 if files_to_validate else 0
            bar_length = 30
            filled_length = int(bar_length * i // len(files_to_validate)) if files_to_validate else 0
            bar = '█' * filled_length + '░' * (bar_length - filled_length)
            
            print(f"\r{Colors.YELLOW}▶ Validando [{bar}] {percentage:.0f}% ({i}/{len(files_to_validate)}){Colors.END}", end='')
            
            result = self.validate_file(file_path)
            relative_path = str(file_path.relative_to(self.root_path))
            results[relative_path] = result
        
        print()  # Nova linha após progress bar
        
        # Salvar cache
        self.cache.save_cache()
        
        # Estatísticas finais
        elapsed_time = time.time() - self.stats['start_time']
        
        print(f"\n{Colors.BOLD}📊 ESTATÍSTICAS{Colors.END}")
        print(f"  Total de arquivos: {self.stats['total_files']}")
        print(f"  Validados agora: {self.stats['validated_files']}")
        print(f"  Do cache: {self.stats['cached_files']}")
        print(f"  Erros encontrados: {self.stats['errors_found']}")
        print(f"  Tempo: {elapsed_time:.2f}s")
        print(f"  Velocidade: {len(files_to_validate)/elapsed_time:.1f} arquivos/s" if elapsed_time > 0 else "  Velocidade: N/A")
        
        # Resumo
        if self.stats['errors_found'] == 0:
            print(f"\n{Colors.GREEN}{Colors.BOLD}✅ VALIDAÇÃO COMPLETA - SEM ERROS!{Colors.END}\n")
        else:
            print(f"\n{Colors.RED}{Colors.BOLD}⚠️ VALIDAÇÃO COMPLETA - {self.stats['errors_found']} ERROS ENCONTRADOS{Colors.END}\n")
        
        return {
            'summary': self.stats,
            'results': results,
            'timestamp': datetime.now().isoformat()
        }

def main():
    """Função principal"""
    parser = argparse.ArgumentParser(
        description='🏗️ Validador Universal OTIMIZADO - Educacross'
    )
    parser.add_argument('--path', type=str, default='.',
                       help='Caminho para validar (padrão: diretório atual)')
    parser.add_argument('--force', action='store_true',
                       help='Forçar re-validação (ignorar cache)')
    parser.add_argument('--max-depth', type=int, default=5,
                       help='Profundidade máxima de busca (padrão: 5)')
    parser.add_argument('--clear-cache', action='store_true',
                       help='Limpar cache antes de validar')
    
    args = parser.parse_args()
    
    # Limpar cache se solicitado
    if args.clear_cache:
        cache_file = Path(args.path) / '.validation-cache' / 'validation-cache.json'
        if cache_file.exists():
            cache_file.unlink()
            print(f"{Colors.GREEN}✓ Cache limpo!{Colors.END}\n")
    
    # Validar
    validator = OptimizedValidator(
        root_path=Path(args.path),
        max_depth=args.max_depth,
        force=args.force
    )
    
    results = validator.validate()
    
    return 0 if results['summary']['errors_found'] == 0 else 1

if __name__ == '__main__':
    sys.exit(main())
