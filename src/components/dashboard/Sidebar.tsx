"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Shield,
  Command,
  Settings,
  ChevronDown,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
}

interface SidebarProps {
  guild: Guild;
  userGuilds?: Guild[];
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

const navigationItems = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    href: (guildId: string) => `/dashboard/${guildId}`,
  },
  {
    id: "logs",
    label: "Logs",
    icon: FileText,
    href: (guildId: string) => `/dashboard/${guildId}/logs`,
  },
  {
    id: "moderation",
    label: "Moderação",
    icon: Shield,
    href: (guildId: string) => `/dashboard/${guildId}/moderation`,
  },
  {
    id: "commands",
    label: "Comandos",
    icon: Command,
    href: (guildId: string) => `/dashboard/${guildId}/commands`,
  },
  {
    id: "settings",
    label: "Configurações",
    icon: Settings,
    href: (guildId: string) => `/dashboard/${guildId}/settings`,
  },
];

export function Sidebar({ guild, userGuilds = [], currentTab, onTabChange }: SidebarProps) {
  const [isGuildSelectorOpen, setIsGuildSelectorOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const getGuildIcon = (guild: Guild) => {
    if (guild.icon) {
      return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
    }
    return "/images/lagarto.png"; // Fallback to bot icon
  };

  const isActive = (itemId: string) => {
    if (currentTab) {
      return currentTab === itemId;
    }
    return pathname.includes(itemId);
  };

  const handleNavigation = (itemId: string) => {
    if (onTabChange) {
      onTabChange(itemId);
    }
    setIsMobileOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Guild Selector */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={() => setIsGuildSelectorOpen(!isGuildSelectorOpen)}
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-bg-card hover:bg-bg-cardHover border border-gray-800 hover:border-reptile-gold/50 transition-all duration-300 group"
        >
          <div className="relative">
            <Image
              src={getGuildIcon(guild)}
              alt={guild.name}
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-reptile-gold/0 to-reptile-gold/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-semibold text-sm truncate">{guild.name}</p>
            <p className="text-gray-400 text-xs">Gerenciar servidor</p>
          </div>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-gray-400 transition-transform duration-300",
              isGuildSelectorOpen && "rotate-180"
            )}
          />
        </button>

        {/* Guild Dropdown */}
        <AnimatePresence>
          {isGuildSelectorOpen && userGuilds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-1 overflow-hidden"
            >
              {userGuilds.map((userGuild) => (
                <Link
                  key={userGuild.id}
                  href={`/dashboard/${userGuild.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-card transition-colors"
                >
                  <Image
                    src={getGuildIcon(userGuild)}
                    alt={userGuild.name}
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <span className="text-sm text-gray-300 truncate">{userGuild.name}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActiveItem = isActive(item.id);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                isActiveItem
                  ? "bg-gradient-to-r from-reptile-gold/20 to-reptile-amber/20 text-white border border-reptile-gold/50"
                  : "text-gray-400 hover:text-white hover:bg-bg-card border border-transparent hover:border-gray-700"
              )}
            >
              {/* Active Indicator */}
              {isActiveItem && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-reptile-gold/10 to-reptile-amber/10 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <Icon
                className={cn(
                  "w-5 h-5 relative z-10 transition-colors",
                  isActiveItem ? "text-reptile-gold" : "text-gray-400 group-hover:text-reptile-gold"
                )}
              />
              <span className="font-medium relative z-10">{item.label}</span>

              {/* Glow Effect */}
              {isActiveItem && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-reptile-gold to-reptile-amber rounded-l-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-card border border-gray-800">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-reptile-gold to-reptile-amber flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">Admin</p>
            <p className="text-gray-400 text-xs">Dashboard Access</p>
          </div>
          <button
            className="p-2 hover:bg-bg-cardHover rounded-lg transition-colors group"
            title="Sair"
          >
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg bg-bg-card border border-gray-800 hover:border-reptile-gold/50 transition-colors"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 flex-col bg-bg-dark border-r border-gray-800">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-bg-dark border-r border-gray-800 z-40 flex flex-col"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
