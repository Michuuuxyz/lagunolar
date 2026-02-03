"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Smile, Info, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Command } from "@/types";

const categoryConfig = {
  Fun: {
    icon: Smile,
    title: "Diversão",
    color: "text-yellow-500",
  },
  Info: {
    icon: Info,
    title: "Informação",
    color: "text-blue-500",
  },
  Moderation: {
    icon: Shield,
    title: "Moderação",
    color: "text-red-500",
  },
};

export function Commands() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Agrupar comandos por categoria
  const commandsByCategory = commands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  if (loading) {
    return (
      <section id="commands" className="py-20 px-4 bg-discord-darker/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-400">A carregar comandos...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="commands" className="py-20 px-4 bg-discord-darker/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Lista de </span>
            <span className="text-primary">Comandos</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Todos os comandos disponíveis organizados por categoria
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {Object.entries(categoryConfig).map(([categoryKey, config], categoryIndex) => {
            const categoryCommands = commandsByCategory[categoryKey] || [];

            return (
              <motion.div
                key={config.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-10 h-10 bg-discord-dark rounded-lg flex items-center justify-center`}>
                        <config.icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <CardTitle className="text-2xl">{config.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categoryCommands.map((command, index) => (
                        <motion.div
                          key={command.name}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (index * 0.05) }}
                          viewport={{ once: true }}
                          className="p-3 bg-discord-dark rounded-lg hover:bg-discord-lightGray transition-colors"
                        >
                          <div className="font-mono text-primary font-semibold">/{command.name}</div>
                          <div className="text-sm text-gray-400">{command.description}</div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
