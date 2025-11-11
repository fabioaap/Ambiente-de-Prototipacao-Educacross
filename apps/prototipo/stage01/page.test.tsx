import { render, screen } from '@testing-library/react';
import PaginaStage01 from './page';
import { describe, it, expect } from 'vitest';

// Mock dos componentes filhos para isolar o teste da página
vi.mock('./components/secao-heroi', () => ({
    HeroSection: () => <div data-testid="secao-heroi">Hero Section</div>,
}));
vi.mock('./components/secao-como-funciona', () => ({
    HowItWorksSection: () => <div data-testid="secao-como-funciona">How It Works Section</div>,
}));
vi.mock('./components/secao-beneficios', () => ({
    BenefitsSection: () => <div data-testid="secao-beneficios">Benefits Section</div>,
}));
vi.mock('./components/secao-cta', () => ({
    CtaSection: () => <div data-testid="secao-cta">CTA Section</div>,
}));
vi.mock('./components/rodape', () => ({
    FooterSection: () => <div data-testid="rodape">Footer Section</div>,
}));

describe('Página: Stage01 (Vuexy Inspired)', () => {
    it('deve renderizar todas as seções principais', () => {
        render(<PaginaStage01 />);

        expect(screen.getByTestId('secao-heroi')).toBeInTheDocument();
        expect(screen.getByTestId('secao-como-funciona')).toBeInTheDocument();
        expect(screen.getByTestId('secao-beneficios')).toBeInTheDocument();
        expect(screen.getByTestId('secao-cta')).toBeInTheDocument();
        expect(screen.getByTestId('rodape')).toBeInTheDocument();
    });
});