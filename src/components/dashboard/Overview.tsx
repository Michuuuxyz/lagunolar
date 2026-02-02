"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { BotStats } from "@/types";
import { Activity, Server, Users, Zap } from "lucide-react";
import { formatUptime, formatNumber } from "@/lib/utils";

export function Overview() {
  const [stats, setStats] = useState<BotStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getBotStats();
      setStats(data);
    } catch (error) {
      console.error("Erro ao buscar stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="py-8">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Servidores",
      value: formatNumber(stats.servers),
      icon: Server,
      color: "text-blue-500",
    },
    {
      title: "Utilizadores",
      value: formatNumber(stats.users),
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Comandos",
      value: stats.commands,
      icon: Zap,
      color: "text-yellow-500",
    },
    {
      title: "Ping",
      value: `${stats.ping}ms`,
      icon: Activity,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status do Bot</CardTitle>
          <CardDescription>Informações sobre o estado atual do bot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-discord-dark rounded-lg">
              <div>
                <div className="text-sm text-gray-400">Uptime</div>
                <div className="text-lg font-semibold text-white">
                  {formatUptime(stats.uptime)}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-500 font-medium">Online</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-discord-dark rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Versão</div>
                <div className="text-white font-medium">v1.0.0</div>
              </div>
              <div className="p-4 bg-discord-dark rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Discord.js</div>
                <div className="text-white font-medium">v14.25.1</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
