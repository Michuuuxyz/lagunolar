"use client";

import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import Link from "next/link";
import { ArrowRight, Sparkles, Crown, Zap, TrendingUp, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, float } from "@/lib/animations";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />

      {/* Animated Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-reptile-gold/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-reptile-amber/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-7xl mx-auto"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.div variants={fadeInUp}>
              <Badge variant="gold" className="mb-6 inline-flex items-center space-x-2 px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold">Bot Discord Premium</span>
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">Laguno</span>
              <br />
              <span className="text-gradient">Seu Parceiro</span>
              <br />
              <span className="text-gradient">Discord</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0"
            >
              Bot premium com <span className="text-reptile-gold font-semibold">moderação avançada</span>,
              {" "}<span className="text-reptile-amber font-semibold">analytics em tempo real</span> e
              {" "}<span className="text-reptile-bronze font-semibold">comandos personalizáveis</span>.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
            >
              <Link href={process.env.NEXT_PUBLIC_BOT_INVITE || "#"} target="_blank">
                <Button size="lg" variant="gold" className="group">
                  <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Adicionar ao Discord
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  <Crown className="w-5 h-5 mr-2" />
                  Abrir Dashboard
                </Button>
              </Link>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0"
            >
              <div className="glass rounded-xl p-4 border-2 border-reptile-gold/20 hover:border-reptile-gold/40 transition-all card-hover group">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-gold mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gradient mb-1">24/7</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>

              <div className="glass rounded-xl p-4 border-2 border-reptile-amber/20 hover:border-reptile-amber/40 transition-all card-hover group">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-reptile-amber mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-reptile-amber mb-1">50ms</div>
                <div className="text-sm text-gray-400">Latência</div>
              </div>

              <div className="glass rounded-xl p-4 border-2 border-success/20 hover:border-success/40 transition-all card-hover group">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-success mb-1">100%</div>
                <div className="text-sm text-gray-400">Grátis</div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Bot Image */}
          <motion.div
            variants={float}
            initial="initial"
            animate="animate"
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[600px]">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-gold blur-3xl opacity-30 animate-pulse-glow" />

              {/* Bot Image */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <Image
                  src="/images/32c98c6539ced4f48d876959f4eba64b-removebg-preview.png"
                  alt="Laguno Bot"
                  width={500}
                  height={500}
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
