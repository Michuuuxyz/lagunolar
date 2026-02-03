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
import { CommandsList } from "@/components/dashboard/CommandsList";
import { api } from "@/lib/api";
import type { GuildConfig } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";

type Tab = "overview" | "logs" | "moderation" | "commands" | "settings";

export default function GuildDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const guildId = params?.guildId as string;

  const [config, setConfig] = useState<GuildConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (session && guildId) {
      fetchConfig();
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
    name: "Servidor",
    icon: null,
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

              {activeTab === "commands" && <CommandsList />}

              {activeTab === "settings" && (
                <div className="glass-strong rounded-xl p-8 border border-gray-800">
                  <h2 className="text-3xl font-bold text-gradient-gold mb-4">Configurações</h2>
                  <p className="text-gray-400">Configurações gerais do servidor - Em breve!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
