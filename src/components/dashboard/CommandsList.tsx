"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Command } from "@/types";
import { Smile, Info, Shield, Terminal } from "lucide-react";

const categoryIcons = {
  Fun: Smile,
  Info: Info,
  Moderation: Shield,
};

const categoryColors = {
  Fun: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  Info: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  Moderation: "text-red-500 bg-red-500/10 border-red-500/20",
};

export function CommandsList() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    try {
      const data = await api.getCommands();
      setCommands(data);
    } catch (error) {
      console.error("Erro ao buscar comandos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCommands =
    filter === "all" ? commands : commands.filter((cmd) => cmd.category === filter);

  const categories = ["all", "Fun", "Info", "Moderation"];

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-400">A carregar comandos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comandos do Bot</CardTitle>
          <CardDescription>Lista completa de comandos disponíveis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-md transition-all ${
                  filter === cat
                    ? "bg-primary text-white"
                    : "bg-discord-dark text-gray-400 hover:bg-discord-lightGray"
                }`}
              >
                {cat === "all" ? "Todos" : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCommands.map((command) => {
              const Icon = categoryIcons[command.category];
              const colorClass = categoryColors[command.category];

              return (
                <div key={command.name} className="bg-discord-dark rounded-lg p-4 hover:bg-discord-lightGray transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Terminal className="w-4 h-4 text-primary" />
                        <span className="font-mono font-semibold text-white">
                          /{command.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{command.description}</p>
                      {command.usage && (
                        <div className="text-xs font-mono bg-discord-darker rounded px-2 py-1 inline-block text-gray-500">
                          {command.usage}
                        </div>
                      )}
                      {command.permissions && command.permissions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {command.permissions.map((perm) => (
                            <span
                              key={perm}
                              className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
