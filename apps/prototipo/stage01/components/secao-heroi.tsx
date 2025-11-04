import { Button } from "../../../../src/components/ui/button";

export function HeroSection() {
    return (
        <section className="relative w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-50 overflow-hidden">
            <div className="container relative px-4 md:px-6">
                <div className="mx-auto grid max-w-4xl items-center justify-center gap-6 text-center">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                            Protótipo de Envio de{" "}
                            <span className="bg-gradient-to-r from-[#7367ef] to-[#00cfe8] bg-clip-text text-transparent">
                                Missão em Lote
                            </span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-slate-300 md:text-xl lg:text-2xl">
                            Uma ferramenta poderosa para simplificar o envio de missões educacionais para múltiplas escolas simultaneamente.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button
                            size="lg"
                            className="bg-[#7367ef] hover:bg-[#7367ef]/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Começar Agora
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-slate-300/30 text-slate-300 hover:bg-slate-300/10 px-8 py-3 text-lg font-semibold backdrop-blur-sm"
                        >
                            Ver Demonstração
                        </Button>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#28c76f]"></div>
                            <span>Fácil de usar</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#00cfe8]"></div>
                            <span>Altamente eficiente</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#ff9f43]"></div>
                            <span>Suporte completo</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}