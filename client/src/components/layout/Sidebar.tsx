"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileAudio,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Filter,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/audio",
    label: "Audio Recordings",
    icon: FileAudio,
  },
  {
    href: "/admin/audio-filter",
    label: "Audio Filter",
    icon: Filter,
  },
  {
    href: "/admin/emergency-ranking",
    label: "Emergency Ranking",
    icon: AlertTriangle,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const isActiveLink = (href: string, exact?: boolean) => {
    if (exact) return router.pathname === href;
    return router.pathname.startsWith(href);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-border flex flex-col z-40",
        className
      )}
    >
      {/* Header */}
      <div className="h-16 lg:h-20 flex items-center px-4 border-b border-border">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg flex-shrink-0">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              Healix Admin
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = isActiveLink(link.href, link.exact);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <link.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-transform",
                      !isActive && "group-hover:scale-110"
                    )}
                  />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium truncate"
                    >
                      {link.label}
                    </motion.span>
                  )}
                  {isActive && link.href === "/admin/emergency-ranking" && !isCollapsed && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full animate-pulse">
                      Live
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator />

      {/* Footer Actions */}
      <div className="p-3 space-y-2">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-destructive",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 h-6 w-6 rounded-full border shadow-md bg-background"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </motion.aside>
  );
}
