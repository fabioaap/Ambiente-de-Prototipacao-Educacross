import { Card, CardHeader, CardTitle, CardDescription } from "../../../../src/components/ui/card";
import { Upload, School, Send, CheckCircle } from "lucide-react";

export function HowItWorksSection() {
    const passos = [
        {
            icone: <Upload className="h-12 w-12 text-[#7367ef]" />,
            titulo: "1. Upload da Planilha",
            descricao: "Faça o upload de uma planilha com a lista de escolas e missões a serem enviadas.",
            destaque: "Suporte a Excel e CSV"
        },
        {
            icone: <School className="h-12 w-12 text-[#00cfe8]" />,
            titulo: "2. Validação Inteligente",
            descricao: "O sistema valida automaticamente os dados e mostra uma prévia detalhada.",
            destaque: "Detecção de erros em tempo real"
        },
        {
            icone: <Send className="h-12 w-12 text-[#28c76f]" />,
            titulo: "3. Envio em Massa",
            descricao: "Com um clique, envie todas as missões para as escolas selecionadas.",
            destaque: "Processamento assíncrono"
        },
    ];

    return (
        <section className="w-full py-16 md:py-24 lg:py-32 bg-slate-50">
            <div className="container px-4 md:px-6">
                <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Como Funciona
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Processo Simplificado em{" "}
                        <span className="text-blue-600">3 Passos</span>
                    </h2>
                    <p className="max-w-2xl text-lg text-slate-600 md:text-xl">
                        Transforme tarefas complexas em processos automatizados e eficientes.
                    </p>
                </div>

                <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-3">
                    {passos.map((passo, index) => (
                        <Card
                            key={passo.titulo}
                            className="relative overflow-hidden border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>

                            <CardHeader className="items-center gap-6 pb-4">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 group-hover:bg-blue-50 transition-colors duration-300">
                                    {passo.icone}
                                </div>
                                <div className="grid gap-3 text-center">
                                    <CardTitle className="text-xl font-bold text-slate-900">
                                        {passo.titulo}
                                    </CardTitle>
                                    <CardDescription className="text-base text-slate-600 leading-relaxed">
                                        {passo.descricao}
                                    </CardDescription>
                                    <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 mx-auto">
                                        {passo.destaque}
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                {/* Elemento visual adicional inspirado no Vuexy */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 shadow-md">
                        <div className="flex -space-x-2">
                            <div className="h-8 w-8 rounded-full bg-blue-500 border-2 border-white"></div>
                            <div className="h-8 w-8 rounded-full bg-cyan-500 border-2 border-white"></div>
                            <div className="h-8 w-8 rounded-full bg-green-500 border-2 border-white"></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                            Mais de 500 escolas já utilizam nossa plataforma
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}