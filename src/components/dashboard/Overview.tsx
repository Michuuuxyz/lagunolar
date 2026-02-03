"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  AlertTriangle,
  FileText,
  Zap,
  Activity,
  Shield,
  Eye,
  Loader2,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { StatsCard } from "./charts/StatsCard";
import { ActivityChart } from "./charts/ActivityChart";
import { api } from "@/lib/api";

interface OverviewProps {
  guildId: string;
}

const quickActions = [
  {
    label: "Ver Logs Recentes",
    description: "Últimos eventos do servidor",
    icon: Eye,
    action: "logs",
    gradient: "from-reptile-gold to-reptile-amber",
  },
  {
    label: "Gerenciar Warns",
    description: "Avisos e moderação",
    icon: AlertTriangle,
    action: "moderation",
    gradient: "from-warning to-reptile-amber",
  },
  {
    label: "Configurar AutoMod",
    description: "Moderação automática",
    icon: Shield,
    action: "settings",
    gradient: "from-reptile-amber to-reptile-bronze",
  },
];

export function Overview({ guildId }: OverviewProps) {
  const [guildInfo, setGuildInfo] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
  }, [guildId]);

  const fetchOverviewData = async () => {
    try {
      setIsLoading(true);

      // Buscar dados em paralelo
      const [info, guildStats, botStats, activity, recent] = await Promise.all([
        api.getGuildInfo(guildId),
        api.getGuildStats(guildId),
        api.getBotStats(),
        api.getActivityData(guildId),
        api.getRecentLogs(guildId, 5),
      ]);

      setGuildInfo(info);
      setStats(guildStats);
      setActivityData(activity);
      setRecentActivity(recent);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    console.log("Quick action:", action);
  };

  if (isLoading || !stats || !guildInfo) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-reptile-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <h1 className="text-4xl font-bold text-gradient-gold mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Visão geral das atividades e estatísticas do servidor</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Total de Membros"
          value={guildInfo.memberCount}
          change={0}
          trend="neutral"
          icon={Users}
          sparklineData={[0]}
          color="gold"
        />
        <StatsCard
          title="Warns (30 dias)"
          value={stats.warnsLast30Days}
          change={0}
          trend="neutral"
          icon={AlertTriangle}
          sparklineData={stats.sparklines.warns}
          color="warning"
        />
        <StatsCard
          title="Logs (hoje)"
          value={stats.logsToday}
          change={0}
          trend="neutral"
          icon={FileText}
          sparklineData={stats.sparklines.logs}
          color="info"
        />
        <StatsCard
          title="Bans Ativos"
          value={stats.totalBans}
          change={0}
          trend="neutral"
          icon={Shield}
          sparklineData={[0]}
          color="error"
        />
      </motion.div>

      {/* Activity Chart */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="glass-strong rounded-xl p-6 border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Atividade Semanal</h2>
            <p className="text-gray-400 text-sm">Últimos 7 dias</p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-reptile-gold" />
          </div>
        </div>
        <ActivityChart data={activityData} />
      </motion.div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="lg:col-span-1 glass-strong rounded-xl p-6 border border-gray-800"
        >
          <h3 className="text-xl font-bold text-white mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.action}
                onClick={() => handleQuickAction(action.action)}
                className="w-full group relative overflow-hidden rounded-lg p-4 bg-bg-card border border-gray-800 hover:border-reptile-gold/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${action.gradient}`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-semibold text-sm">{action.label}</p>
                    <p className="text-gray-400 text-xs">{action.description}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-reptile-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity shimmer-effect" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="lg:col-span-2 glass-strong rounded-xl p-6 border border-gray-800"
        >
          <h3 className="text-xl font-bold text-white mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Nenhuma atividade recente</p>
            ) : (
              recentActivity.map((log: any, index) => {
                const getLogIcon = (type: string) => {
                  if (type.includes("message")) return FileText;
                  if (type.includes("Member")) return Users;
                  if (type.includes("warn") || type.includes("Ban")) return AlertTriangle;
                  return Activity;
                };

                const getLogColor = (type: string) => {
                  if (type.includes("message")) return "text-reptile-gold";
                  if (type.includes("MemberAdd")) return "text-success";
                  if (type.includes("MemberRemove")) return "text-error";
                  if (type.includes("warn") || type.includes("Ban")) return "text-warning";
                  return "text-info";
                };

                const Icon = getLogIcon(log.type);
                const color = getLogColor(log.type);

                const timeDiff = new Date().getTime() - new Date(log.createdAt).getTime();
                const minutes = Math.floor(timeDiff / 60000);
                const hours = Math.floor(timeDiff / 3600000);
                const timeAgo = hours > 0 ? `${hours}h atrás` : `${minutes}min atrás`;

                return (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-bg-card border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <div className={`p-2 rounded-lg bg-bg-darker ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">
                        {log.executor?.username || log.target?.username || "Sistema"}
                      </p>
                      <p className="text-gray-400 text-xs">{log.action}</p>
                    </div>
                    <span className="text-gray-500 text-xs whitespace-nowrap">{timeAgo}</span>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
