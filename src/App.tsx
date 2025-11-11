import { useEffect, useMemo, useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  missions,
  type Mission,
  type MissionDrawerScenarioKey,
} from "./mocks/missions"
import {
  type LucideIcon,
  Book,
  CalendarDays,
  ChartColumn,
  ChevronDown,
  ChevronLeft,
  Clock3,
  Download,
  FileText,
  Gauge,
  GraduationCap,
  Home,
  LayoutDashboard,
  ListChecks,
  Menu,
  Search,
  Settings,
  Target,
  Users,
} from "lucide-react"

type NavItem = {
  label: string
  icon: LucideIcon
  active?: boolean
}

const navItems: NavItem[] = [
  { label: "Painel Inicial", icon: Home },
  { label: "RelatÃ³rios Gerais", icon: ChartColumn },
  { label: "MissÃµes da Escola", icon: ListChecks },
  { label: "Sistema de Ensino", icon: Book, active: true },
  { label: "Eventos", icon: LayoutDashboard },
  { label: "AvaliaÃ§Ã£o DiagnÃ³stica", icon: GraduationCap },
  { label: "ExpediÃ§Ã£o Leitora", icon: Users },
  { label: "Cadastros", icon: FileText },
  { label: "Ajudas e Materiais", icon: FileText },
]
const metrics: MetricCard[] = [
  {
    title: "Progresso médio",
    icon: Gauge,
    entries: [
      { type: "progress", label: "Em missões totais", value: 20, suffix: "%", color: "bg-[#F04461]" },
      { type: "progress", label: "Em missões enviadas", value: 100, suffix: "%", color: "bg-[#008143]" },
    ],
    footer: "21.600 missões enviadas / 108.000 missões totais",
  },
  {
    title: "Alunos que jogaram",
    icon: Users,
    entries: [
      {
        type: "badge",
        label: "74% dos alunos",
        value: "Moderado",
        className: "bg-[#FFE7C2] text-[#B45309]",
      },
    ],
    footer: "Cobertura dentro da rede",
  },
  {
    title: "Rendimento médio",
    icon: Target,
    entries: [
      {
        type: "badge",
        label: "95% de acertos",
        value: "Avançado",
        className: "bg-[#CFF8DF] text-[#016B3D]",
      },
    ],
    footer: "Média geral da rede",
  },
  {
    title: "Tempo total investido",
    icon: Clock3,
    entries: [{ type: "plain", text: "262h 29min 20s" }],
    footer: "Somatório de tempo em missões",
  },
  {
    title: "Total de desafios realizados",
    icon: ListChecks,
    entries: [{ type: "plain", text: "300.800", subText: "desafios realizados" }],
    footer: "Até 11 de março de 2024",
  },
]

type MetricEntry =
  | { type: "progress"; label: string; value: number; suffix?: string; color: string }
  | { type: "badge"; label: string; value: string; className: string }
  | { type: "plain"; text: string; subText?: string }

type MetricCard = {
  title: string
  icon: LucideIcon
  entries: MetricEntry[]
  footer?: string
}

type LegendItem = {
  label: string
  color: string
}

const performanceLegend: LegendItem[] = [
  { label: "AvanÃ§ado â‰¥ 70% de acertos", color: "bg-[#008143]" },
  { label: "Proficiente â‰¥ 50% de acertos", color: "bg-[#5ABF7D]" },
  { label: "BÃ¡sico â‰¥ 25% de acertos", color: "bg-[#FFB155]" },
  { label: "Abaixo do BÃ¡sico < 25% de acertos", color: "bg-[#F04461]" },
]

type DrawerTabKey = "sent" | "unsent"
type DrawerStatusTone = "success" | "warning" | "neutral"
type MissionStateTone = "info" | "warning"

type DrawerSchoolRow = {
  id: string
  name: string
  students: number
  startDate: string
  endDate: string
  status: {
    label: string
    tone: DrawerStatusTone
  }
}

