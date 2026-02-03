"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { useState, useEffect } from "react";
import type { GuildConfig } from "@/types";
import toast from "react-hot-toast";
import { Save, Hash, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface LogsConfigProps {
  guildId: string;
  config: GuildConfig;
  onUpdate: (config: Partial<GuildConfig>) => Promise<void>;
}

const logTypes = [
  { key: "messages", label: "Mensagens", description: "Edições e eliminações de mensagens" },
  { key: "members", label: "Membros", description: "Entradas, saídas e atualizações de membros" },
  { key: "roles", label: "Roles", description: "Criação, edição e eliminação de roles" },
  { key: "channels", label: "Canais", description: "Criação, edição e eliminação de canais" },
  { key: "voice", label: "Voz", description: "Atividade em canais de voz" },
  { key: "reactions", label: "Reações", description: "Adição e remoção de reações" },
  { key: "server", label: "Servidor", description: "Configurações do servidor" },
  { key: "invites", label: "Convites", description: "Criação e uso de convites" },
  { key: "webhooks", label: "Webhooks", description: "Criação e edição de webhooks" },
  { key: "events", label: "Eventos", description: "Eventos agendados" },
  { key: "automod", label: "AutoMod", description: "Ações do AutoMod" },
  { key: "integrations", label: "Integrações", description: "Bots e integrações" },
];

export function LogsConfig({ guildId, config, onUpdate }: LogsConfigProps) {
  const [enabledLogs, setEnabledLogs] = useState(config.enabledLogs);
  const [logChannel, setLogChannel] = useState(config.logChannel || "");
  const [saving, setSaving] = useState(false);
  const [channels, setChannels] = useState<{ id: string; name: string }[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);

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

  const selectedChannel = channels.find(c => c.id === logChannel);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Canal de Logs</CardTitle>
          <CardDescription>
            Seleciona o canal onde os logs serão enviados pelo bot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadingChannels ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-gray-400">A carregar canais...</span>
              </div>
            ) : (
              <>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <select
                      value={logChannel}
                      onChange={(e) => setLogChannel(e.target.value)}
                      className="w-full bg-discord-dark border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-primary focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Nenhum canal selecionado</option>
                      {channels.map((channel) => (
                        <option key={channel.id} value={channel.id}>
                          # {channel.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "A guardar..." : "Guardar"}
                  </Button>
                </div>

                {selectedChannel && (
                  <div className="flex items-center space-x-2 text-sm text-green-500 bg-green-500/10 px-4 py-2 rounded-md">
                    <Hash className="w-4 h-4" />
                    <span>Logs serão enviados para <strong>#{selectedChannel.name}</strong></span>
                  </div>
                )}

                {!logChannel && (
                  <div className="text-sm text-gray-400 bg-discord-dark px-4 py-3 rounded-md border border-gray-700">
                    ⚠️ Nenhum canal configurado. Os logs não serão enviados até selecionares um canal.
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Logs Ativados</CardTitle>
          <CardDescription>
            Seleciona que tipos de eventos queres registar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {logTypes.map((log) => (
              <div
                key={log.key}
                className="flex items-start space-x-3 p-4 bg-discord-dark rounded-lg hover:bg-discord-lightGray transition-colors"
              >
                <input
                  type="checkbox"
                  id={log.key}
                  checked={enabledLogs[log.key as keyof typeof enabledLogs]}
                  onChange={() => toggleLog(log.key)}
                  className="mt-1 w-4 h-4 text-primary bg-discord-darker border-gray-600 rounded focus:ring-primary cursor-pointer"
                />
                <div className="flex-1">
                  <label htmlFor={log.key} className="block font-medium text-white cursor-pointer">
                    {log.label}
                  </label>
                  <p className="text-sm text-gray-400">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4">
            <Button
              onClick={() => {
                const allEnabled = Object.keys(enabledLogs).reduce((acc, key) => ({ ...acc, [key]: true }), {});
                setEnabledLogs(allEnabled as typeof enabledLogs);
              }}
              variant="outline"
            >
              Ativar Todos
            </Button>
            <Button
              onClick={() => {
                const allDisabled = Object.keys(enabledLogs).reduce((acc, key) => ({ ...acc, [key]: false }), {});
                setEnabledLogs(allDisabled as typeof enabledLogs);
              }}
              variant="outline"
            >
              Desativar Todos
            </Button>
            <Button onClick={handleSave} disabled={saving} className="ml-auto">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "A guardar..." : "Guardar Configurações"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
