"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
import { Overview } from "@/components/dashboard/Overview";
import { LogsConfig } from "@/components/dashboard/LogsConfig";
import { ModerationPanel } from "@/components/dashboard/ModerationPanel";
import { api } from "@/lib/api";
import type { GuildConfig } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";

type Tab = "overview" | "logs" | "moderation" | "settings";

export default function GuildDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const guildId = params?.guildId as string;

  const [config, setConfig] = useState<GuildConfig | null>(null);
  const [guildInfo, setGuildInfo] = useState<{ name: string; icon: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (session && guildId) {
      fetchConfig();
      fetchGuildInfo();
    }
  }, [session, status, guildId]);

  const fetchConfig = async () => {
    try {
      const data = await api.getGuildConfig(guildId);
      setConfig(data);
    } catch (error) {
      console.error("Erro ao buscar configuração:", error);
      toast.error("Erro ao carregar configurações do servidor");
    } finally {
      setLoading(false);
    }
  };

  const fetchGuildInfo = async () => {
    try {
      const info = await api.getGuildInfo(guildId);
      setGuildInfo({ name: info.name, icon: info.icon });
    } catch (error) {
      console.error("Erro ao buscar informações do servidor:", error);
    }
  };

  const handleUpdateConfig = async (updates: Partial<GuildConfig>) => {
    try {
      const updated = await api.updateGuildConfig(guildId, updates);
      setConfig(updated);
    } catch (error) {
      throw error;
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Servidor não encontrado</h2>
          <Link href="/dashboard">
            <Button>Voltar à Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const guildData = {
    id: guildId,
    name: guildInfo?.name || "Carregando...",
    icon: guildInfo?.icon || null,
  };

  return (
    <div className="min-h-screen bg-bg-darker">
      <Navbar />

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar
          guild={guildData}
          currentTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as Tab)}
        />

        {/* Main Content */}
        <main className="flex-1 p-8 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            {/* Content Area */}
            <div className="animate-fade-in">
              {activeTab === "overview" && <Overview guildId={guildId} />}

              {activeTab === "logs" && (
                <LogsConfig guildId={guildId} config={config} onUpdate={handleUpdateConfig} />
              )}

              {activeTab === "moderation" && <ModerationPanel guildId={guildId} />}

              {activeTab === "settings" && config && (
                <div className="glass-strong rounded-xl p-8 border border-gray-800">
                  <h2 className="text-3xl font-bold text-gradient-gold mb-4">Configurações</h2>
                  <div className="space-y-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Prefixo do Bot
                      </label>
                      <input
                        type="text"
                        value={config.prefix || "!"}
                        onChange={(e) => {
                          const newPrefix = e.target.value;
                          handleUpdateConfig({ prefix: newPrefix });
                        }}
                        className="w-full max-w-xs bg-bg-card border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-reptile-gold focus:ring-2 focus:ring-reptile-gold/20 focus:outline-none"
                        placeholder="!"
                      />
                      <p className="text-gray-500 text-sm mt-2">
                        Prefixo usado para comandos de texto (padrão: !)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
