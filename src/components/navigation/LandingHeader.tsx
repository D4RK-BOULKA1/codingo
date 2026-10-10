"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CodingoLogo } from "@/components/mascot/CodingoLogo";
import { Button3D } from "@/components/ui/Button3D";
import { Menu, X, Sparkles, BookOpen } from "lucide-react";

export const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <CodingoLogo size="md" />
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-[#0B3A5B]">
          <Link
            href="#parcours"
            className="hover:text-[#1B9BE0] transition-colors flex items-center gap-1.5"
          >
            <BookOpen size={18} />
            Parcours
          </Link>
          <Link
            href="#methode"
            className="hover:text-[#1B9BE0] transition-colors"
          >
            La Méthode
          </Link>
          <Link
            href="#langages"
            className="hover:text-[#1B9BE0] transition-colors"
          >
            Langages
          </Link>
          <Link
            href="/tarifs"
            className="hover:text-[#1B9BE0] transition-colors flex items-center gap-1.5 text-[#E0A81B]"
          >
            <Sparkles size={18} className="fill-[#FFC83D]" />
            Tarifs
          </Link>
        </nav>

        {/* Boutons d'Action Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Button3D variant="white" size="sm" href="/connexion">
            Connexion
          </Button3D>
          <Button3D variant="blue" size="sm" href="/inscription">
            Commencer
          </Button3D>
        </div>

        {/* Bouton Menu Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#0B3A5B] rounded-xl border-2 border-[#E2E8F0] active:scale-95"
          aria-label="Ouvrir le menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Déroulant Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b-2 border-[#CBD5E1] px-4 pt-2 pb-6 space-y-4">
          <nav className="flex flex-col gap-3 font-extrabold text-[#0B3A5B]">
            <Link
              href="#parcours"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#F8FAFC]"
            >
              Parcours
            </Link>
            <Link
              href="#methode"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#F8FAFC]"
            >
              La Méthode
            </Link>
            <Link
              href="#langages"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#F8FAFC]"
            >
              Langages
            </Link>
            <Link
              href="/tarifs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#F8FAFC] text-[#E0A81B]"
            >
              Tarifs Premium
            </Link>
          </nav>
          <div className="pt-2 border-t border-[#E2E8F0] flex flex-col gap-3">
            <Button3D
              variant="white"
              size="md"
              fullWidth
              href="/connexion"
              onClick={() => setMobileMenuOpen(false)}
            >
              Connexion
            </Button3D>
            <Button3D
              variant="blue"
              size="md"
              fullWidth
              href="/inscription"
              onClick={() => setMobileMenuOpen(false)}
            >
              Commencer gratuitement
            </Button3D>
          </div>
        </div>
      )}
    </header>
  );
};
