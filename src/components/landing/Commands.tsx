"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Smile, Info, Shield } from "lucide-react";
import { motion } from "framer-motion";

const commandCategories = [
  {
    icon: Smile,
    title: "Diversão",
    color: "text-yellow-500",
    commands: [
      { name: "/joke", description: "Conta uma piada aleatória" },
      { name: "/roast", description: "Dá um roast num user" },
      { name: "/8ball", description: "Faz uma pergunta à bola mágica" },
      { name: "/calculator", description: "Calculadora interativa" },
    ],
  },
  {
    icon: Info,
    title: "Informação",
    color: "text-blue-500",
    commands: [
      { name: "/userinfo", description: "Info de um utilizador" },
      { name: "/serverinfo", description: "Info do servidor" },
      { name: "/avatar", description: "Mostra o avatar de alguém" },
      { name: "/ping", description: "Verifica a latência do bot" },
    ],
  },
  {
    icon: Shield,
    title: "Moderação",
    color: "text-red-500",
    commands: [
      { name: "/warn", description: "Avisa um utilizador" },
      { name: "/ban", description: "Bane um utilizador" },
      { name: "/kick", description: "Expulsa um utilizador" },
      { name: "/mute", description: "Silencia um utilizador" },
      { name: "/clear", description: "Limpa mensagens" },
    ],
  },
];

export function Commands() {
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
          {commandCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 bg-discord-dark rounded-lg flex items-center justify-center`}>
                      <category.icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <CardTitle className="text-2xl">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.commands.map((command, index) => (
                      <motion.div
                        key={command.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (index * 0.05) }}
                        viewport={{ once: true }}
                        className="p-3 bg-discord-dark rounded-lg hover:bg-discord-lightGray transition-colors"
                      >
                        <div className="font-mono text-primary font-semibold">{command.name}</div>
                        <div className="text-sm text-gray-400">{command.description}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
