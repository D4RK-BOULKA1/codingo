import React from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/navigation/LandingHeader";
import { Card3D } from "@/components/ui/Card3D";
import { Button3D } from "@/components/ui/Button3D";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-white text-[#0B3A5B] flex flex-col">
      <LandingHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[#1B9BE0] hover:underline mb-4"
          >
            <ArrowLeft size={16} />
            Retour à l&apos;accueil
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-[#0B3A5B]">
            Conditions Générales d&apos;Utilisation (CGU)
          </h1>
          <p className="text-sm font-bold text-[#64748B] mt-1">
            Dernière mise à jour : 9 octobre 2026
          </p>
        </div>

        <Card3D variant="default" className="space-y-6 text-[#0B3A5B]">
          <section className="space-y-2">
            <h2 className="text-xl font-black text-[#0B3A5B]">1. Objet du Service</h2>
            <p className="text-sm font-semibold text-[#4A6B82] leading-relaxed">
              Codingo est une plateforme pédagogique en ligne dédiée à l&apos;apprentissage ludique et interactif de la programmation informatique. L&apos;accès au service est gratuit pour les fonctionnalités de base avec un système de cœurs limités et propose une formule d&apos;abonnement Premium optionnelle sans engagement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-black text-[#0B3A5B]">2. Inscription et Sécurité du Compte</h2>
            <p className="text-sm font-semibold text-[#4A6B82] leading-relaxed">
              Pour accéder aux parcours d&apos;apprentissage, l&apos;utilisateur doit créer un compte au moyen d&apos;une adresse e-mail valide ou d&apos;un compte Google. L&apos;utilisateur s&apos;engage à fournir des informations exactes et à préserver la confidentialité de ses identifiants.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-black text-[#0B3A5B]">3. Système de Gamification et Cœurs</h2>
            <p className="text-sm font-semibold text-[#4A6B82] leading-relaxed">
              Les utilisateurs du forfait gratuit disposent d&apos;une réserve de 5 cœurs. Chaque exercice échoué retire un cœur. Le minuteur de récupération démarre dès le premier cœur perdu et restaure l&apos;intégralité des 5 cœurs après un délai continu de 5 heures calculé côté serveur. Les abonnés Premium bénéficient de cœurs illimités.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-black text-[#0B3A5B]">4. Propriété Intellectuelle et Code Utilisateur</h2>
            <p className="text-sm font-semibold text-[#4A6B82] leading-relaxed">
              L&apos;ensemble des contenus pédagogiques, leçons, textes, logos et illustrations vectorielles représentant la mascotte Codie sont la propriété exclusive de Codingo. Le code écrit par l&apos;utilisateur dans le cadre des exercices et mini-projets demeure sa pleine et entière propriété.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-black text-[#0B3A5B]">5. Abonnements et Paiements</h2>
            <p className="text-sm font-semibold text-[#4A6B82] leading-relaxed">
              L&apos;abonnement Codingo Premium est facturé à hauteur de 25 euros par mois via notre passerelle de paiement sécurisée SaaSpay. L&apos;utilisateur peut résilier son abonnement à tout moment depuis les paramètres de son compte.
            </p>
          </section>
        </Card3D>
      </main>
    </div>
  );
}
