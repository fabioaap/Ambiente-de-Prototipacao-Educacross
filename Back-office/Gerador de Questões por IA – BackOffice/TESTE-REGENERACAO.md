# 🧪 Script de Teste para Regeneração

Para testar a página de regeneração **sem precisar passar pelo modal**, execute este código no **Console do navegador** (F12):

## 📋 Opção 1: Simular Dados de Erro

```javascript
// Simular contexto de erro com 3 dificuldades afetadas
const contextoTeste = {
    dificuldades: [
        {
            nome: "Difícil",
            quantidade: 12,
            indice: 3
        },
        {
            nome: "Médio",
            quantidade: 15,
            indice: 2
        },
        {
            nome: "Fácil",
            quantidade: 8,
            indice: 1
        }
    ],
    totalErros: 35,
    totalSolicitado: 1000,
    timestamp: new Date().toISOString()
};

localStorage.setItem('errosRegeneracao', JSON.stringify(contextoTeste));
console.log('✅ Contexto de teste salvo! Recarregue a página.');
```

Depois execute: `location.reload()`

---

## 📋 Opção 2: Script Completo (Salvar + Recarregar)

```javascript
// Criar contexto + recarregar automaticamente
const contextoTeste = {
    dificuldades: [
        { nome: "Muito difícil", quantidade: 7, indice: 4 },
        { nome: "Difícil", quantidade: 12, indice: 3 },
        { nome: "Médio", quantidade: 15, indice: 2 },
        { nome: "Fácil", quantidade: 8, indice: 1 }
    ],
    totalErros: 42,
    totalSolicitado: 1000,
    timestamp: new Date().toISOString()
};

localStorage.setItem('errosRegeneracao', JSON.stringify(contextoTeste));
location.reload();
```

---

## 📋 Opção 3: Limpar Contexto (Voltar ao Normal)

```javascript
localStorage.removeItem('errosRegeneracao');
location.reload();
```

---

## 🎯 O Que Você Deve Ver

Após executar o script de teste e recarregar:

✅ **Banner amarelo** no topo:
- Texto: "Modo de Regeneração Ativado"
- "Você está tentando gerar novamente 42 questões que falharam"

✅ **Campos com erro destacados:**
- Muito difícil: borda vermelha + badge "7 erros"
- Difícil: borda vermelha + badge "12 erros"
- Médio: borda vermelha + badge "15 erros"
- Fácil: borda vermelha + badge "8 erros"

✅ **Valores pré-preenchidos** nos inputs

✅ **Ícones ⚠️** ao lado dos inputs com erro

✅ **Botão "Gerar" habilitado** (valores > 0)

---

## 🔍 Verificar no Console

Você deve ver:
```
[Regeneração] Página de regeneração carregada
[Regeneração] Contexto carregado: {dificuldades: Array(4), totalErros: 42, ...}
[Regeneração] Aplicando contexto visual de erro
[Regeneração] Campo muitoDificil marcado com erro: 7
[Regeneração] Campo dificil marcado com erro: 12
[Regeneração] Campo medio marcado com erro: 15
[Regeneração] Campo facil marcado com erro: 8
```

---

## 📝 Fluxo Completo Real

1. Abra: `banco-questoes-revisao.html`
2. Clique no ícone de drawer (histórico)
3. Clique no olho da linha "Erro"
4. Modal abre com dificuldades
5. Clique "Tentar Novamente"
6. Redireciona para `criar-questao-quiz-regeneracao.html`
7. Visual de erro aparece automaticamente

---

**Arquivo:** `TESTE-REGENERACAO.md`  
**Data:** 19/11/2025