type DrawerTabConfig = {
  rows: DrawerSchoolRow[]
  statusFilterOptions: string[]
  defaultStatusFilter: string
  ctaLabel: string
  ctaVariant: "destructive" | "default"
  showDefinePeriod: boolean
  defaultDefinePeriod: boolean
  detailPerSchoolAvailable: boolean
  defaultDetailPerSchool: boolean
  defaultSelectedAll: boolean
}

type MissionDrawerScenario = {
  defaultTab: DrawerTabKey
  missionState?: string
  missionStateTone?: MissionStateTone
  usage: string
  tabOverrides?: Partial<Record<DrawerTabKey, Partial<DrawerTabConfig>>>
}

const statusToneClasses: Record<DrawerStatusTone, string> = {
  success: "bg-[#CFF8DF] text-[#016B3D]",
  warning: "bg-[#FFE7C2] text-[#B45309]",
  neutral: "bg-slate-200 text-slate-600",
}

const missionStateToneClasses: Record<MissionStateTone, string> = {
  info: "text-[#4A3BD4]",
  warning: "text-[#B45309]",
}

const sentRows: DrawerSchoolRow[] = [
  {
    id: "sent-1",
    name: "EMEF Osasco Centro",
    students: 320,
    startDate: "09/08/2023",
    endDate: "09/08/2023",
    status: { label: "Iniciada", tone: "success" },
  },
  {
    id: "sent-2",
    name: "EMEF Osasco Centro",
    students: 320,
    startDate: "09/08/2023",
    endDate: "09/08/2023",
    status: { label: "Iniciada", tone: "success" },
  },
  {
    id: "sent-3",
    name: "EMEF Osasco Centro",
    students: 320,
    startDate: "09/08/2023",
    endDate: "09/08/2023",
    status: { label: "Iniciada", tone: "success" },
  },
]

const unsentRows: DrawerSchoolRow[] = [
  {
    id: "unsent-1",
    name: "EMEF Osasco Centro",
    students: 320,
    startDate: "09/08/2023",
    endDate: "09/08/2023",
    status: { label: "NÃ£o enviada", tone: "warning" },
  },
  {
    id: "unsent-2",
    name: "EMEF Osasco Centro",
    students: 320,
    startDate: "09/08/2023",
    endDate: "09/08/2023",
    status: { label: "NÃ£o enviada", tone: "warning" },
  },
  {
    id: "unsent-3",
    name: "EMEF Osasco Centro",
    students: 320,
    startDate: "09/08/2023",
    endDate: "09/08/2023",
    status: { label: "NÃ£o enviada", tone: "warning" },
  },
]

const drawerTabBase: Record<DrawerTabKey, DrawerTabConfig> = {
  sent: {
    rows: sentRows,
    statusFilterOptions: ["Todas", "Iniciada", "Pausada"],
    defaultStatusFilter: "Todas",
    ctaLabel: "Pausar",
    ctaVariant: "destructive",
    showDefinePeriod: false,
    defaultDefinePeriod: false,
    detailPerSchoolAvailable: false,
    defaultDetailPerSchool: false,
    defaultSelectedAll: false,
  },
  unsent: {
    rows: unsentRows,
    statusFilterOptions: ["Todas", "NÃ£o enviada"],
    defaultStatusFilter: "Todas",
    ctaLabel: "Enviar",
    ctaVariant: "default",
    showDefinePeriod: true,
    defaultDefinePeriod: false,
    detailPerSchoolAvailable: true,
    defaultDetailPerSchool: false,
    defaultSelectedAll: true,
  },
}

const missionDrawerScenarios: Record<MissionDrawerScenarioKey, MissionDrawerScenario> = {
  "sent-active": {
    defaultTab: "sent",
    usage: "Uso na rede 2 de 20",
  },
  "sent-inactive": {
    defaultTab: "sent",
    missionState: "Inativa",
    missionStateTone: "warning",
    usage: "Uso na rede 0 de 20",
    tabOverrides: {
      sent: {
        defaultSelectedAll: true,
      },
    },
  },
  "unsent-basic": {
    defaultTab: "unsent",
    missionState: "Inativa",
    missionStateTone: "warning",
    usage: "Uso na rede 0 de 20",
    tabOverrides: {
      unsent: {
        defaultDefinePeriod: false,
        defaultDetailPerSchool: false,
      },
    },
  },
  "unsent-with-period": {
    defaultTab: "unsent",
    missionState: "Inativa",
    missionStateTone: "warning",
    usage: "Uso na rede 0 de 20",
    tabOverrides: {
      unsent: {
        defaultDefinePeriod: true,
        defaultDetailPerSchool: false,
      },
    },
  },
  "unsent-detail": {
    defaultTab: "unsent",
    missionState: "Inativa",
    missionStateTone: "warning",
    usage: "Uso na rede 0 de 20",
    tabOverrides: {
      unsent: {
        defaultDefinePeriod: true,
        defaultDetailPerSchool: true,
      },
    },
  },
}

