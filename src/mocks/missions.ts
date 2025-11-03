export type MissionDrawerScenarioKey =
  | "sent-active"
  | "sent-inactive"
  | "unsent-basic"
  | "unsent-with-period"
  | "unsent-detail"

export type Mission = {
  id: string
  title: string
  usage: string
  progress: number
  barColor: string
  status: string
  statusColor: string
  drawerScenario: MissionDrawerScenarioKey
  plus?: boolean
}

export const missions: Mission[] = [
  {
    id: "capitulo-1",
    title: "Capítulo 1: Sistema de numeração decimal e números naturais",
    usage: "15 de 30",
    progress: 100,
    barColor: "bg-[#008143]",
    status: "Finalizado",
    statusColor: "text-[#008143]",
    drawerScenario: "sent-active",
    plus: true,
  },
  {
    id: "capitulo-2",
    title: "Capítulo 2: Números Racionais",
    usage: "15 de 30",
    progress: 20,
    barColor: "bg-[#F04461]",
    status: "Crítico",
    statusColor: "text-[#B91C1C]",
    drawerScenario: "unsent-basic",
  },
  {
    id: "capitulo-3",
    title: "Capítulo 3: Números Decimais",
    usage: "15 de 30",
    progress: 20,
    barColor: "bg-[#F04461]",
    status: "Crítico",
    statusColor: "text-[#B91C1C]",
    drawerScenario: "unsent-with-period",
    plus: true,
  },
  {
    id: "complementar-1",
    title: "Complementar: Frações 1",
    usage: "15 de 30",
    progress: 0,
    barColor: "bg-slate-300",
    status: "Não iniciado",
    statusColor: "text-slate-400",
    drawerScenario: "unsent-detail",
  },
  {
    id: "complementar-2",
    title: "Complementar 2: Frações 2",
    usage: "15 de 30",
    progress: 20,
    barColor: "bg-[#FFB155]",
    status: "Moderado",
    statusColor: "text-[#B45309]",
    drawerScenario: "sent-inactive",
  },
  {
    id: "capitulo-4",
    title: "Capítulo 4: Números Inteiros",
    usage: "15 de 30",
    progress: 0,
    barColor: "bg-slate-300",
    status: "Não iniciado",
    statusColor: "text-slate-400",
    drawerScenario: "unsent-basic",
  },
]
