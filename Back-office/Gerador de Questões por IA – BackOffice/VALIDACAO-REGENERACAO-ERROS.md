# ✅ Checklist de Validação: Regeneração de Erros

## 🎯 Objetivo
Validar que o sistema de marcação visual de campos com erro funciona corretamente quando o usuário tenta regenerar questões que falharam.

---

## 📋 Fluxo Completo de Teste

### **ETAPA 1: Gerar Erro no Banco de Questões**

1. Abra `banco-questoes-revisao.html` no navegador
2. Clique no ícone de "Histórico de gerações" (drawer lateral)
3. Verifique que aparecem 3 linhas simuladas:
   - **Andamento**: 300/1000 (em progresso)
   - **Concluído**: 1000/1000 (sem erros)
   - **Erro**: 1000/1000 (com falhas)

**✅ Checkpoint 1.1:** Drawer abre e mostra 3 linhas dinâmicas

---

### **ETAPA 2: Abrir Modal de Erro**

1. Na linha com status "Erro", clique no ícone de olho 👁️
2. Modal deve abrir com:
   - Título: "Erro na geração de questões"
   - Subtítulo: "X questões falharam na geração (de 1000). Dificuldades afetadas:"
   - Tabela com 2 colunas: **Dificuldade** | **Quantidade**
   - Apenas dificuldades com erro devem aparecer (2-4 linhas)
   - Badges vermelhos mostrando quantidade de erros

**✅ Checkpoint 2.1:** Modal exibe apenas dificuldades com erro  
**✅ Checkpoint 2.2:** Badges vermelhos com números corretos  
**✅ Checkpoint 2.3:** Console mostra: `[Modal] Contexto de erro salvo: {...}`

---

### **ETAPA 3: Clicar em "Tentar Novamente"**

1. No modal, clique no botão **"Tentar Novamente"**
2. Deve redirecionar para `criar-questao-quiz.html?regenerar=1`

**✅ Checkpoint 3.1:** URL contém `?regenerar=1`  
**✅ Checkpoint 3.2:** Console mostra: `[Regeneração] Contexto carregado: {...}`

---

### **ETAPA 4: Validar Visual de Erro**

Na página `criar-questao-quiz.html`, verifique:

#### **4.1 Banner de Contexto**
- Banner amarelo no topo com:
  - ⚠️ Ícone de alerta
  - **"Modo de Regeneração Ativado"**
  - Texto: "Você está tentando gerar novamente X questões que falharam. Os campos com erro estão destacados abaixo."
  - Botão ❌ para fechar banner

**✅ Checkpoint 4.1:** Banner amarelo aparece no topo

