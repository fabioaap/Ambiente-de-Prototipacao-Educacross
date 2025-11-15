# 🤖 Agentes Customizados - Plataforma de Prototipagem

## 📋 Visão Geral

Este documento descreve os agentes customizados disponíveis no projeto. Agentes customizados são assistentes especializados em tarefas específicas que podem acelerar o desenvolvimento e garantir qualidade consistente.

### O que são Agentes Customizados?

Agentes customizados são ferramentas de IA especializadas configuradas para executar tarefas específicas no projeto. Eles possuem:
- **Conhecimento especializado** em uma área técnica específica
- **Prompts otimizados** para entregar resultados consistentes
- **Padrões pré-definidos** alinhados com a arquitetura do projeto

---

## 🎯 Agentes Disponíveis

### 1. Dev Frontend Vanilla

**Localização:** `.github/agents/dev frontend Vanilla.agent.md`

**Especialidade:**
- Desenvolvimento frontend com HTML, CSS e JavaScript puro (sem frameworks)
- Arquitetura limpa no frontend
- Organização modular de código
- Acessibilidade e performance
- Responsividade mobile-first

**Quando usar:**
- ✅ Criar protótipos para **Front-office** (Professor)
- ✅ Criar protótipos para **Back-office** (Admin)
- ✅ Implementar páginas HTML estáticas
- ✅ Integrar com designs do Figma via MCP
- ❌ **Não usar** para desenvolvimento de **Games** (React/TypeScript)

#### Capacidades Principais

**1. Integração com Figma MCP**
- Extração automática de tokens (cores, tipografia, espaçamentos)
- Implementação pixel-perfect baseada em designs
- Validação pós-implementação contra specs do Figma

**2. Estrutura de Código**
- HTML semântico e acessível
- CSS com variáveis (tokens) organizadas
- JavaScript modular sem dependências externas
- Separação clara entre estrutura, estilo e comportamento

**3. Padrão de Entrega**
Toda implementação segue este formato:
1. **Resumo rápido** da tarefa (2 frases)
2. **Decisões de UX/UI** (hierarquia, estados, navegação)
3. **Arquitetura de componentes** (blocos principais)
4. **Código completo** (HTML + CSS + JS)
5. **Testes e verificações** (responsividade, acessibilidade)
6. **Guia de uso e extensão** (como reutilizar)

#### Pipeline Figma MCP

Quando trabalhar com designs do Figma, o agente segue este pipeline:

```
1. Ler referência no Figma
   ├─ Frame raiz e componentes
   ├─ Grid e constraints
   └─ Tokens de design

2. Extrair tokens → CSS variables
   ├─ :root { --primary: #7367ef }
   ├─ --font-size-base, --spacing-md
   └─ --border-radius, --shadow-sm

3. Codificar pixel-perfect
   ├─ HTML semântico
   ├─ CSS com tokens
   └─ JavaScript puro

4. Validar contra Figma
   ├─ Hierarquia visual
   ├─ Grid e alinhamentos
   └─ Estados de interação

5. Ajustar e documentar
   ├─ Corrigir divergências
   └─ Relatar aderência
```

#### Exemplos de Uso

**Exemplo 1: Criar tela de login (Front-office)**
```
Prompt:
"Implementar tela de login para Front-office (professores) 
baseada no Figma frame 'Login-Professor'. Usar MCP do Figma 
para extrair tokens e implementar pixel-perfect."

O agente irá:
1. Acessar Figma via MCP
2. Extrair tokens (cores, fontes, espaçamentos)
3. Criar HTML semântico com form
4. Aplicar CSS com variáveis
5. Adicionar validação JS
6. Validar contra Figma
7. Documentar desvios (se houver)
```

**Exemplo 2: Adicionar modal ao Back-office**
```
Prompt:
"Adicionar modal de confirmação de exclusão no banco de questões 
(Back-office). Seguir padrão Vuexy com --danger: #ea5455. 
Incluir animação fade-in."

O agente irá:
1. Criar estrutura HTML do modal
2. Aplicar estilos Vuexy (cores, sombras)
3. Implementar overlay e close button
4. Adicionar animação CSS
5. Implementar controle de foco (acessibilidade)
6. Testar keyboard navigation
```

---

## 📖 Como Usar Agentes Customizados

### Passo a Passo

**1. Identificar a tarefa**
- Revisar qual agente é especializado na tarefa
- Verificar na tabela "Quando usar"

**2. Preparar contexto**
- Reunir referências (links Figma, screenshots)
- Listar requisitos específicos
- Definir escopo claro

**3. Invocar o agente**
- Referenciá-lo explicitamente na tarefa
- Fornecer contexto completo
- Ser específico sobre expectativas

**4. Validar resultado**
- Conferir implementação
- Testar comportamento
- Validar acessibilidade

### Boas Práticas

