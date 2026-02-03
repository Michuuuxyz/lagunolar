"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, MessageCircle, FileText, Activity, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Comandos", href: "#commands" },
    { label: "Preços", href: "#pricing" },
  ],
  resources: [
    { label: "Documentação", href: "/docs", icon: FileText },
    { label: "Status", href: "/status", icon: Activity },
    { label: "Support", href: "/support", icon: MessageCircle },
    { label: "Segurança", href: "/security", icon: Shield },
  ],
  social: [
    { label: "Discord", href: "https://discord.gg/laguno", icon: MessageCircle },
    { label: "GitHub", href: "https://github.com/laguno", icon: Github },
    { label: "Twitter", href: "https://twitter.com/laguno", icon: Twitter },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-bg-darker border-t border-gray-800 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-reptile-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-reptile-amber/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
        >
          {/* Brand Column */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/lagarto.png"
                  alt="Laguno"
                  width={48}
                  height={48}
                  className="rounded-lg group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-reptile-gold/20 to-reptile-amber/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
              <span className="text-2xl font-bold text-gradient-gold">Laguno</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              O bot Discord premium mais completo para moderação, logs e diversão.
              Transforme seu servidor com ferramentas profissionais e performance excepcional.
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="group relative p-3 rounded-lg bg-bg-card border border-gray-800 hover:border-reptile-gold/50 transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-reptile-gold transition-colors" />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-reptile-gold/0 to-reptile-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-white font-bold mb-4 text-lg">Produto</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-reptile-gold transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-reptile-gold group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-white font-bold mb-4 text-lg">Recursos</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-reptile-gold transition-colors inline-flex items-center gap-2 group"
                  >
                    <link.icon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Image
                src="/images/lagarto.png"
                alt="Laguno"
                width={20}
                height={20}
                className="rounded opacity-70"
              />
              <span>&copy; {new Date().getFullYear()} Laguno. Todos os direitos reservados.</span>
            </div>

            <div className="flex gap-6 text-sm">
              <Link href="/terms" className="text-gray-400 hover:text-reptile-gold transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-reptile-gold transition-colors">
                Privacidade
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-reptile-gold transition-colors">
                Cookies
              </Link>
            </div>
          </div>

          {/* Tech Badge */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              Powered by{" "}
              <span className="text-reptile-gold font-semibold">Discord.js</span>
              {" • "}
              <span className="text-reptile-gold font-semibold">Next.js</span>
              {" • "}
              <span className="text-reptile-gold font-semibold">MongoDB</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-reptile-gold to-transparent opacity-50" />
    </footer>
  );
}
