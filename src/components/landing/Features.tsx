"use client";

import { Shield, MessageSquare, Activity, Settings, Users, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Moderação Completa",
    description: "Sistema de warns, bans, kicks e mutes. Mantém o teu servidor seguro e organizado.",
  },
  {
    icon: MessageSquare,
    title: "Sistema de Logs",
    description: "Regista todas as ações do servidor: mensagens, membros, roles e muito mais.",
  },
  {
    icon: Activity,
    title: "Comandos de Diversão",
    description: "Piadas, calculadora, roasts e muito mais para entreter os membros.",
  },
  {
    icon: Settings,
    title: "Totalmente Configurável",
    description: "Dashboard intuitiva para configurar o bot ao teu gosto.",
  },
  {
    icon: Users,
    title: "Info dos Membros",
    description: "Comandos para ver avatares, informações de users e do servidor.",
  },
  {
    icon: Zap,
    title: "Rápido e Eficiente",
    description: "Respostas instantâneas e desempenho otimizado.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Funcionalidades </span>
            <span className="text-primary">Incríveis</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Tudo o que precisas para gerir e animar o teu servidor Discord
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:border-primary transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