✅ **Fazer:**
- Fornecer contexto completo ao agente
- Especificar arquivos/componentes afetados
- Mencionar requisitos de acessibilidade
- Indicar se há integração com Figma MCP

❌ **Evitar:**
- Pedir múltiplas tarefas não relacionadas
- Omitir referências de design
- Misturar stacks (Vanilla JS vs React)
- Ignorar padrões do projeto

---

## 🔧 Integração com Workflow

### Para Desenvolvedores

**Front-office / Back-office (Vanilla JS):**

```powershell
# 1. Consultar agente para nova feature
# "Usar agente Dev Frontend Vanilla para implementar 
#  modal de aprovação em Back-office/banco-de-questoes.html"

# 2. Validar implementação
python -m http.server 8080
# Abrir http://localhost:8080/Back-office/

# 3. Validar estrutura
python universal_validator.py --path=Back-office --type=html

# 4. Commit
git add Back-office/
git commit -m "feat(back-office): adicionar modal de aprovação"
```

**Games (React):**
- ⚠️ **Não usar** agente Vanilla para Games
- Games usa stack React/TypeScript (próprio workflow)

### Para Designers

**Quando criar especificações:**

1. Preparar frame no Figma
2. Documentar tokens (cores, fonts, spacing)
3. Mencionar no pedido:
   ```
   "Solicitar ao Dev Frontend Vanilla implementar 
    baseado no frame Figma: [link]"
   ```
4. Validar resultado comparando com Figma

---

## 🎨 Tokens e Design System

### Tokens Suportados

O agente Dev Frontend Vanilla trabalha com estes tokens:

**Cores:**
```css
:root {
  /* Vuexy theme */
  --primary: #7367ef;
  --success: #28c76f;
  --warning: #ff9f43;
  --danger: #ea5455;
  --info: #00cfe8;
  
  /* Neutrals */
  --text-primary: #5e5873;
  --text-secondary: #b9b9c3;
  --bg-white: #ffffff;
  --bg-light: #f8f8f8;
}
```

**Tipografia:**
```css
:root {
  --font-family-base: 'Montserrat', sans-serif;
  --font-size-sm: 0.857rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.143rem;
  --font-size-xl: 1.286rem;
}
```

**Espaçamentos:**
```css
:root {
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
}
```

### Referência Rápida

**Documentos relacionados:**
- [DAILY_OPERATIONS.md](./DAILY_OPERATIONS.md) — Workflow diário (Vanilla JS)
- [ADR-0007](./adr/ADR-0007-vanilla-js-for-frontoffice-backoffice.md) — Por que Vanilla JS
- [packages/snippets/vuexy-vanilla-examples.html](../packages/snippets/) — Exemplos de código

---

## 📊 Comparação: Quando Usar Qual Stack

| Característica | Dev Frontend Vanilla | React (Games) |
|----------------|---------------------|---------------|
| **Stack** | HTML/CSS/JS puro | React + TypeScript |
| **Produtos** | Front-office, Back-office | Games (Aluno) |
| **Dev Server** | `python -m http.server` | `npm run dev` |
| **Deploy** | Arquivos estáticos | Build Vite |
| **Complexidade** | Baixa-Média | Média-Alta |
| **State Mgmt** | Vanilla JS | React Hooks |
| **Design System** | CSS vars Vuexy | shadcn/ui + Tailwind |
| **Handoff** | → Vue.js | → React (mantém) |

---

## 🚨 Troubleshooting

### "Agente não seguiu tokens do projeto"

**Solução:**
- Verificar se tokens estão definidos em `:root`
- Referenciar `packages/snippets/vuexy-vanilla-examples.html`
- Pedir explicitamente: "Usar tokens Vuexy do projeto"

### "Código gerado não é acessível"

**Solução:**
- Pedir explicitamente: "Garantir acessibilidade WCAG AA"
- Mencionar requisitos específicos (keyboard nav, ARIA)
- Validar com ferramentas (axe, WAVE)

### "Implementação não pixel-perfect"

**Solução:**
- Confirmar que MCP do Figma foi usado
- Fornecer medidas exatas do Figma
- Solicitar validação pós-implementação

---

## 📚 Recursos Adicionais

**Documentação oficial:**
- [MDN Web Docs](https://developer.mozilla.org/) — Referência HTML/CSS/JS
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) — Acessibilidade
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

**Exemplos internos:**
- `Front-office/` — Protótipos existentes
- `Back-office/` — Exemplos de implementação
- `packages/snippets/` — Snippets reutilizáveis

---

## 🔄 Atualizações

| Data | Mudança | Autor |
|------|---------|-------|
| 2025-11-15 | Documentação inicial do agente Vanilla | Copilot |

---

**Última atualização:** 15/11/2025  
**Versão:** 1.0.0  
**Status:** ✅ Completo
