import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de card para agrupar e organizar conteúdo.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Simple: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        Este é um card simples com conteúdo básico.
      </CardContent>
    </Card>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card com Descrição</CardTitle>
        <CardDescription>Aqui vai uma descrição complementar do card</CardDescription>
      </CardHeader>
      <CardContent>
        Conteúdo principal do card com mais detalhes e informações.
      </CardContent>
    </Card>
  ),
}

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
        </CardHeader>
        <CardContent>Conteúdo do primeiro card</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
        </CardHeader>
        <CardContent>Conteúdo do segundo card</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 3</CardTitle>
        </CardHeader>
        <CardContent>Conteúdo do terceiro card</CardContent>
      </Card>
    </div>
  ),
}