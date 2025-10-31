import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav">
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    aria-label="breadcrumb"
    className={cn("w-full text-sm text-muted-foreground", className)}
    {...props}
  />
))
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn("flex flex-wrap items-center gap-1.5 text-sm", className)}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("inline-flex items-center gap-1", className)} {...props} />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "transition-colors hover:text-foreground",
      className
    )}
    {...props}
  />
))
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-3.5 w-3.5 items-center justify-center", className)}
    {...props}
  >
    {children ?? <ChevronRight className="h-3 w-3" />}
  </span>
)

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
}