#### **4.2 Campos com Erro Destacados**
Para cada dificuldade que falhou:
- Input tem borda vermelha grossa (2px)
- Input tem fundo levemente vermelho (#fff5f5)
- Input tem sombra vermelha ao redor
- Label tem badge vermelho: "X erro(s)"
- Input tem ícone de alerta ⚠️ no lado direito
- Input está pré-preenchido com quantidade de erro

**✅ Checkpoint 4.2:** Inputs com erro têm visual vermelho  
**✅ Checkpoint 4.3:** Badges vermelhos nos labels corretos  
**✅ Checkpoint 4.4:** Ícones ⚠️ visíveis nos inputs  
**✅ Checkpoint 4.5:** Valores pré-preenchidos corretamente  

#### **4.3 Scroll Automático**
- Página faz scroll suave para o primeiro campo com erro
- Campo fica centralizado na tela

**✅ Checkpoint 4.3:** Scroll automático funciona

---

### **ETAPA 5: Validar Botão "Gerar"**

1. Como os campos estão pré-preenchidos, o botão **"Gerar"** deve estar habilitado
2. Cor primária (#7367f0) deve estar aplicada

**✅ Checkpoint 5.1:** Botão "Gerar" está habilitado  
**✅ Checkpoint 5.2:** Botão tem cor primária (não cinza)

---

### **ETAPA 6: Submissão e Limpeza**

1. Clique no botão **"Gerar"**
2. Toast de "Lote em Geração" deve aparecer
3. Redireciona para `banco-questoes-revisao.html`
4. Abra Console do navegador e execute:
   ```javascript
   localStorage.getItem('errosRegeneracao')
   ```
5. Deve retornar `null` (contexto foi limpo)

**✅ Checkpoint 6.1:** Toast aparece  
**✅ Checkpoint 6.2:** Redirecionamento funciona  
**✅ Checkpoint 6.3:** localStorage foi limpo

---

## 🧪 Testes de Borda

### **Teste A: Modal sem Erros**
1. No drawer, clique na linha **"Concluído"** (1000/1000 sem erros)
2. Modal deve abrir mas mostrar: "Todas as dificuldades foram geradas com sucesso."
3. Botão "Tentar Novamente" não deve redirecionar para modo regeneração

**✅ Checkpoint A:** Modal funciona para status sem erros

---

### **Teste B: Múltiplos Campos com Erro**
1. Force simulação com 4-5 dificuldades com erro
2. Verifique que todos os campos afetados têm visual vermelho
3. Verifique que badges e ícones aparecem em todos

**✅ Checkpoint B:** Múltiplos campos marcados corretamente

---

### **Teste C: Fechar Banner**
1. Clique no ❌ do banner amarelo
2. Banner desaparece
3. Campos com erro continuam marcados

**✅ Checkpoint C:** Banner pode ser fechado sem afetar campos

---

### **Teste D: Alterar Valores**
1. Mude os valores dos inputs com erro
2. Validação deve recalcular total
3. Botão "Gerar" deve continuar habilitado se total > 0

**✅ Checkpoint D:** Validação dinâmica funciona

---

### **Teste E: Responsividade**
1. Reduza largura da janela para mobile (< 768px)
2. Banner deve permanecer legível
3. Campos devem empilhar verticalmente
4. Visual de erro deve ser preservado

**✅ Checkpoint E:** Layout responsivo funciona

---

## 🐛 Debugging

### Console Logs Esperados

#### No Modal (banco-questoes-revisao.html):
```
[Modal] Simulação criada baseada na linha (total: 1000 erros: 42): {...}
[Modal] errorPerDifficulty: [0, 8, 15, 12, 7]
[Modal] errorTotal: 42
[Modal] tbody encontrado: true
[Modal] dificuldadesComErro: ['Muito difícil', 'Difícil', 'Médio', 'Fácil']
[Modal] Criando linha: Muito difícil 12
[Modal] Criando linha: Difícil 15
[Modal] Criando linha: Médio 8
[Modal] Criando linha: Fácil 7
[Modal] Total de linhas criadas: 4
[Modal] Contexto de erro salvo: {dificuldades: [...], totalErros: 42, ...}
[Modal] CTA atualizado com parâmetro regenerar=1
```

#### Na Página de Criação (criar-questao-quiz.html):
```
[Regeneração] Contexto carregado: {dificuldades: [...], totalErros: 42, ...}
[Regeneração] Aplicando contexto visual de erro
[Regeneração] Campo dificil marcado com erro: 12
[Regeneração] Campo medio marcado com erro: 15
[Regeneração] Campo facil marcado com erro: 8
[Regeneração] Campo muitoDificil marcado com erro: 7
```

#### Na Submissão:
```
[Regeneração] Contexto de erro limpo após submissão
```

---

## 🎨 Visual de Referência

### Banner de Regeneração
```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️  Modo de Regeneração Ativado                         ❌ │
│    Você está tentando gerar novamente 42 questões que      │
│    falharam. Os campos com erro estão destacados abaixo.   │
└─────────────────────────────────────────────────────────────┘
```

### Input com Erro
```
┌──────────────────────────────────────┐
│ Difícil  [12 erros]                  │
├──────────────────────────────────────┤
│ ⚠️ │ [  12  ] ← borda vermelha      │
│    │        fundo vermelho claro     │
└────┴─────────────────────────────────┘
```

---

## ✅ Resumo de Validação

| Etapa | Item | Status |
|-------|------|--------|
| 1 | Drawer com 3 linhas | ⬜ |
| 2 | Modal com erro abre | ⬜ |
| 3 | Redirecionamento com ?regenerar=1 | ⬜ |
| 4.1 | Banner amarelo aparece | ⬜ |
| 4.2 | Campos vermelhos destacados | ⬜ |
| 4.3 | Scroll automático | ⬜ |
| 5 | Botão "Gerar" habilitado | ⬜ |
| 6 | localStorage limpo após submit | ⬜ |

---

## 📝 Notas Técnicas

### Estrutura de Dados no localStorage

**Chave:** `errosRegeneracao`

**Formato:**
```json
{
  "dificuldades": [
    {
      "nome": "Difícil",
      "quantidade": 12,
      "indice": 3
    },
    {
      "nome": "Médio",
      "quantidade": 15,
      "indice": 2
    }
  ],
  "totalErros": 42,
  "totalSolicitado": 1000,
  "timestamp": "2025-11-19T14:30:00.000Z"
}
```

### Mapeamento de Índices

Ordem de armazenamento: `[muitoFácil, fácil, médio, difícil, muitoDifícil]`
- Índice 0 = Muito Fácil → Input ID: `muitoFacil`
- Índice 1 = Fácil → Input ID: `facil`
- Índice 2 = Médio → Input ID: `medio`
- Índice 3 = Difícil → Input ID: `dificil`
- Índice 4 = Muito Difícil → Input ID: `muitoDificil`

---

## 🚀 Próximos Passos (Futuro)

- [ ] Adicionar animação de entrada no banner
- [ ] Adicionar tooltip explicativo nos ícones ⚠️
- [ ] Persistir histórico de tentativas de regeneração
- [ ] Mostrar progresso de regeneração em tempo real
- [ ] Adicionar botão "Limpar Erros" para recomeçar do zero

---

**Data:** 19/11/2025  
**Versão:** 1.0  
**Implementado por:** GitHub Copilot + Fabio
