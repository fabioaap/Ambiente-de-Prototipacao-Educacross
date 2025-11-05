import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface ConfigDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ConfigDrawer({ open, onOpenChange }: ConfigDrawerProps) {
    // Inicializa a aba como 'nao-enviada' para garantir que ela aparece primeiro
    const [tab, setTab] = useState("nao-enviada")

    useEffect(() => {
        if (open) {
            setTab("nao-enviada")
        }
    }, [open])
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex w-full max-w-[820px] flex-col rounded-l-[16px] border-l border-[#E3E3E3] bg-[#FAFAFA] p-0 shadow-xl">
                <SheetHeader className="flex flex-row items-center justify-between border-b border-[#E3E3E3] px-8 py-6">
                    <SheetTitle className="text-[20px] font-semibold text-[#2D2D2D]">Enviar missão em lote</SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-1 px-10 py-8">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-[16px] font-semibold text-[#7367ef]">Missão selecionada</h2>
                            <a href="#" className="block text-[15px] font-semibold text-[#7367ef] mt-1 hover:underline">Problemas de multiplicação</a>
                            <p className="text-[13px] text-[#A0A0A0] mt-1">Uso na rede: 2 de 20</p>
                        </div>
                        <div>
                            <h3 className="text-[16px] font-semibold text-[#2D2D2D] mb-3">Escolas</h3>
                            <div className="mb-6">
                                <div className="w-full inline-flex gap-2 rounded-full bg-[#F3F0FF] p-1 shadow-sm">
                                    <button
                                        onClick={() => setTab("nao-enviada")}
                                        className={`flex-1 rounded-full px-6 py-2 text-[15px] font-semibold transition-all ${tab === "nao-enviada"
                                            ? "bg-white text-[#7367ef] shadow-sm"
                                            : "bg-transparent text-[#7367ef]"
                                            }`}
                                    >
                                        NÃO enviada
                                    </button>
                                    <button
                                        onClick={() => setTab("enviada")}
                                        className={`flex-1 rounded-full px-6 py-2 text-[15px] font-semibold transition-all ${tab === "enviada"
                                            ? "bg-white text-[#7367ef] shadow-sm"
                                            : "bg-transparent text-[#7367ef]"
                                            }`}
                                    >
                                        Enviadas
                                    </button>
                                </div>
                                {tab === "nao-enviada" && (
                                    <>
                                        <div className="flex gap-4 mb-6">
                                            <Input placeholder="Digite o nome da escola" className="w-[340px] h-[44px] rounded-[12px] border border-[#E3E3E3] bg-white px-4 text-[15px]" />
                                            <Input placeholder="Status de envio" className="w-[220px] h-[44px] rounded-[12px] border border-[#E3E3E3] bg-white px-4 text-[15px]" />
                                        </div>
                                        <div className="border border-[#E3E3E3] rounded-[16px] overflow-hidden">
                                            <table className="w-full text-[15px]">
                                                <thead className="bg-[#F8F7FA]">
                                                    <tr>
                                                        <th className="px-5 py-3 text-left font-semibold text-[#A0A0A0]">ESCOLAS</th>
                                                        <th className="px-5 py-3 text-left font-semibold text-[#A0A0A0]">ALUNOS</th>
                                                        <th className="px-5 py-3 text-left font-semibold text-[#A0A0A0]">INÍCIO</th>
                                                        <th className="px-5 py-3 text-left font-semibold text-[#A0A0A0]">FIM</th>
                                                        <th className="px-5 py-3 text-left font-semibold text-[#A0A0A0]">STATUS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[1, 2, 3].map((i) => (
                                                        <tr key={i} className="border-t border-[#F3F0FF]">
                                                            <td className="px-5 py-3 font-semibold text-[#7367ef]">EMEF Osasco Centro</td>
                                                            <td className="px-5 py-3 text-[#2D2D2D]">320 alunos</td>
                                                            <td className="px-5 py-3 text-[#2D2D2D]">09/08/2023</td>
                                                            <td className="px-5 py-3 text-[#2D2D2D]">09/08/2023</td>
                                                            <td className="px-5 py-3"><span className="rounded-full bg-[#FFF3E3] px-4 py-1 text-[13px] font-semibold text-[#ea5455]">Não enviada</span></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="flex items-center gap-2 mt-6">
                                            <input type="checkbox" id="periodo" className="accent-[#7367ef] w-5 h-5" />
                                            <label htmlFor="periodo" className="text-[15px] text-[#2D2D2D]">Definir um período?</label>
                                        </div>
                                        <Button className="mt-8 w-full rounded-[12px] bg-[#7367ef] text-white font-semibold text-[16px] py-3 shadow-sm hover:bg-[#5b50c7] transition">Enviar</Button>
                                    </>
                                )}
                                {tab === "enviada" && (
                                    <>
                                        <div className="flex gap-4 mb-6">
                                            <Input placeholder="Digite o nome da escola" className="w-[340px] h-[44px] rounded-[12px] border border-[#E3E3E3] bg-white px-4 text-[15px]" />
                                            <Input placeholder="Status de envio" className="w-[220px] h-[44px] rounded-[12px] border border-[#E3E3E3] bg-white px-4 text-[15px]" />
                                        </div>
                                        <div className="border border-[#E3E3E3] rounded-[16px] overflow-hidden">
                                            <table className="w-full text-[15px]">
                                                <thead className="bg-[#F8F7FA]">
                                                    <tr>
                                                        <th className="px-5 py-3 text-left font-semibold text-[#A0A0A0]">ESCOLAS</th>
                                                        <th className="px-5 py-3 text-left font-semibold text-[#A0A0A0]">ALUNOS</th>
                                                        <th className="px-5 py-3 text-left font-semibold text-[#A0A0A0]">INÍCIO</th>
                                                        <th className="px-5 py-3 text-left font-semibold text-[#A0A0A0]">FIM</th>
                                                        <th className="px-5 py-3 text-left font-semibold text-[#A0A0A0]">STATUS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[1, 2, 3].map((i) => (
                                                        <tr key={i} className="border-t border-[#F3F0FF]">
                                                            <td className="px-5 py-3 font-semibold text-[#7367ef]">EMEF Osasco Centro</td>
                                                            <td className="px-5 py-3 text-[#2D2D2D]">320 alunos</td>
                                                            <td className="px-5 py-3 text-[#2D2D2D]">09/08/2023</td>
                                                            <td className="px-5 py-3 text-[#2D2D2D]">09/08/2023</td>
                                                            <td className="px-5 py-3"><span className="rounded-full bg-[#E3FFF3] px-4 py-1 text-[13px] font-semibold text-[#28c76f]">Enviada</span></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
