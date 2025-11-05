import { ReactNode, useState } from "react"
import { VuexySidebar } from "./VuexySidebar"
import { VuexyTopbar } from "./VuexyTopbar"
import { cn } from "@/lib/utils"

interface VuexyLayoutProps {
  children: ReactNode
  className?: string
}

export function VuexyLayout({ children, className }: VuexyLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-[#f8f7fa] overflow-hidden">
      {/* Sidebar */}
      <VuexySidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className={cn("flex-1 flex flex-col overflow-hidden transition-all duration-300", sidebarOpen ? "ml-0" : "ml-0")}>
        {/* Topbar */}
        <VuexyTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className={cn("flex-1 overflow-y-auto p-6", className)}>
          {children}
        </main>
      </div>
    </div>
  )
}
