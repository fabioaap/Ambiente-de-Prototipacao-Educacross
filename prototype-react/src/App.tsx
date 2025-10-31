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
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
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
  type LucideIcon,
  Book,
  ChartColumn,
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
  { label: "Relatórios Gerais", icon: ChartColumn },
  { label: "Missões da Escola", icon: ListChecks },
  { label: "Sistema de Ensino", icon: Book, active: true },
  { label: "Eventos", icon: LayoutDashboard },
  { label: "Avaliação Diagnóstica", icon: GraduationCap },
  { label: "Expedição Leitora", icon: Users },
  { label: "Cadastros", icon: FileText },
  { label: "Ajudas e Materiais", icon: FileText },
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

type Mission = {
  title: string
  plus?: boolean
  usage: string
  progress: number
  barColor: string
  status: string
  statusColor: string
}

const missions: Mission[] = [
  {
    title: "Capítulo 1: Sistema de numeração decimal e números naturais",
    plus: true,
    usage: "15 de 30",
    progress: 100,
    barColor: "bg-[#008143]",
    status: "Finalizado",
    statusColor: "text-[#008143]",
  },
  {
    title: "Capítulo 2: Números Racionais",
    usage: "15 de 30",
    progress: 20,
    barColor: "bg-[#F04461]",
    status: "Crítico",
    statusColor: "text-[#B91C1C]",
  },
  {
    title: "Capítulo 3: Números Decimais",
    plus: true,
    usage: "15 de 30",
    progress: 20,
    barColor: "bg-[#F04461]",
    status: "Crítico",
    statusColor: "text-[#B91C1C]",
  },
  {
    title: "Complementar: Frações 1",
    usage: "15 de 30",
    progress: 0,
    barColor: "bg-slate-300",
    status: "Não iniciado",
    statusColor: "text-slate-400",
  },
  {
    title: "Complementar 2: Frações 2",
    usage: "15 de 30",
    progress: 20,
    barColor: "bg-[#FFB155]",
    status: "Moderado",
    statusColor: "text-[#B45309]",
  },
  {
    title: "Capítulo 4: Números Inteiros",
    usage: "15 de 30",
    progress: 0,
    barColor: "bg-slate-300",
    status: "Não iniciado",
    statusColor: "text-slate-400",
  },
]

type LegendItem = {
  label: string
  color: string
}

const progressLegend: LegendItem[] = [
  { label: "Finalizado ≥ 100%", color: "bg-[#008143]" },
  { label: "Satisfatório ≥ 80%", color: "bg-[#5ABF7D]" },
  { label: "Moderado ≥ 50%", color: "bg-[#FFB155]" },
  { label: "Crítico ≤ 50%", color: "bg-[#F04461]" },
  { label: "Não iniciado", color: "bg-slate-300" },
]

const performanceLegend: LegendItem[] = [
  { label: "Avançado ≥ 70% de acertos", color: "bg-[#008143]" },
  { label: "Proficiente ≥ 50% de acertos", color: "bg-[#5ABF7D]" },
  { label: "Básico ≥ 25% de acertos", color: "bg-[#FFB155]" },
  { label: "Abaixo do Básico < 25% de acertos", color: "bg-[#F04461]" },
]

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[260px_1fr]">
        <AppSidebar />
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
            </section>
            <Footer />
          </main>
        </div>
      </div>
    </div>
  )
}

function AppSidebar() {
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
              Livro A · Atividades Direcionadas de Matemática
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs defaultValue="livros" className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full bg-[#EFE8FF] px-3 py-1 text-xs font-semibold text-[#4A3BD4]">
                6º ano
              </Badge>
              <h1 className="text-xl font-semibold text-slate-900">
                Livro A · Atividades Direcionadas de Matemática
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
              Relatório do livro
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
          <MissionSection />
        </TabsContent>

        <TabsContent value="escolas">
          <Placeholder message="Selecione uma escola para visualizar as métricas específicas." />
        </TabsContent>
        <TabsContent value="ranking">
          <Placeholder message="Ranking de desempenho disponível em breve." />
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
            <SelectItem value="aurora">Colégio Aurora</SelectItem>
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
            <SelectItem value="cap1">Capítulo 1</SelectItem>
            <SelectItem value="cap2">Capítulo 2</SelectItem>
            <SelectItem value="cap3">Capítulo 3</SelectItem>
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
                      <span>{entry.value}
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

function MissionSection() {
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
              placeholder="Pesquisar por missão"
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
              <TableHead className="w-[45%]">Missão</TableHead>
              <TableHead>Uso na rede</TableHead>
              <TableHead className="w-[30%]">Progresso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.map((mission) => (
              <TableRow key={mission.title} className="border-b border-slate-100 last:border-0">
                <TableCell className="space-y-1 text-sm font-semibold text-slate-900">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>{mission.title}</span>
                    {mission.plus ? (
                      <Badge className="rounded-full bg-[#EFE8FF] px-3 py-1 text-xs font-semibold text-[#4A3BD4]">
                        Missão Plus
                      </Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {mission.usage}
                </TableCell>
                <TableCell className="w-[30%]">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                      <span className={mission.statusColor}>{mission.status}</span>
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

      <Legend title="Progresso" items={progressLegend} />
      <Legend title="Rendimento" items={performanceLegend} />
    </div>
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
        2024 © <span className="text-primary">Educacross</span>. Todos os direitos
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
