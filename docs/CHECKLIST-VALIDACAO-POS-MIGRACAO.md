# Checklist Validação Pós-Migração

## ✅ Root Dashboard (NÃO ALTERAR - SAGRADO)

- [ ] index.html carrega no GitHub Pages
- [ ] 404.html renderiza corretamente
- [ ] assets/logo-educacross.svg existe e está acessível
- [ ] Links para protótipos funcionam
- [ ] Health score mantido ou melhorado

## ✅ Environment Docs Consolidados (FASE 0 - CONCLUÍDA)

- [x] docs/ambiente-prototipacao/index.html acessível
- [x] Links em index.html apontam para docs/ambiente-prototipacao/
- [x] Deletadas cópias raiz (ambiente-*.{html,css,js})
- [ ] Teste manual: http://localhost:8080/docs/ambiente-prototipacao/ carrega sem 404s

## ✅ Back-office Reorganizado

### Estrutura de Diretórios (FASE 2)
- [ ] Back-office/Gerador.../pages/ criada
- [ ] Back-office/Gerador.../pages/01-habilidades-topicos/ criada
- [ ] Back-office/Gerador.../pages/02-criar-questao-quiz/ criada
- [ ] Back-office/Gerador.../pages/03-banco-questoes-revisao/ criada
- [ ] Back-office/Gerador.../docs/ criada

### Migração de Arquivos (FASE 3)
- [ ] pages/01-habilidades-topicos/index.html (copiado de habilidades-topicos-v2.html)
- [ ] pages/01-habilidades-topicos/script.js (copiado de habilidades-topicos-v2.js)
- [ ] pages/01-habilidades-topicos/styles.css (copiado de habilidades-topicos-v2.css)
- [ ] pages/02-criar-questao-quiz/index.html (copiado de criar-questao-quiz.html)
- [ ] pages/02-criar-questao-quiz/script.js (copiado de criar-questao-quiz.js)
- [ ] pages/02-criar-questao-quiz/styles.css (copiado de criar-questao-quiz-new.css)
- [ ] pages/03-banco-questoes-revisao/index.html (copiado de banco-questoes-revisao.html)
- [ ] pages/03-banco-questoes-revisao/script.js (copiado de banco-questoes-revisao-FUNCIONANDO.js)
- [ ] pages/03-banco-questoes-revisao/styles.css (copiado de banco-questoes-revisao.css)

### Ajuste de Paths (FASE 4 - CRÍTICA ⚠️)
- [ ] pages/01-habilidades-topicos/index.html: paths corrigidos para ../../assets/
- [ ] pages/02-criar-questao-quiz/index.html: paths corrigidos para ../../assets/
- [ ] pages/03-banco-questoes-revisao/index.html: paths corrigidos para ../../assets/

### Validação Funcional (FASE 5)

**Página 01 - Habilidades e Tópicos:**
- [ ] Carrega sem 404s no console
- [ ] Sidebar visível e estilizada
- [ ] Menu items renderizam
- [ ] Tópicos carregam corretamente
- [ ] CSS carrega (cor roxa #7367ef visível)
- [ ] Ícones SVG renderizam

**Página 02 - Criar Questão Quiz:**
- [ ] Carrega sem 404s no console
- [ ] Formulário visível e estilizado
- [ ] Botão "Gerar Questão" funciona
- [ ] Toast dispara e salva em localStorage ('toastPendente')
- [ ] CSS carrega corretamente
- [ ] Ícones renderizam

**Página 03 - Banco Questões Revisão:**
- [ ] Carrega sem 404s no console
- [ ] Stats-bar renderiza com badges corretos (Quiz: 15, IA: 5, Humano: 10)
- [ ] Toast **PERSISTE** da navegação anterior (exibe "toastPendente")
- [ ] Tabela com filtros renderiza
- [ ] Pesquisa funciona
- [ ] Filtros (Disciplina, Origem) funcionam
- [ ] CSS carrega (layout completo)
- [ ] Ícones renderizam

**Console (DevTools):**
- [ ] ZERO 404s em todas as 3 páginas
- [ ] ZERO erros de JavaScript
- [ ] ZERO warnings críticos

**Navegação Entre Páginas:**
- [ ] Link 01 → 02 funciona
- [ ] Link 02 → 03 funciona
- [ ] Link 03 → 01 funciona (se houver)
- [ ] Breadcrumb funciona (se implementado)

### Hub de Navegação (FASE 6)
- [ ] Back-office/Gerador.../index.html criado
- [ ] Hub tem links para as 3 páginas
- [ ] Cada link leva para página correta
- [ ] Back-office/Gerador.../README.md criado com instruções
- [ ] Back-office/Gerador.../docs/ARQUITETURA.md criado

## ✅ Front-office Reorganizado (FASE 7)

- [ ] Front-office/modal-aprovacao-banco/ criado (renomeado)
- [ ] demo-interativo.html → index.html
- [ ] Front-office/assets/styles/ criado
- [ ] Front-office/README.md criado
- [ ] Modal carrega sem 404s

## 📊 Métricas de Redução

### Back-office
- [ ] Linhas ANTES: ~5,000 (HTML+CSS+JS misturado)
- [ ] Linhas DEPOIS: ~1,500 ou menos (separado e organizado)
- [ ] **Meta:** 70% de redução alcançada

### Duplicação Removida
- [ ] CSS duplicado: ~1,300 linhas removidas
- [ ] Sidebar/header: inline substituído por componente
- [ ] SVG inline: substituído por referências

## 🔍 Testes Manuais Obrigatórios

### Servidor Local
```bash
python -m http.server 8080
```

### URLs para Testar
1. http://localhost:8080/
2. http://localhost:8080/docs/ambiente-prototipacao/
3. http://localhost:8080/Back-office/Gerador%20de%20Quest%C3%B5es%20por%20IA%20%E2%80%93%20BackOffice/
4. http://localhost:8080/Back-office/Gerador%20de%20Quest%C3%B5es%20por%20IA%20%E2%80%93%20BackOffice/pages/01-habilidades-topicos/
5. http://localhost:8080/Back-office/Gerador%20de%20Quest%C3%B5es%20por%20IA%20%E2%80%93%20BackOffice/pages/02-criar-questao-quiz/
6. http://localhost:8080/Back-office/Gerador%20de%20Quest%C3%B5es%20por%20IA%20%E2%80%93%20BackOffice/pages/03-banco-questoes-revisao/

### DevTools Checklist (CADA URL)
- [ ] Console: 0 erros
- [ ] Network: 0 failed requests (404, 500)
- [ ] Elements: CSS aplicado corretamente
- [ ] Application > LocalStorage: 'toastPendente' persiste

## 🚨 Rollback Triggers

Se qualquer item CRÍTICO falhar, fazer rollback imediato:
- ❌ Mais de 5 404s em qualquer página
- ❌ Toast não persiste entre páginas 02 → 03
- ❌ Stats-bar não renderiza
- ❌ Filtros quebrados
- ❌ CSS não carrega (página sem estilo)

## ✅ Aprovação Final

- [ ] Todos os itens críticos passaram
- [ ] Métricas de redução alcançadas (≥50%)
- [ ] Zero 404s em console
- [ ] Funcionalidades preservadas
- [ ] Documentação criada

**Responsável:** DevOps Agent  
**Data Validação:** _______  
**Status:** ⬜ Pendente | ⬜ Aprovado | ⬜ Rejeitado
