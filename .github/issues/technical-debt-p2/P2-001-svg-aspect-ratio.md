# P2-001: SVG Logos com Aspect Ratio Distorcido

## 📋 Descrição
Logos em formato SVG estão sendo exibidos com aspect ratio distorcido devido a CSS com largura/altura fixas que não respeitam o viewBox nativo do SVG.

## 🎯 Objetivo
Ajustar CSS para respeitar viewBox do SVG, usando `height: auto` e permitindo que o SVG mantenha proporções originais.

## 💡 Contexto
SVGs possuem viewBox que define proporções nativas. Quando CSS força `width` e `height` fixos simultaneamente, a imagem distorce. A solução é fixar apenas uma dimensão (geralmente `width`) e deixar a outra como `auto`.

## 📊 Impacto
- **Severidade:** Medium
- **Bloqueio:** None (visual apenas)
- **Esforço Estimado:** 0.25h
- **Prioridade:** P2

## 🔧 Solução Proposta
Refatorar CSS de logos SVG para respeitar viewBox.

### Passos para Implementação
1. Identificar todos os logos SVG no projeto
2. Localizar CSS que define width + height fixos
3. Mudar para padrão:
   ```css
   .logo {
     width: 150px; /* ou valor desejado */
     height: auto; /* respeita aspect ratio */
   }
   ```
4. Validar que SVGs têm viewBox definido
5. Testar em diferentes resoluções
6. Documentar padrão em style guide

## ✅ Critérios de Aceitação
- [ ] Logos SVG mantêm aspect ratio original
- [ ] CSS usa `height: auto` para SVGs
- [ ] Todos SVGs têm `viewBox` definido
- [ ] Visual validation passa
- [ ] Padrão documentado em style guide

## 📎 Arquivos Afetados
- `Back-office/**/assets/*.svg`
- `Front-office/**/assets/*.svg`
- `*.css` (estilos que referenciam logos)

## 🏷️ Tags
`svg` `visual` `aspect-ratio` `css` `p2` `technical-debt`

## 📚 Referências
- **Technical Debt:** `docs/TECHNICAL_DEBT.md` (P2-001, linha 104)
- **SVG Best Practices:** [MDN - SVG viewBox](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox)

## 📝 Notas Adicionais
**Padrão CSS Recomendado:**
```css
/* ❌ ERRADO - distorce */
.logo {
  width: 150px;
  height: 50px;
}

/* ✅ CORRETO - respeita aspect ratio */
.logo {
  width: 150px;
  height: auto;
}

/* ✅ ALTERNATIVA - container com aspect ratio */
.logo-container {
  aspect-ratio: 3 / 1;
  width: 150px;
}
.logo-container svg {
  width: 100%;
  height: 100%;
}
```

---

**Criado por:** DevOps Agent  
**Data:** 17/11/2025  
**Categoria:** Technical Debt P2
