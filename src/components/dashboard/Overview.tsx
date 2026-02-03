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
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { StatsCard } from "./charts/StatsCard";
import { ActivityChart } from "./charts/ActivityChart";

interface OverviewProps {
  guildId: string;
}

// Mock data - Replace with real API calls
const mockStats = {
  totalMembers: {
    value: 1247,
    change: 12.5,
    trend: "up" as const,
    sparklineData: [1100, 1150, 1180, 1200, 1220, 1235, 1247],
  },
  totalWarns: {
    value: 43,
    change: -8.3,
    trend: "down" as const,
    sparklineData: [52, 48, 45, 47, 44, 42, 43],
  },
  totalLogs: {
    value: 328,
    change: 5.2,
    trend: "up" as const,
    sparklineData: [280, 290, 310, 315, 320, 325, 328],
  },
  botLatency: {
    value: 42,
    change: 0,
    trend: "neutral" as const,
    sparklineData: [45, 43, 44, 42, 41, 42, 42],
  },
};

const activityData = [
  { date: "Seg", messages: 420, joins: 12, warns: 5, commands: 89 },
  { date: "Ter", messages: 380, joins: 8, warns: 7, commands: 76 },
  { date: "Qua", messages: 450, joins: 15, warns: 3, commands: 95 },
  { date: "Qui", messages: 390, joins: 10, warns: 6, commands: 82 },
  { date: "Sex", messages: 520, joins: 18, warns: 4, commands: 110 },
  { date: "Sáb", messages: 610, joins: 22, warns: 2, commands: 125 },
  { date: "Dom", messages: 480, joins: 14, warns: 3, commands: 98 },
];

const recentActivity = [
  {
    id: 1,
    type: "member_join",
    user: "NovoMembro#1234",
    description: "Entrou no servidor",
    timestamp: "2 min atrás",
    icon: Users,
    color: "text-success",
  },
  {
    id: 2,
    type: "warn",
    user: "Infrator#5678",
    description: "Recebeu advertência por spam",
    timestamp: "15 min atrás",
    icon: AlertTriangle,
    color: "text-warning",
  },
  {
    id: 3,
    type: "message_delete",
    user: "Moderador#9012",
    description: "Deletou mensagem de @user",
    timestamp: "32 min atrás",
    icon: FileText,
    color: "text-reptile-gold",
  },
  {
    id: 4,
    type: "member_leave",
    user: "ExMembro#3456",
    description: "Saiu do servidor",
    timestamp: "1 hora atrás",
    icon: Users,
    color: "text-error",
  },
  {
    id: 5,
    type: "role_update",
    user: "Admin#7890",
    description: "Atualizou role @Moderador",
    timestamp: "2 horas atrás",
    icon: Shield,
    color: "text-info",
  },
];

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
  const [stats, setStats] = useState(mockStats);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch real data from API
    // fetchOverviewData(guildId);
  }, [guildId]);

  const handleQuickAction = (action: string) => {
    // Handle navigation or action
    console.log("Quick action:", action);
  };

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
          value={stats.totalMembers.value}
          change={stats.totalMembers.change}
          trend={stats.totalMembers.trend}
          icon={Users}
          sparklineData={stats.totalMembers.sparklineData}
          color="gold"
        />
        <StatsCard
          title="Warns (30 dias)"
          value={stats.totalWarns.value}
          change={stats.totalWarns.change}
          trend={stats.totalWarns.trend}
          icon={AlertTriangle}
          sparklineData={stats.totalWarns.sparklineData}
          color="warning"
        />
        <StatsCard
          title="Logs (hoje)"
          value={stats.totalLogs.value}
          change={stats.totalLogs.change}
          trend={stats.totalLogs.trend}
          icon={FileText}
          sparklineData={stats.totalLogs.sparklineData}
          color="info"
        />
        <StatsCard
          title="Latência do Bot"
          value={stats.botLatency.value}
          suffix="ms"
          change={stats.botLatency.change}
          trend={stats.botLatency.trend}
          icon={Zap}
          sparklineData={stats.botLatency.sparklineData}
          color="success"
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
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-bg-card border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className={`p-2 rounded-lg bg-bg-darker ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{activity.user}</p>
                  <p className="text-gray-400 text-xs">{activity.description}</p>
                </div>
                <span className="text-gray-500 text-xs whitespace-nowrap">{activity.timestamp}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
