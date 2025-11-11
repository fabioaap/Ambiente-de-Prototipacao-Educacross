import { Button } from "../../../../src/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaSection() {
    return (
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-[#7367ef] to-[#00cfe8] relative overflow-hidden">
            <div className="container relative px-4 md:px-6">
                <div className="mx-auto grid max-w-4xl items-center justify-center gap-8 text-center">
                    <div className="space-y-4">
                        <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Comece Agora
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                            Pronto para transformar sua gestão educacional?
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-blue-100 md:text-xl">
                            Junte-se a centenas de instituições que já otimizaram seus processos com nossa plataforma.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                            Criar Conta Gratuita
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                        >
                            Falar com Especialista
                        </Button>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-8 text-sm text-blue-100">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#28c76f]"></div>
                            <span>Sem compromisso</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                            <span>Configuração rápida</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#ff9f43]"></div>
                            <span>Suporte incluído</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}