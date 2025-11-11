import { Heart } from "lucide-react";

export function FooterSection() {
    return (
        <footer className="w-full border-t bg-slate-50 py-12 md:py-16">
            <div className="container px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-4">
                    {/* Logo e descrição */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-lg bg-[#7367ef] flex items-center justify-center">
                                <span className="text-white font-bold text-sm">EML</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900">Envio Missão Lote</span>
                        </div>
                        <p className="text-slate-600 max-w-md">
                            Simplificando a gestão educacional com tecnologia avançada e processos automatizados.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Produto</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Recursos</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Preços</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Integrações</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">API</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Suporte</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Documentação</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Central de Ajuda</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Contato</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Status</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-600 flex items-center gap-1">
                            Feito com <Heart className="h-4 w-4 text-red-500 fill-current" /> pela equipe Educacross
                        </p>
                        <div className="flex items-center gap-6 text-sm text-slate-600">
                            <a href="#" className="hover:text-blue-600 transition-colors">Termos de Uso</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Política de Privacidade</a>
                            <span>© 2025 Educacross. Todos os direitos reservados.</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}