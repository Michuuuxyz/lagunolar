"use client";

import { Button } from "../ui/Button";
import { Switch } from "../ui/Switch";
import { Badge } from "../ui/Badge";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { GuildConfig } from "@/types";
import toast from "react-hot-toast";
import {
  Save,
  Hash,
  Loader2,
  MessageSquare,
  Users,
  Shield,
  Hash as HashIcon,
  Mic,
  Heart,
  Server,
  Link,
  Webhook,
  Calendar,
  Bot,
  ChevronDown,
} from "lucide-react";
import { api } from "@/lib/api";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface LogsConfigProps {
  guildId: string;
  config: GuildConfig;
  onUpdate: (config: Partial<GuildConfig>) => Promise<void>;
}

const logTypes = [
  { key: "messages", label: "Mensagens", description: "Edições e eliminações", icon: MessageSquare, count: 143 },
  { key: "members", label: "Membros", description: "Entradas, saídas, updates", icon: Users, count: 28 },
  { key: "roles", label: "Roles", description: "Criação, edição, eliminação", icon: Shield, count: 12 },
  { key: "channels", label: "Canais", description: "Criação, edição, eliminação", icon: HashIcon, count: 5 },
  { key: "voice", label: "Voz", description: "Atividade em canais de voz", icon: Mic, count: 89 },
  { key: "reactions", label: "Reações", description: "Adição e remoção", icon: Heart, count: 234 },
  { key: "server", label: "Servidor", description: "Configurações do servidor", icon: Server, count: 8 },
  { key: "invites", label: "Convites", description: "Criação e uso", icon: Link, count: 15 },
  { key: "webhooks", label: "Webhooks", description: "Criação e edição", icon: Webhook, count: 3 },
  { key: "events", label: "Eventos", description: "Eventos agendados", icon: Calendar, count: 7 },
  { key: "automod", label: "AutoMod", description: "Ações do AutoMod", icon: Shield, count: 42 },
  { key: "integrations", label: "Integrações", description: "Bots e integrações", icon: Bot, count: 6 },
];

export function LogsConfig({ guildId, config, onUpdate }: LogsConfigProps) {
  const [enabledLogs, setEnabledLogs] = useState(config.enabledLogs);
  const [logChannel, setLogChannel] = useState(config.logChannel || "");
  const [saving, setSaving] = useState(false);
  const [channels, setChannels] = useState<{ id: string; name: string }[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchChannels();
  }, [guildId]);

  const fetchChannels = async () => {
    try {
      setLoadingChannels(true);
      const channelsList = await api.getGuildChannels(guildId);
      setChannels(channelsList);
    } catch (error) {
      console.error("Erro ao buscar canais:", error);
      toast.error("Erro ao carregar canais do servidor");
    } finally {
      setLoadingChannels(false);
    }
  };

  const toggleLog = (key: string) => {
    setEnabledLogs((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({ enabledLogs, logChannel: logChannel || null });
      toast.success("Configurações de logs guardadas!");
    } catch (error) {
      toast.error("Erro ao guardar configurações");
    } finally {
      setSaving(false);
    }
  };

  const enableAll = () => {
    const allEnabled = Object.keys(enabledLogs).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setEnabledLogs(allEnabled as typeof enabledLogs);
  };

  const disableAll = () => {
    const allDisabled = Object.keys(enabledLogs).reduce((acc, key) => ({ ...acc, [key]: false }), {});
    setEnabledLogs(allDisabled as typeof enabledLogs);
  };

  const selectedChannel = channels.find(c => c.id === logChannel);
  const enabledCount = Object.values(enabledLogs).filter(Boolean).length;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-4xl font-bold text-gradient-gold mb-2">Configuração de Logs</h1>
        <p className="text-gray-400">Configure quais eventos deseja registrar e onde</p>
      </motion.div>

      {/* Channel Selection Card */}
      <motion.div
        variants={fadeInUp}
        className="glass-strong rounded-xl p-6 border border-gray-800"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-reptile-gold to-reptile-amber">
            <Hash className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Canal de Logs</h2>
            <p className="text-gray-400 text-sm">Selecione onde os logs serão enviados</p>
          </div>
        </div>

        {loadingChannels ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-reptile-gold" />
            <span className="ml-2 text-gray-400">Carregando canais...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <select
                value={logChannel}
                onChange={(e) => setLogChannel(e.target.value)}
                className="w-full bg-bg-card border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-reptile-gold focus:ring-2 focus:ring-reptile-gold/20 focus:outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="">Nenhum canal selecionado</option>
                {channels.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    # {channel.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {selectedChannel && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/30">
                <Hash className="w-4 h-4 text-success" />
                <span className="text-success text-sm">
                  Logs serão enviados para <strong>#{selectedChannel.name}</strong>
                </span>
              </div>
            )}

            {!logChannel && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/30">
                <span className="text-warning text-sm">
                  ⚠️ Nenhum canal configurado. Os logs não serão enviados.
                </span>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Stats Summary */}
      <motion.div variants={fadeInUp} className="flex gap-4">
        <div className="flex-1 glass rounded-lg p-4 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Tipos Ativos</p>
          <p className="text-2xl font-bold text-reptile-gold">{enabledCount}/{logTypes.length}</p>
        </div>
        <div className="flex-1 glass rounded-lg p-4 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Logs Hoje</p>
          <p className="text-2xl font-bold text-white">
            {logTypes.reduce((sum, log) => sum + (enabledLogs[log.key as keyof typeof enabledLogs] ? log.count : 0), 0)}
          </p>
        </div>
      </motion.div>

      {/* Toggle Cards Grid */}
      <motion.div variants={fadeInUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Tipos de Logs</h2>
          <div className="flex gap-2">
            <Button onClick={enableAll} variant="outline" size="sm">
              Ativar Todos
            </Button>
            <Button onClick={disableAll} variant="outline" size="sm">
              Desativar Todos
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {logTypes.map((log) => {
            const isEnabled = enabledLogs[log.key as keyof typeof enabledLogs];
            const Icon = log.icon;

            return (
              <motion.div
                key={log.key}
                variants={fadeInUp}
                className={`relative group glass rounded-xl p-5 border transition-all duration-300 ${
                  isEnabled ? "border-reptile-gold/50 bg-reptile-gold/5" : "border-gray-800 hover:border-gray-700"
                }`}
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-lg mb-4 ${
                  isEnabled ? "bg-gradient-to-br from-reptile-gold to-reptile-amber" : "bg-bg-card"
                }`}>
                  <Icon className={`w-6 h-6 ${isEnabled ? "text-white" : "text-gray-400"}`} />
                </div>

                {/* Title & Description */}
                <div className="mb-4">
                  <h3 className="text-white font-semibold mb-1">{log.label}</h3>
                  <p className="text-gray-400 text-xs">{log.description}</p>
                </div>

                {/* Badge & Switch */}
                <div className="flex items-center justify-between">
                  <Badge variant={isEnabled ? "gold" : "outline"} size="sm">
                    {log.count} hoje
                  </Badge>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => toggleLog(log.key)}
                  />
                </div>

                {/* Shimmer Effect */}
                {isEnabled && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-reptile-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity shimmer-effect rounded-xl" />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={fadeInUp} className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          variant="gold"
          size="lg"
          className="relative overflow-hidden"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Guardar Configurações
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
