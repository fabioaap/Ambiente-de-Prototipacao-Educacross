import { Menu, Search, Bell, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface VuexyTopbarProps {
  onMenuClick: () => void
  onSettingsClick?: () => void
}

export function VuexyTopbar({ onMenuClick, onSettingsClick }: VuexyTopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/sistema-ensino">Sistema de Ensino</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-[#7367ef] font-medium">
              Missões em Lote
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-9 w-64 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#ea5455] rounded-full"></span>
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100"
          onClick={onSettingsClick}
        >
          <Settings className="w-5 h-5" />
        </Button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-900">João Silva</p>
            <p className="text-xs text-gray-500">Professor</p>
          </div>
          <Avatar className="w-9 h-9 cursor-pointer ring-2 ring-transparent hover:ring-[#7367ef] transition-all">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-gradient-to-br from-[#7367ef] to-[#9e95f5] text-white">
              JS
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
