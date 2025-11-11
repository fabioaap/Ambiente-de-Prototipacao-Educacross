import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Um componente de botão reutilizável com várias variantes e tamanhos.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Variante visual do botão',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Tamanho do botão',
    },
    disabled: {
      control: 'boolean',
      description: 'Se o botão está desabilitado',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Botão',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Botão Secundário',
    variant: 'secondary',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Deletar',
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
}

export const Link: Story = {
  args: {
    children: 'Link Button',
    variant: 'link',
  },
}

export const Small: Story = {
  args: {
    children: 'Pequeno',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'Grande',
    size: 'lg',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Desabilitado',
    disabled: true,
  },
}