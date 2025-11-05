import { type LucideIcon, Home, ChartColumn, ListChecks, Book, LayoutDashboard, GraduationCap, Users, FileText, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  icon: LucideIcon
  active?: boolean
  href?: string
}

const navItems: NavItem[] = [
  { label: "Painel Inicial", icon: Home, href: "/" },
  { label: "Relatórios Gerais", icon: ChartColumn, href: "/relatorios" },
  { label: "Missões da Escola", icon: ListChecks, href: "/missoes" },
  { label: "Sistema de Ensino", icon: Book, active: true, href: "/sistema-ensino" },
  { label: "Eventos", icon: LayoutDashboard, href: "/eventos" },
  { label: "Avaliação Diagnóstica", icon: GraduationCap, href: "/avaliacao" },
  { label: "Expedição Leitora", icon: Users, href: "/expedicao" },
  { label: "Cadastros", icon: FileText, href: "/cadastros" },
  { label: "Ajudas e Materiais", icon: FileText, href: "/ajuda" },
]

interface VuexySidebarProps {
  open: boolean
  onToggle: () => void
}

export function VuexySidebar({ open, onToggle }: VuexySidebarProps) {
  return (
    <aside
      className={cn(
        "bg-[#283046] text-white h-screen flex flex-col transition-all duration-300 overflow-hidden",
        open ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-white/10 px-4">
        {open ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7367ef] to-[#9e95f5] flex items-center justify-center">
              <span className="text-white font-bold text-sm">EC</span>
            </div>
            <span className="font-semibold text-lg">Educacross</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7367ef] to-[#9e95f5] flex items-center justify-center">
            <span className="text-white font-bold text-sm">EC</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item, index) => {
            const Icon = item.icon
            return (
              <li key={index}>
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "hover:bg-white/10",
                    item.active
                      ? "bg-gradient-to-r from-[#7367ef] to-[#9e95f5] text-white shadow-lg"
                      : "text-gray-300"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {open && (
                    <span className="text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="h-12 flex items-center justify-center border-t border-white/10 hover:bg-white/10 transition-colors"
      >
        <ChevronLeft
          className={cn(
            "w-5 h-5 transition-transform duration-300",
            !open && "rotate-180"
          )}
        />
      </button>
    </aside>
  )
}
