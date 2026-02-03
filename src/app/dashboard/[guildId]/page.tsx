"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft, Settings, AlertTriangle, Terminal } from "lucide-react";
import { LogsConfig } from "@/components/dashboard/LogsConfig";
import { WarnsPanel } from "@/components/dashboard/WarnsPanel";
import { CommandsList } from "@/components/dashboard/CommandsList";
import { api } from "@/lib/api";
import type { GuildConfig } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";

type Tab = "logs" | "warns" | "commands";

export default function GuildDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const guildId = params?.guildId as string;

  const [config, setConfig] = useState<GuildConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("logs");

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

  const tabs = [
    { id: "logs", label: "Configurar Logs", icon: Settings },
    { id: "warns", label: "Avisos", icon: AlertTriangle },
    { id: "commands", label: "Comandos", icon: Terminal },
  ] as const;

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Servidores
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            Configurações do Servidor
          </h1>
          <p className="text-gray-400 text-lg">ID: {guildId}</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-t-lg transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-discord-gray text-gray-400 hover:bg-discord-lightGray hover:text-white"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "logs" && (
            <LogsConfig guildId={guildId} config={config} onUpdate={handleUpdateConfig} />
          )}
          {activeTab === "warns" && <WarnsPanel guildId={guildId} />}
          {activeTab === "commands" && <CommandsList />}
        </div>
      </div>
    </main>
  );
}
