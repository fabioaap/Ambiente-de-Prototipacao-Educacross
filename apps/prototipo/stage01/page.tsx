import { HeroSection } from './components/secao-heroi';
import { HowItWorksSection } from './components/secao-como-funciona';
import { BenefitsSection } from './components/secao-beneficios';
import { CtaSection } from './components/secao-cta';
import { FooterSection } from './components/rodape';

export default function PaginaStage01() {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <main className="flex-1">
                <HeroSection />
                <HowItWorksSection />
                <BenefitsSection />
                <CtaSection />
            </main>
            <FooterSection />
        </div>
    );
}