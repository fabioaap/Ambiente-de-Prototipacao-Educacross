import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
// Recharts (instalar com: npm i recharts)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - depende de instalação do pacote em tempo de dev
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

/**
 * Componente: LoteDeQuestoes
 * Objetivo: Tela de geração de questões em lote (seção Quantidades do Lote + Imagens do Lote)
 * - Destaque do Total de questões
 * - Distribuição por dificuldade em % (Fácil/Médio/Difícil)
 * - Gráfico de pizza dinâmico (Recharts)
 * - Validação: soma das porcentagens deve ser 100%
 * - Botão de distribuição automática (50/30/20)
 * - Bloco integrado de imagens (opcional)
 */
export default function LoteDeQuestoes() {
    // Estado
    const [total, setTotal] = useState<number>(120);
    const [percent, setPercent] = useState<{ facil: number; medio: number; dificil: number }>(
        { facil: 40, medio: 40, dificil: 20 }
    );
    const [imgPerQuestion, setImgPerQuestion] = useState<0 | 1 | 2>(0);
    const [imgStrategy, setImgStrategy] = useState<"gerar" | "upload">("gerar");
    const sum = percent.facil + percent.medio + percent.dificil;
    const isValid = sum === 100;

    // Dados do gráfico (porcentagens)
    const chartData = useMemo(
        () => [
            { name: "Fácil", value: percent.facil, color: "#28c76f" },
            { name: "Médio", value: percent.medio, color: "#ff9f43" },
            { name: "Difícil", value: percent.dificil, color: "#ea5455" },
        ],
        [percent]
    );

    // Cálculo de contagens por nível (mostrado no tooltip)
    const counts = useMemo(() => ({
        facil: Math.round((total * percent.facil) / 100),
        medio: Math.round((total * percent.medio) / 100),
        dificil: Math.round((total * percent.dificil) / 100),
    }), [total, percent]);

    function handleAutoDistribuicao() {
        setPercent({ facil: 50, medio: 30, dificil: 20 });
    }

    function handlePercentChange(key: keyof typeof percent, value: number) {
        if (Number.isNaN(value) || value < 0) value = 0;
        if (value > 100) value = 100;
        setPercent((p) => ({ ...p, [key]: value }));
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Quantidades do Lote</span>
                    <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${isValid ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                            }`}
                        aria-live="polite"
                    >
                        {isValid ? "✓ Soma OK" : `⚠ Soma: ${sum}% / 100%`}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Total de questões */}
                <div className="max-w-xs">
                    <Label htmlFor="total-questoes" className="text-sm font-medium">Total de questões do lote *</Label>
                    <Input
                        id="total-questoes"
                        type="number"
                        min={1}
                        value={total}
                        onChange={(e) => setTotal(Math.max(1, parseInt(e.target.value || "0", 10)))}
                        className="h-12 text-center text-base font-semibold border-2"
                    />
                    <div className="mt-2">
                        <Progress value={Math.min(100, (sum / 100) * 100)} />
                        <p className="mt-1 text-xs text-muted-foreground">A soma dos percentuais deve ser 100%.</p>
                    </div>
                </div>

                {/* Grid: esquerda gráfico / direita inputs */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Coluna esquerda: gráfico */}
                    <div className="rounded-xl border bg-card p-4">
                        <div className="h-64">
                            {/* @ts-ignore - depende da instalação de recharts */}
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip formatter={(value: number, _name: string, props: any) => {
                                        const v = value as number;
                                        const key = props?.payload?.name;
                                        const c = key === "Fácil" ? counts.facil : key === "Médio" ? counts.medio : counts.dificil;
                                        return [`${v}% (${c})`, key];
                                    }} />
                                    {/* @ts-ignore */}
                                    <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`slice-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                            {chartData.map((d) => (
                                <div key={d.name} className="flex items-center gap-2">
                                    <span className="inline-block h-3 w-3 rounded-sm" style={{ background: d.color }} />
                                    <span className="font-medium text-foreground">{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Coluna direita: inputs de porcentagem */}
                    <div className="rounded-xl border bg-card p-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Label htmlFor="pct-facil" className="w-28">Fácil (%)</Label>
                                <Input
                                    id="pct-facil"
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={percent.facil}
                                    onChange={(e) => handlePercentChange("facil", parseInt(e.target.value || "0", 10))}
                                    className="w-28 text-center font-semibold"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Label htmlFor="pct-medio" className="w-28">Médio (%)</Label>
                                <Input
                                    id="pct-medio"
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={percent.medio}
                                    onChange={(e) => handlePercentChange("medio", parseInt(e.target.value || "0", 10))}
                                    className="w-28 text-center font-semibold"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Label htmlFor="pct-dificil" className="w-28">Difícil (%)</Label>
                                <Input
                                    id="pct-dificil"
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={percent.dificil}
                                    onChange={(e) => handlePercentChange("dificil", parseInt(e.target.value || "0", 10))}
                                    className="w-28 text-center font-semibold"
                                />
                            </div>

                            <div className="pt-2">
                                <Button type="button" variant="outline" onClick={handleAutoDistribuicao} className="w-full">
                                    Gerar Distribuição Automática (50/30/20)
                                </Button>
                                <p className={`mt-2 text-xs ${isValid ? "text-emerald-600" : "text-amber-600"}`}>
                                    {isValid ? "Distribuição válida: 100%" : `Distribuição inválida: ${sum}%`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Separador sutil */}
                <div className="h-px w-full bg-border" />

                {/* Bloco: Imagens do lote (opcional) */}
                <div className="space-y-4">
                    <div>
                        <CardTitle className="text-base">Imagens do lote (opcional)</CardTitle>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <input
                                id="img-0"
                                type="radio"
                                className="h-4 w-4 accent-[var(--color-primary,#7367f0)]"
                                checked={imgPerQuestion === 0}
                                onChange={() => setImgPerQuestion(0)}
                            />
                            <Label htmlFor="img-0">Sem imagem</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                id="img-1"
                                type="radio"
                                className="h-4 w-4 accent-[var(--color-primary,#7367f0)]"
                                checked={imgPerQuestion === 1}
                                onChange={() => setImgPerQuestion(1)}
                            />
                            <Label htmlFor="img-1">Uma imagem por questão</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                id="img-2"
                                type="radio"
                                className="h-4 w-4 accent-[var(--color-primary,#7367f0)]"
                                checked={imgPerQuestion === 2}
                                onChange={() => setImgPerQuestion(2)}
                            />
                            <Label htmlFor="img-2">Duas imagens por questão</Label>
                        </div>
                    </div>

                    {imgPerQuestion > 0 && (
                        <div className="grid max-w-md grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="img-strategy">Estratégia de imagem</Label>
                                <select
                                    id="img-strategy"
                                    value={imgStrategy}
                                    onChange={(e) => setImgStrategy(e.target.value as any)}
                                    className="h-10 rounded-md border bg-background px-3"
                                >
                                    <option value="gerar">Gerar por IA (contexto do enunciado)</option>
                                    <option value="upload">Fazer upload depois</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
