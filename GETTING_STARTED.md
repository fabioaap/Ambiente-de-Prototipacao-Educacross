# 🎯 Guia de Início Rápido para Novos Membros

Bem-vindo ao projeto! Este guia te levará do zero ao operacional em ~1 hora.

---

## ⏱️ Tempo Total Estimado: 60 minutos

- **Setup:** 15 min
- **Aprendizado:** 30 min
- **Hands-on:** 15 min

---

## 🚀 Passo 1: Setup (15 minutos)

### 1.1 Clonar repositório
```powershell
# Substitua <URL> pela URL real do repositório
git clone <URL> educacross-prototipo
cd educacross-prototipo
```

### 1.2 Instalar dependências
```powershell
npm install
```

Se der erro de versão, rode:
```powershell
npm install --legacy-peer-deps
```

### 1.3 Verificar instalação
```powershell
npm run check-env
```

Deve retornar ✅ tudo verde.

### 1.4 Abrir projeto no VS Code
```powershell
code .
```

---

## 📚 Passo 2: Aprendizado (30 minutos)

### 2.1 Ler documentação de contexto (10 min)

Leia nesta ordem:
1. **[README.md](../README.md)** — O que é o projeto
2. **[docs/STATUS_REPORT.md](./STATUS_REPORT.md)** — O que foi entregue
3. **[docs/INDEX.md](./INDEX.md)** — Índice de documentação

### 2.2 Explorar Storybook (10 min)

1. **Iniciar Storybook:**
```powershell
npm run storybook
```

2. **Abrir no navegador:**
```
http://localhost:6006
```

3. **Explorar componentes:**
   - Esquerda: Menu de componentes
   - Centro: Visualização
   - Direita: Controls e Docs

4. **Testar Controls:**
   - Clique em UI > Button
   - Mude o `variant` ou `size` nos controls
   - Veja a mudança em tempo real

### 2.3 Ler documentação do seu papel (10 min)

