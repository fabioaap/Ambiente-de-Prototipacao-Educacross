import { Card, CardHeader, CardTitle, CardDescription } from "../../../../src/components/ui/card";
import { Clock, Shield, Zap, Users } from "lucide-react";

export function BenefitsSection() {
    const beneficios = [
        {
            icone: <Clock className="h-10 w-10 text-[#ff9f43]" />,
            titulo: "Economia de Tempo",
            descricao: "Reduza de horas para minutos o processo de envio de missões para múltiplas escolas.",
            estatistica: "85% mais rápido"
        },
        {
            icone: <Shield className="h-10 w-10 text-[#28c76f]" />,
            titulo: "Segurança Total",
            descricao: "Seus dados são criptografados e processados com os mais altos padrões de segurança.",
            estatistica: "100% seguro"
        },
        {
            icone: <Zap className="h-10 w-10 text-[#ea5455]" />,
            titulo: "Automação Inteligente",
            descricao: "Validação automática de dados e detecção de erros antes do envio.",
            estatistica: "99.9% de precisão"
        },
        {
            icone: <Users className="h-10 w-10 text-[#7367ef]" />,
            titulo: "Suporte Especializado",
            descricao: "Equipe dedicada pronta para ajudar em qualquer desafio que surgir.",
            estatistica: "24/7 disponível"
        },
    ];

    return (
        <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
            <div className="container px-4 md:px-6">
                <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                        <Shield className="mr-2 h-4 w-4" />
                        Benefícios
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Por que escolher nossa{" "}
                        <span className="text-green-600">plataforma</span>?
                    </h2>
                    <p className="max-w-2xl text-lg text-slate-600 md:text-xl">
                        Descubra como nossa solução transforma a gestão educacional.
                    </p>
                </div>

                <div className="mx-auto grid max-w-6xl items-start gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {beneficios.map((beneficio, index) => (
                        <Card
                            key={beneficio.titulo}
                            className="relative overflow-hidden border-0 bg-slate-50 shadow-md hover:shadow-lg transition-all duration-300 group"
                        >
                            <CardHeader className="items-center gap-4 pb-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm group-hover:shadow-md transition-shadow duration-300">
                                    {beneficio.icone}
                                </div>
                                <div className="grid gap-2 text-center">
                                    <CardTitle className="text-lg font-bold text-slate-900">
                                        {beneficio.titulo}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-slate-600 leading-relaxed">
                                        {beneficio.descricao}
                                    </CardDescription>
                                    <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 mx-auto mt-2">
                                        {beneficio.estatistica}
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                {/* Seção de depoimento inspirada no Vuexy */}
                <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-8 md:p-12">
                    <div className="mx-auto max-w-4xl text-center">
                        <blockquote className="text-xl font-medium text-slate-900 md:text-2xl">
                            "Esta plataforma revolucionou nossa forma de trabalhar. O que antes levava dias, agora é feito em minutos."
                        </blockquote>
                        <div className="mt-6 flex items-center justify-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                MC
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-slate-900">Maria Clara</div>
                                <div className="text-sm text-slate-600">Coordenadora Educacional</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}