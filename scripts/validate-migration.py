#!/usr/bin/env python3
"""
Script de Validação de Migração - Back-office Reorganização

Compara estado ANTES (arquivos raiz) com estado DEPOIS (estrutura modular pages/)
para quantificar redução de linhas e duplicação.
"""

import os
from pathlib import Path
from typing import Dict, List, Tuple


class MigrationValidator:
    def __init__(self, repo_root: str):
        self.repo_root = Path(repo_root)
        self.backoffice_root = self.repo_root / "Back-office" / "Gerador de Questões por IA – BackOffice"
        
    def count_lines(self, file_path: Path) -> int:
        """Conta linhas de um arquivo, retorna 0 se não existir."""
        if not file_path.exists():
            return 0
        try:
            return len(file_path.read_text(encoding='utf-8').split('\n'))
        except Exception as e:
            print(f"⚠️ Erro ao ler {file_path}: {e}")
            return 0
    
    def analyze_before(self) -> Dict[str, int]:
        """
        Analisa estado ANTES da reorganização (arquivos na raiz).
        """
        files_before = {
            "habilidades_topicos_v2_html": self.backoffice_root / "habilidades-topicos-v2.html",
            "habilidades_topicos_v2_js": self.backoffice_root / "habilidades-topicos-v2.js",
            "habilidades_topicos_v2_css": self.backoffice_root / "habilidades-topicos-v2.css",
            
            "criar_questao_quiz_html": self.backoffice_root / "criar-questao-quiz.html",
            "criar_questao_quiz_js": self.backoffice_root / "criar-questao-quiz.js",
            "criar_questao_quiz_css": self.backoffice_root / "criar-questao-quiz-new.css",
            
            "banco_questoes_revisao_html": self.backoffice_root / "banco-questoes-revisao.html",
            "banco_questoes_revisao_js": self.backoffice_root / "banco-questoes-revisao-FUNCIONANDO.js",
            "banco_questoes_revisao_css": self.backoffice_root / "banco-questoes-revisao.css",
        }
        
        return {key: self.count_lines(path) for key, path in files_before.items()}
    
    def analyze_after(self) -> Dict[str, int]:
        """
        Analisa estado DEPOIS da reorganização (estrutura modular pages/).
        """
        files_after = {
            "habilidades_topicos_html": self.backoffice_root / "pages" / "01-habilidades-topicos" / "index.html",
            "habilidades_topicos_js": self.backoffice_root / "pages" / "01-habilidades-topicos" / "script.js",
            "habilidades_topicos_css": self.backoffice_root / "pages" / "01-habilidades-topicos" / "styles.css",
            
            "criar_questao_quiz_html": self.backoffice_root / "pages" / "02-criar-questao-quiz" / "index.html",
            "criar_questao_quiz_js": self.backoffice_root / "pages" / "02-criar-questao-quiz" / "script.js",
            "criar_questao_quiz_css": self.backoffice_root / "pages" / "02-criar-questao-quiz" / "styles.css",
            
            "banco_questoes_revisao_html": self.backoffice_root / "pages" / "03-banco-questoes-revisao" / "index.html",
            "banco_questoes_revisao_js": self.backoffice_root / "pages" / "03-banco-questoes-revisao" / "script.js",
            "banco_questoes_revisao_css": self.backoffice_root / "pages" / "03-banco-questoes-revisao" / "styles.css",
        }
        
        return {key: self.count_lines(path) for key, path in files_after.items()}
    
    def compare(self) -> Dict:
        """
        Compara estados ANTES e DEPOIS e calcula reduções.
        """
        before = self.analyze_before()
        after = self.analyze_after()
        
        # Agrupar por página
        pages = {
            "01_habilidades_topicos": {
                "before": before["habilidades_topicos_v2_html"] + before["habilidades_topicos_v2_js"] + before["habilidades_topicos_v2_css"],
                "after": after["habilidades_topicos_html"] + after["habilidades_topicos_js"] + after["habilidades_topicos_css"],
            },
            "02_criar_questao_quiz": {
                "before": before["criar_questao_quiz_html"] + before["criar_questao_quiz_js"] + before["criar_questao_quiz_css"],
                "after": after["criar_questao_quiz_html"] + after["criar_questao_quiz_js"] + after["criar_questao_quiz_css"],
            },
            "03_banco_questoes_revisao": {
                "before": before["banco_questoes_revisao_html"] + before["banco_questoes_revisao_js"] + before["banco_questoes_revisao_css"],
                "after": after["banco_questoes_revisao_html"] + after["banco_questoes_revisao_js"] + after["banco_questoes_revisao_css"],
            },
        }
        
        # Calcular reduções por página
        for page, data in pages.items():
            before_lines = data["before"]
            after_lines = data["after"]
            
            if before_lines > 0:
                reduction = before_lines - after_lines
                pct = round((reduction / before_lines) * 100, 1)
                data["reduction"] = reduction
                data["percent"] = pct
            else:
                data["reduction"] = 0
                data["percent"] = 0
        
        total_before = sum(p["before"] for p in pages.values())
        total_after = sum(p["after"] for p in pages.values())
        
        return {
            "pages": pages,
            "total_before": total_before,
            "total_after": total_after,
            "total_reduction": total_before - total_after,
            "total_percent": round(((total_before - total_after) / total_before * 100), 1) if total_before > 0 else 0,
        }
    
    def report(self) -> None:
        """
        Gera relatório de validação da migração.
        """
        data = self.compare()
        
        print("\n" + "=" * 60)
        print("📊 RELATÓRIO DE VALIDAÇÃO DA MIGRAÇÃO - BACK-OFFICE")
        print("=" * 60)
        
        print("\n🔍 ANÁLISE POR PÁGINA:\n")
        
        page_names = {
            "01_habilidades_topicos": "01 - Habilidades e Tópicos",
            "02_criar_questao_quiz": "02 - Criar Questão Quiz",
            "03_banco_questoes_revisao": "03 - Banco Questões Revisão",
        }
        
        for page_key, page_data in data["pages"].items():
            page_name = page_names.get(page_key, page_key)
            before = page_data["before"]
            after = page_data["after"]
            reduction = page_data.get("reduction", 0)
            percent = page_data.get("percent", 0)
            
            status = "✅" if after > 0 else "❌"
            
            print(f"{status} {page_name}:")
            print(f"   ANTES: {before:,} linhas")
            print(f"   DEPOIS: {after:,} linhas")
            print(f"   REDUÇÃO: {reduction:,} linhas ({percent}%)")
            print()
        
        print("-" * 60)
        print(f"\n📈 TOTAIS:\n")
        print(f"   ANTES: {data['total_before']:,} linhas")
        print(f"   DEPOIS: {data['total_after']:,} linhas")
        print(f"   REDUÇÃO: {data['total_reduction']:,} linhas ({data['total_percent']}%)")
        
        # Avaliar se atingiu meta
        if data['total_percent'] >= 50:
            print(f"\n✅ META ATINGIDA: Redução de {data['total_percent']}% (meta: ≥50%)")
        elif data['total_after'] == 0:
            print(f"\n⚠️ MIGRAÇÃO PENDENTE: Arquivos ainda não foram reorganizados")
        else:
            print(f"\n❌ META NÃO ATINGIDA: Redução de {data['total_percent']}% (meta: ≥50%)")
        
        print("\n" + "=" * 60 + "\n")


def main():
    import sys
    
    repo_root = sys.argv[1] if len(sys.argv) > 1 else '.'
    
    validator = MigrationValidator(repo_root)
    validator.report()


if __name__ == '__main__':
    main()