**Se você é Developer:**
→ Leia: [docs/DAILY_OPERATIONS.md#-desenvolvedor-frontend](./DAILY_OPERATIONS.md#-desenvolvedor-frontend)

**Se você é Designer:**
→ Leia: [docs/DAILY_OPERATIONS.md#-designer](./DAILY_OPERATIONS.md#-designer)

**Se você é PM:**
→ Leia: [docs/DAILY_OPERATIONS.md#--product-manager](./DAILY_OPERATIONS.md#--product-manager)

---

## 🔨 Passo 3: Hands-On (15 minutos)

### 3.1 Developer: Criar seu primeiro componente

1. **Abra um novo arquivo:**
```
src/components/TestComponent.tsx
```

2. **Cole este código:**
```typescript
import React from 'react'
import { Button } from './ui/button'

export interface TestComponentProps {
  label?: string
}

export function TestComponent({ label = 'Hello' }: TestComponentProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Meu Primeiro Componente</h2>
      <Button>{label}</Button>
    </div>
  )
}
```

3. **Crie a story:**
```
src/components/TestComponent.stories.tsx
```

4. **Cole este código:**
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { TestComponent } from './TestComponent'

const meta: Meta<typeof TestComponent> = {
  title: 'Test/TestComponent',
  component: TestComponent,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Clique em mim!' },
}
```

5. **Verifique no Storybook:**
   - Abra `http://localhost:6006`
   - Procure por `Test > TestComponent`
   - Veja seu componente renderizando!

### 3.2 Designer: Validar componente no Figma

1. **Abra componente no Storybook:**
   - `http://localhost:6006`
   - Clique em `UI > Button`

2. **Abra Figma em outra aba:**
   - Procure pelo design do Button
   - Compare cores, tamanhos, espaçamentos

3. **Use Controls para testar:**
   - Mude `variant` para `outline`
   - Veja se combina com Figma
   - Aprove ou sugira mudanças

### 3.3 PM: Criar sua primeira jornada

1. **Crie arquivo:**
```
docs/journeys/04-sua-jornada.md
```

2. **Use template:**
```markdown
# Jornada do [Seu Cargo] - [Sua Plataforma]

## 👤 Persona
- **Nome:** [Nome realista]
- **Cargo:** [Seu cargo]
- **Objetivo:** [O que quer atingir]
- **Dor:** [Problema que enfrenta]

## 🎯 Objetivo da Jornada
[Uma frase clara]

## 📋 Fluxo Principal

### 1️⃣ **Primeira Etapa**
- [ ] Ação 1
- [ ] Ação 2

## ✅ Status do Desenvolvimento
- **Planejamento:** ✅
- **Design:** ⏳
- **Prototipagem:** ⏳
```

3. **Salve e compartilhe:**
```powershell
git add docs/journeys/04-sua-jornada.md
git commit -m "docs(journeys): criar jornada do [seu cargo]"
git push
```

---

## ✅ Checklist de Conclusão

Marque conforme vai completando:

### Setup Básico
- [ ] Repositório clonado
- [ ] `npm install` executado com sucesso
- [ ] `npm run check-env` retornou ✅

### Aprendizado
- [ ] Li `README.md`
- [ ] Li `STATUS_REPORT.md`
- [ ] Li `INDEX.md`
- [ ] Abri e explorei Storybook
- [ ] Li documentação do meu papel

### Hands-On
- [ ] **Dev:** Criei TestComponent com story
- [ ] **Designer:** Validei componente no Figma
- [ ] **PM:** Criei jornada de teste

### Comunicação
- [ ] Apresentei para tech lead
- [ ] Adicionei foto de perfil Slack
- [ ] Configurei notificações do projeto

---

## 📞 Próximos Passos

### Dev
1. Leia: [docs/STORYBOOK_GUIDE.md](./STORYBOOK_GUIDE.md)
2. Leia: [docs/GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
3. Crie: Seu primeiro componente real (não teste)

### Designer
1. Leia: [docs/JOURNEYS_GUIDE.md](./JOURNEYS_GUIDE.md)
2. Sincronize: Figma com Storybook
3. Valide: Componentes existentes

### PM
1. Leia: [docs/JOURNEYS_GUIDE.md](./JOURNEYS_GUIDE.md)
2. Edite: Uma jornada existente
3. Especifique: Novos requisitos

---

## 🆘 Problemas Comuns

### "npm install não funciona"
```powershell
# Limpar cache
npm cache clean --force

# Tentar novamente
npm install --legacy-peer-deps
```

### "Storybook não abre"
```powershell
# Ctrl+C para parar
# Limpar cache
rm -r node_modules/.cache
rm -r .storybook/.cache

# Iniciar novamente
npm run storybook
```

### "Componentes não aparecem no Storybook"
1. Arquivo `.stories.tsx` está ao lado do componente?
2. Tem `export default meta` na story?
3. Storybook foi reiniciado?

---

## 📊 Estrutura do Projeto em 30 segundos

```
Raiz do projeto
├─ README.md               ← Leia primeiro
├─ package.json            ← Dependências
│
├─ docs/                   ← TODA documentação aqui
│  ├─ INDEX.md             ← Índice (você está aqui)
│  ├─ STORYBOOK_GUIDE.md   ← Dev: como criar stories
│  ├─ JOURNEYS_GUIDE.md    ← PM: como documentar jornadas
│  ├─ GIT_WORKFLOW.md      ← Dev: como fazer commits
│  └─ journeys/            ← Especificações de fluxos
│
├─ .storybook/             ← Configuração Storybook
│
├─ src/
│  ├─ components/
│  │  ├─ ui/               ← Componentes base
│  │  │  ├─ Button.tsx
│  │  │  ├─ Button.stories.tsx
│  │  │  └─ ...
│  │  └─ Dashboard.tsx     ← Componentes específicos
│  └─ Welcome.stories.mdx  ← Página inicial Storybook
│
└─ apps/                   ← Protótipos específicos
```

---

## 🎓 Próxima Hora Recomendada

Após completar este guia, você deve:

✅ Entender o que é o projeto  
✅ Saber como usar Storybook  
✅ Saber qual é seu papel  
✅ Ter criado algo de teste  
✅ Saber onde encontrar informações  

---

## 📚 Referência Rápida

| Preciso... | Vou para... | Tempo |
|-----------|-----------|-------|
| Aprender a usar Storybook | [STORYBOOK_GUIDE.md](./STORYBOOK_GUIDE.md) | 20 min |
| Aprender a fazer commit | [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) | 15 min |
| Entender uma jornada | [journeys/](./journeys/) | 10 min |
| Descobrir meu workflow diário | [DAILY_OPERATIONS.md](./DAILY_OPERATIONS.md) | 10 min |
| Entender arquitetura | [ADR-0006](./adr/ADR-0006-unified-prototyping-platform.md) | 15 min |

---

## 🤝 Suporte

- **Dúvida de setup?** → #tech-help no Slack
- **Dúvida de design?** → #design no Slack
- **Dúvida de produto?** → #product no Slack
- **Bug?** → Abra issue no GitHub

---

## 🎉 Bem-vindo ao Time!

Você agora faz parte de uma equipe usando **Storybook** como fonte de verdade para prototipagem.

Divirta-se e boa sorte! 🚀

---

**Guia criado:** 2024-11-04  
**Última atualização:** 2024-11-04  
**Versão:** 1.0.0