const missionDrawerDefaultScenarioKey: MissionDrawerScenarioKey = "sent-active"

export default function App() {
  const [openMissionId, setOpenMissionId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#F3F4F8] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <div className="flex min-h-screen flex-col">
          <Topbar />
          <main className="flex-1 space-y-6 overflow-y-auto bg-transparent p-4 sm:p-6">
            <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="h-8 gap-2 px-3 text-sm text-primary hover:bg-primary/10">
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </div>
              <PageContent />
              <MissionSection onOpenMission={setOpenMissionId} />
            </section>
            <Footer />
          </main>
        </div>
      </div>
      <MissionDrawer
        missionId={openMissionId}
        onClose={() => setOpenMissionId(null)}
      />
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="hidden border-r border-slate-200 bg-white px-6 py-8 lg:flex lg:w-[260px] lg:flex-col lg:gap-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A3BD4] text-sm font-semibold text-white">
          ec
        </div>
        <span className="text-lg font-semibold text-[#4A3BD4]">educacross</span>
      </div>
      <nav className="space-y-2 text-sm font-medium text-muted-foreground">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 rounded-xl px-3 py-2",
              item.active
                ? "bg-[#EFE8FF] text-[#4A3BD4] hover:bg-[#E4DCFF]"
                : "text-slate-600 hover:bg-[#F5F7FA]"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  )
}

function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3 lg:hidden">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Menu className="h-5 w-5 text-slate-600" />
        </Button>
        <span className="text-base font-semibold text-[#4A3BD4]">educacross</span>
      </div>
      <div className="hidden text-sm font-semibold text-[#4A3BD4] lg:block">
        Rede Nacional Encantada
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right text-sm leading-tight sm:block">
          <span className="font-semibold text-slate-900">Afonso</span>
          <span className="block text-xs text-muted-foreground">Gestor de Redes</span>
        </div>
        <Avatar className="h-9 w-9 border border-slate-200">
          <AvatarImage src="/avatars/afonso.png" alt="Afonso" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

