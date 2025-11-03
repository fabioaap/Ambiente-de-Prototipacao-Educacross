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
    title: "Capitulo 1: Sistema de numeracao decimal e numeros naturais",
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
    title: "Capitulo 2: Numeros Racionais",
    usage: "15 de 30",
    progress: 20,
    barColor: "bg-[#F04461]",
    status: "Critico",
    statusColor: "text-[#B91C1C]",
    drawerScenario: "unsent-basic",
  },
  {
    id: "capitulo-3",
    title: "Capitulo 3: Numeros Decimais",
    usage: "15 de 30",
    progress: 20,
    barColor: "bg-[#F04461]",
    status: "Critico",
    statusColor: "text-[#B91C1C]",
    drawerScenario: "unsent-with-period",
    plus: true,
  },
  {
    id: "complementar-1",
    title: "Complementar: Fracoes 1",
    usage: "15 de 30",
    progress: 0,
    barColor: "bg-slate-300",
    status: "Nao iniciado",
    statusColor: "text-slate-400",
    drawerScenario: "unsent-detail",
  },
  {
    id: "complementar-2",
    title: "Complementar 2: Fracoes 2",
    usage: "15 de 30",
    progress: 20,
    barColor: "bg-[#FFB155]",
    status: "Moderado",
    statusColor: "text-[#B45309]",
    drawerScenario: "sent-inactive",
  },
  {
    id: "capitulo-4",
    title: "Capitulo 4: Numeros Inteiros",
    usage: "15 de 30",
    progress: 0,
    barColor: "bg-slate-300",
    status: "Nao iniciado",
    statusColor: "text-slate-400",
    drawerScenario: "unsent-basic",
  },
]
