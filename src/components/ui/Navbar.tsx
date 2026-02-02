"use client";

import Link from "next/link";
import { Button } from "./Button";
import { useSession, signOut } from "next-auth/react";
import { getAvatarUrl } from "@/lib/utils";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-discord-darker/95 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-primary">Laguno</span>
              <span className="text-white"> Bot</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-gray-300 hover:text-white transition-colors">
              Funcionalidades
            </Link>
            <Link href="/#commands" className="text-gray-300 hover:text-white transition-colors">
              Comandos
            </Link>
            {session && (
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <img
                    src={getAvatarUrl(session.user)}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-white">{session.user.username}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button>
                  <User className="w-4 h-4 mr-2" />
                  Login Discord
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-discord-dark border-t border-gray-800">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/#features"
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Funcionalidades
            </Link>
            <Link
              href="/#commands"
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Comandos
            </Link>
            {session && (
              <Link
                href="/dashboard"
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="pt-4 border-t border-gray-800">
              {session ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <img
                      src={getAvatarUrl(session.user)}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-white">{session.user.username}</span>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => signOut()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Login Discord
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