function PageContent() {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-primary">
              Sistema de Ensino
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">A2</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">
              Livro A Â· Atividades Direcionadas de MatemÃ¡tica
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs defaultValue="livros" className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full bg-[#EFE8FF] px-3 py-1 text-xs font-semibold text-[#4A3BD4]">
                6Âº ano
              </Badge>
              <h1 className="text-xl font-semibold text-slate-900">
                Livro A Â· Atividades Direcionadas de MatemÃ¡tica
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Acompanhe o desempenho da rede por livro, escola e ranking.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="rounded-full bg-[#EFE8FF] px-3 py-1 text-xs font-semibold text-[#4A3BD4]">
              Rede Nacional Encantada
            </Badge>
            <Button className="rounded-full bg-[#4A3BD4] px-5 text-sm font-semibold text-white hover:bg-[#3A2DB8]">
              RelatÃ³rio do livro
            </Button>
          </div>
        </div>

        <TabsList className="gap-2 rounded-full bg-[#F3F4F8] p-1">
          <TabsTrigger
            value="livros"
            className="rounded-full px-5 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#4A3BD4]"
          >
            Livros
          </TabsTrigger>
          <TabsTrigger
            value="escolas"
            className="rounded-full px-5 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#4A3BD4]"
          >
            Escolas
          </TabsTrigger>
          <TabsTrigger
            value="ranking"
            className="rounded-full px-5 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#4A3BD4]"
          >
            Ranking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="livros" className="space-y-6 focus-visible:outline-none">
          <FiltersRow />
          <MetricsGrid />
        </TabsContent>

        <TabsContent value="escolas">
          <Placeholder message="Selecione uma escola para visualizar as mÃ©tricas especÃ­ficas." />
        </TabsContent>
        <TabsContent value="ranking">
          <Placeholder message="Ranking de desempenho disponÃ­vel em breve." />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FiltersRow() {
  return (
    <div className="grid gap-4 md:grid-cols-[repeat(2,minmax(0,220px))]">
      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">Escola</span>
        <Select defaultValue="all">
          <SelectTrigger className="h-11 rounded-xl border-slate-200 text-sm">
            <SelectValue placeholder="Todas as escolas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as escolas</SelectItem>
            <SelectItem value="encantada">Rede Nacional Encantada</SelectItem>
            <SelectItem value="aurora">ColÃ©gio Aurora</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">Unidades do livro</span>
        <Select defaultValue="all-units">
          <SelectTrigger className="h-11 rounded-xl border-slate-200 text-sm">
            <SelectValue placeholder="Todas as unidades do livro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-units">Todas as unidades do livro</SelectItem>
            <SelectItem value="cap1">CapÃ­tulo 1</SelectItem>
            <SelectItem value="cap2">CapÃ­tulo 2</SelectItem>
            <SelectItem value="cap3">CapÃ­tulo 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function MetricsGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-5">
      {metrics.map((metric) => (
        <Card
          key={metric.title}
          className="rounded-2xl border border-slate-100 shadow-none"
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-[#4A3BD4]" />
          </CardHeader>
          <CardContent className="space-y-3">
            {metric.entries.map((entry, index) => {
              if (entry.type === "progress") {
                return (
                  <div key={`${metric.title}-progress-${index}`} className="space-y-1">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                      <span>{entry.label}</span>
                      <span>
                        {entry.value}
                        {entry.suffix ?? "%"}
                      </span>
                    </div>
                    <Progress
                      value={entry.value}
                      className="h-2 rounded-full bg-slate-200/80"
                      indicatorClassName={entry.color}
                    />
                  </div>
                )
              }

              if (entry.type === "badge") {
                return (
                  <div key={`${metric.title}-badge-${index}`} className="space-y-1">
                    <div className="text-sm font-semibold text-slate-900">
                      {entry.label}
                    </div>
                    <Badge className={cn("w-fit rounded-full px-3 py-1 text-xs font-semibold", entry.className)}>
                      {entry.value}
                    </Badge>
                  </div>
                )
              }

              return (
                <div key={`${metric.title}-plain-${index}`} className="space-y-1">
                  <div className="text-xl font-semibold text-slate-900">
                    {entry.text}
                  </div>
                  {entry.subText ? (
                    <p className="text-xs text-muted-foreground">{entry.subText}</p>
                  ) : null}
                </div>
              )
            })}
            {metric.footer ? (
              <p className="text-xs text-muted-foreground">{metric.footer}</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function MissionSection({
  onOpenMission,
}: {
  onOpenMission: (missionId: string) => void
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Mostrar</span>
          <Select defaultValue="10">
            <SelectTrigger className="h-9 w-20 rounded-full border-slate-200 px-3 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>entradas</span>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por missÃ£o"
              className="h-10 rounded-full border-slate-200 pl-9 text-sm"
            />
          </div>
          <Button
            variant="outline"
            className="rounded-full border-[#4A3BD4] px-4 text-sm font-semibold text-[#4A3BD4] hover:bg-[#EFE8FF]/60"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar em Excel
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-slate-100 shadow-none">
        <Table>
          <TableHeader className="bg-[#F3F4F8] text-xs uppercase tracking-wide text-muted-foreground">
            <TableRow>
              <TableHead className="w-[45%]">MissÃ£o</TableHead>
              <TableHead>Uso na rede</TableHead>
              <TableHead className="w-[30%]">Progresso</TableHead>
              <TableHead className="text-right">AÃ§Ãµes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.map((mission) => (
              <TableRow key={mission.id} className="border-b border-slate-100 last:border-0">
                <TableCell className="space-y-1 text-sm font-semibold text-slate-900">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>{mission.title}</span>
                    {mission.plus ? (
                      <Badge className="rounded-full bg-[#EFE8FF] px-3 py-1 text-xs font-semibold text-[#4A3BD4]">
                        MissÃ£o Plus
                      </Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {mission.usage}
                </TableCell>
                <TableCell className="w-[30%]">
                  <div className="space-y-1">
                    <div className="flex items-center justify-end text-xs font-semibold text-muted-foreground">
                      <span>{mission.progress}%</span>
                    </div>
                    <Progress
                      value={mission.progress}
                      className="h-2 rounded-full bg-slate-200/80"
                      indicatorClassName={mission.barColor}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-[#4A3BD4] hover:bg-[#EFE8FF]"
                    onClick={() => onOpenMission(mission.id)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <span>Exibindo 1 a 10 de 20 entradas</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-[#4A3BD4] text-[#4A3BD4]">
            1
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-500 hover:bg-[#EFE8FF]">
            2
          </Button>
        </div>
      </div>

      <Legend title="Rendimento" items={performanceLegend} />
    </div>
  )
}

function MissionDrawer({
  missionId,
  onClose,
}: {
  missionId: string | null
  onClose: () => void
}) {
  const mission = useMemo(() => missions.find((item) => item.id === missionId), [missionId])
  const scenarioKey = mission?.drawerScenario ?? missionDrawerDefaultScenarioKey
  const scenario = missionDrawerScenarios[scenarioKey]

  return (
    <Sheet open={Boolean(missionId)} onOpenChange={(open) => (open ? undefined : onClose())}>
      <SheetContent className="flex w-full max-w-[1100px] flex-col rounded-l-[32px] border-l border-slate-200 bg-white p-0">
        <SheetHeader className="flex flex-row items-center justify-between border-b border-slate-200 px-8 py-5">
          <SheetTitle className="text-lg font-semibold text-slate-900">
            Enviar missÃ£o em lote
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="px-8 py-6">
            {mission ? (
              <MissionDrawerContent mission={mission} scenario={scenario} />
            ) : null}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

function MissionDrawerContent({
  mission,
  scenario,
}: {
  mission: Mission
  scenario: MissionDrawerScenario
}) {
  const tabConfigs = useMemo(() => buildTabConfigs(scenario), [scenario])
  const [tab, setTab] = useState<DrawerTabKey>(scenario.defaultTab)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState(
    tabConfigs[scenario.defaultTab].defaultStatusFilter
  )
  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(
    tabConfigs[scenario.defaultTab].defaultSelectedAll
      ? new Set(tabConfigs[scenario.defaultTab].rows.map((row) => row.id))
      : new Set()
  )
  const [definePeriod, setDefinePeriod] = useState(
    tabConfigs[scenario.defaultTab].defaultDefinePeriod
  )
  const [detailPerSchool, setDetailPerSchool] = useState(
    tabConfigs[scenario.defaultTab].defaultDetailPerSchool
  )

  useEffect(() => {
    setTab(scenario.defaultTab)
    setSearch("")
  }, [scenario])

  useEffect(() => {
    const config = tabConfigs[tab]
    setStatusFilter(config.defaultStatusFilter)
    setSelectedSchools(
      config.defaultSelectedAll
        ? new Set(config.rows.map((row) => row.id))
        : new Set()
    )
    setDefinePeriod(config.defaultDefinePeriod)
    setDetailPerSchool(config.defaultDetailPerSchool)
  }, [tab, tabConfigs])

  const currentConfig = tabConfigs[tab]

  const filteredRows = useMemo(() => {
    return currentConfig.rows.filter((row) => {
      const matchesSearch = row.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === "Todas" || row.status.label === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [currentConfig.rows, search, statusFilter])

  const allVisibleSelected =
    filteredRows.length > 0 &&
    filteredRows.every((row) => selectedSchools.has(row.id))
  const someSelected =
    filteredRows.some((row) => selectedSchools.has(row.id)) && !allVisibleSelected

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked) {
      const updated = new Set(selectedSchools)
      filteredRows.forEach((row) => updated.add(row.id))
      setSelectedSchools(updated)
    } else {
      const updated = new Set(selectedSchools)
      filteredRows.forEach((row) => updated.delete(row.id))
      setSelectedSchools(updated)
    }
  }

  const toggleSchool = (id: string, checked: boolean | "indeterminate") => {
    setSelectedSchools((prev) => {
      const updated = new Set(prev)
      if (checked) {
        updated.add(id)
      } else {
        updated.delete(id)
      }
      return updated
    })
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#E7E7F4] bg-[#F9F8FF] p-6 shadow-[0_12px_30px_rgba(120,108,196,0.12)]">
        <p className="text-sm font-semibold text-[#4A3BD4]">MissÃ£o selecionada</p>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-lg font-semibold text-slate-900">
          {mission.title}
          {mission.plus ? (
            <Badge className="rounded-full bg-[#EFE8FF] px-3 py-1 text-xs font-semibold text-[#4A3BD4]">
              MissÃ£o Plus
            </Badge>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {scenario.missionState ? (
            <span className={cn("font-semibold", missionStateToneClasses[scenario.missionStateTone ?? "info"])}>
              {scenario.missionState}
            </span>
          ) : null}
          {scenario.missionState ? " Â· " : null}
          {scenario.usage}
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Escolas</h3>
        </div>
        <Tabs value={tab} onValueChange={(value) => setTab(value as DrawerTabKey)}>
          <TabsList className="gap-2 rounded-full bg-[#EFEAFC] p-1">
            <TabsTrigger
              value="sent"
              className="rounded-full px-5 py-2 text-sm font-semibold text-[#7360DF] data-[state=active]:bg-white data-[state=active]:text-[#4A3BD4]"
            >
              Enviadas
            </TabsTrigger>
            <TabsTrigger
              value="unsent"
              className="rounded-full px-5 py-2 text-sm font-semibold text-[#7360DF] data-[state=active]:bg-white data-[state=active]:text-[#4A3BD4]"
            >
              NÃ£o enviada
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      <section className="space-y-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-2">
            <Label htmlFor="search-school" className="text-xs text-muted-foreground">
              Buscar escola
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-school"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Digite o nome da escola"
                className="h-11 rounded-xl border-slate-200 pl-9 text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Status de envio</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 rounded-xl border-slate-200 text-sm">
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                {currentConfig.statusFilterOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <Table>
            <TableHeader className="bg-[#F7F6FF] text-xs uppercase tracking-wide text-[#7C7DA6]">
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={allVisibleSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar todas as escolas visÃ­veis"
                  />
                </TableHead>
                <TableHead className="w-[35%]">
                  <div className="flex items-center gap-1">
                    Escolas
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Alunos
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    InÃ­cio
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Fim
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right">
                  <div className="inline-flex items-center gap-1">
                    Status
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.id} className="border-t border-slate-100">
                  <TableCell>
                    <Checkbox
                      checked={selectedSchools.has(row.id)}
                      onCheckedChange={(checked) => toggleSchool(row.id, checked)}
                      aria-label={`Selecionar ${row.name}`}
                    />
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-[#3E3D60]">{row.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.students.toLocaleString("pt-BR")} alunos
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.startDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.endDate}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusToneClasses[row.status.tone])}>
                      {row.status.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    Nenhuma escola encontrada para o filtro selecionado.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>

      {currentConfig.showDefinePeriod ? (
        <section className="space-y-4 rounded-2xl bg-[#F7F6FF] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="toggle-period"
                checked={definePeriod}
                onCheckedChange={(value) => setDefinePeriod(Boolean(value))}
                className="h-5 w-5 rounded-lg border-[#4A3BD4]/40"
              />
              <Label
                htmlFor="toggle-period"
                className="text-sm font-semibold text-[#4A3BD4]"
              >
                Definir um perÃ­odo?
              </Label>
            </div>
            {definePeriod && currentConfig.detailPerSchoolAvailable ? (
              <Button
                variant="outline"
                className="rounded-full border-[#4A3BD4] px-4 text-sm font-semibold text-[#4A3BD4] hover:bg-[#EFE8FF]"
                onClick={() => setDetailPerSchool((prev) => !prev)}
              >
                {detailPerSchool ? "Agrupar por perÃ­odo" : "Detalhar por escola?"}
              </Button>
            ) : null}
          </div>

          {definePeriod ? (
            detailPerSchool ? (
              <div className="space-y-3 rounded-2xl border border-[#E1E0F2] bg-white p-4">
                {currentConfig.rows.map((row) => (
                  <div
                    key={`detail-${row.id}`}
                    className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,180px))]"
                  >
                    <div className="text-sm font-semibold text-slate-700">
                      {row.name}
                    </div>
                    <DateField label="InÃ­cio" value="18/10/2023" />
                    <DateField label="Fim" value="16/11/2023" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-[repeat(2,minmax(0,200px))]">
                <DateField label="InÃ­cio" value="16/10/2023" />
                <DateField label="Fim" value="17/11/2023" />
              </div>
            )
          ) : null}
        </section>
      ) : null}

      <section className="flex justify-center">
        <Button
          variant={currentConfig.ctaVariant}
          className={cn(
            "w-48 rounded-full text-sm font-semibold",
            currentConfig.ctaVariant === "destructive"
              ? "bg-[#F4766E] text-white hover:bg-[#E5675E]"
              : "bg-[#4A3BD4] text-white hover:bg-[#3A2DB8]"
          )}
        >
          {currentConfig.ctaLabel}
        </Button>
      </section>
    </div>
  )
}

function DateField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Button
        variant="outline"
        className="w-full justify-between rounded-xl border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-[#F3F0FF]"
      >
        <span>{value}</span>
        <CalendarDays className="h-4 w-4 text-[#4A3BD4]" />
      </Button>
    </div>
  )
}

function buildTabConfigs(
  scenario: MissionDrawerScenario
): Record<DrawerTabKey, DrawerTabConfig> {
  return (["sent", "unsent"] as DrawerTabKey[]).reduce(
    (acc, key) => {
      const base = drawerTabBase[key]
      const overrides = scenario.tabOverrides?.[key] ?? {}
      acc[key] = {
        ...base,
        ...overrides,
        rows: overrides.rows ?? base.rows,
        statusFilterOptions: overrides.statusFilterOptions ?? base.statusFilterOptions,
        defaultStatusFilter: overrides.defaultStatusFilter ?? base.defaultStatusFilter,
        ctaLabel: overrides.ctaLabel ?? base.ctaLabel,
        ctaVariant: overrides.ctaVariant ?? base.ctaVariant,
        showDefinePeriod: overrides.showDefinePeriod ?? base.showDefinePeriod,
        defaultDefinePeriod: overrides.defaultDefinePeriod ?? base.defaultDefinePeriod,
        detailPerSchoolAvailable:
          overrides.detailPerSchoolAvailable ?? base.detailPerSchoolAvailable,
        defaultDetailPerSchool:
          overrides.defaultDetailPerSchool ?? base.defaultDetailPerSchool,
        defaultSelectedAll: overrides.defaultSelectedAll ?? base.defaultSelectedAll,
      }
      return acc
    },
    {} as Record<DrawerTabKey, DrawerTabConfig>
  )
}

function Legend({
  title,
  items,
}: {
  title: string
  items: LegendItem[]
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#F6F7FB] px-4 py-3 text-xs text-muted-foreground">
      <span className="font-semibold text-slate-600">{title}:</span>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span className={cn("h-2 w-6 rounded-full", item.color)} />
          {item.label}
        </span>
      ))}
    </div>
  )
}

function Placeholder({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-muted-foreground">
      {message}
    </div>
  )
}

function Footer() {
  return (
    <footer className="flex flex-col items-center gap-2 py-6 text-xs text-muted-foreground">
      <p>
        2024 Â© <span className="text-primary">Educacross</span>. Todos os direitos
        reservados.
      </p>
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-primary" />
        <span className="h-2 w-2 rounded-full bg-primary" />
        <span className="h-2 w-2 rounded-full bg-primary" />
      </div>
    </footer>
  )
}
