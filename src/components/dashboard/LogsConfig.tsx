"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { useState } from "react";
import type { GuildConfig } from "@/types";
import toast from "react-hot-toast";
import { Save } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Canal de Logs</CardTitle>
          <CardDescription>
            Define o canal onde os logs serão enviados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="ID do canal (ex: 1234567890)"
              value={logChannel}
              onChange={(e) => setLogChannel(e.target.value)}
              className="flex-1 bg-discord-dark border border-gray-700 rounded-md px-4 py-2 text-white focus:border-primary focus:outline-none"
            />
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "A guardar..." : "Guardar"}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Usa o comando /setlogs no Discord ou cola o ID do canal aqui
          </p>
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
                className="flex items-start space-x-3 p-4 bg-discord-dark rounded-lg"
              >
                <input
                  type="checkbox"
                  id={log.key}
                  checked={enabledLogs[log.key as keyof typeof enabledLogs]}
                  onChange={() => toggleLog(log.key)}
                  className="mt-1 w-4 h-4 text-primary bg-discord-darker border-gray-600 rounded focus:ring-primary"
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
          <div className="mt-6">
            <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "A guardar..." : "Guardar Configurações"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
