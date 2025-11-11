# 📚 Guia: Como Usar Storybook para Documentar Componentes

## Quick Start

```powershell
# 1. Inicie o Storybook
npm run storybook

# 2. Abra no navegador
http://localhost:6006/
```

## 📖 O que é Storybook?

Storybook é uma ferramenta de desenvolvimento que permite:
- ✅ **Isolar componentes** para desenvolvimento independente
- ✅ **Documentar** componentes com exemplos visuais
- ✅ **Testar** interações e estados
- ✅ **Compartilhar** com designers e PMs

## 🎯 Workflow Típico

### 1. Desenvolvedor cria componente

```typescript
// src/components/ui/button.tsx
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={`btn btn-${variant} btn-${size}`}
      {...props}
    />
  )
)
```

### 2. Cria Story ao lado

```typescript
// src/components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',                    // Categoria/Nome
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],                    // Auto-gera documentação
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Story 1: Variante padrão
export const Default: Story = {
  args: {
    children: 'Click me',
    variant: 'default',
  },
}

// Story 2: Variante outline
export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
}

// Story 3: Estados combinados
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
}

// Story 4: Interativa com ações
export const Interactive: Story = {
  args: {
    children: 'Click me',
    onClick: () => console.log('Button clicked!'),
  },
  parameters: {
    actions: { handles: ['click'] },
  },
}
```

### 3. Visualiza no Storybook

Abra `http://localhost:6006/` e verá:
- Menu esquerdo: `UI > Button`
- Tabs: `Story` | `Docs` | `Controls`
- **Controls:** Editar props em tempo real
- **Docs:** Documentação automática com exemplos

## 📋 Modelo Padrão de Story

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { MeuComponente } from './meu-componente'

// Metadados do componente
const meta: Meta<typeof MeuComponente> = {
  title: 'Categoria/NomeComponente',      // Hierarquia no menu
  component: MeuComponente,
  parameters: {
    layout: 'centered',                    // ou 'fullscreen', 'padded'
    docs: {
      description: {
        component: 'Descrição do componente aqui',
      },
    },
  },
  tags: ['autodocs'],                     // Auto-gera docs
  argTypes: {
    // Define como os controls aparecem
    variant: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'O tamanho do componente',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Story exemplo
export const Default: Story = {
  args: {
    children: 'Exemplo',
    variant: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Descrição específica desta story',
      },
    },
  },
}
```

## 🎨 Tipos de Stories

### 1. **Args Story** (com Controls)
```typescript
export const Primary: Story = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
  },
}
```
✅ Controles automáticos | Fácil testar diferentes props

### 2. **Render Story** (customizado)
```typescript
export const AllStates: Story = {
  render: () => (
    <div>
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  ),
}
```
✅ Mais flexível | Mostra múltiplas variações

### 3. **Play Story** (interação/teste)
```typescript
export const UserInteraction: Story = {
  args: { label: 'Click me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    await userEvent.click(button)
    await expect(button).toHaveClass('active')
  },
}
```
✅ Testa comportamento automático

## 📍 Estrutura de Pastas Recomendada

```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── Button.stories.tsx         ← Story do Button
│   │   ├── card.tsx
│   │   └── Card.stories.tsx           ← Story do Card
│   ├── forms/
│   │   ├── LoginForm.tsx
│   │   └── LoginForm.stories.tsx      ← Story do Form
│   └── layout/
│       ├── Header.tsx
│       └── Header.stories.tsx         ← Story do Header
└── ...

docs/
├── journeys/                          ← Jornadas de usuário
│   ├── 01-professor-frontend.md
│   ├── 02-admin-backoffice.md
│   └── 03-student-games-platform.md
└── design-system.md                   ← Overview do sistema
```

## 🔍 Boas Práticas

### ✅ Faça

- **Documente a história:** Use `description` em `parameters`
- **Agrupe logicamente:** Use `/` no título: `Button/Primary`
- **Teste estados:** Crie stories para: default, hover, disabled, loading, error
- **Use `tags`:** `tags: ['autodocs']` para documentação automática
- **Nomeie significativamente:** `Primary`, `Secondary`, `Error`, não `Story1`, `Story2`

### ❌ Não faça

- Não exporte componentes sem `meta`
- Não use `render` quando `args` é suficiente
- Não misture muitas stories em um arquivo (use separação por conceito)
- Não deixe stories sem documentação

## 📊 Exemplo Completo: Card

```typescript
// Card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardHeader, CardTitle } from './card'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card para agrupar e organizar conteúdo com consistência visual.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>Card content goes here</CardContent>
    </Card>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Featured Product</CardTitle>
        <p className="text-sm text-gray-500">Limited time offer</p>
      </CardHeader>
      <CardContent>
        <p>Product description and details</p>
      </CardContent>
    </Card>
  ),
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>Card {i}</CardTitle>
          </CardHeader>
          <CardContent>Content for card {i}</CardContent>
        </Card>
      ))}
    </div>
  ),
}
```

## 🚀 Integração Figma (Próximo Passo)

Com `storybook-connect`, sincronize automáticamente:

```bash
npm install @figma-plugin/storybook-connect
```

Então linkue no `main.ts`:
```typescript
addons: ['@figma-plugin/storybook-connect']
```

Designers podem ver a fonte de verdade do componente direto no Figma! 🎨

## 📝 Recursos

- [Storybook Oficial](https://storybook.js.org/)
- [Component Story Format](https://storybook.js.org/docs/writing-stories)
- [Controls & Args](https://storybook.js.org/docs/essentials/controls)
- [Interactions & Play Function](https://storybook.js.org/docs/writing-stories/play-function)

---

**Dúvidas?** Consulte `.github/instructions/` ou a documentação oficial.
