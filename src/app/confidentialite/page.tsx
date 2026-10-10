import React from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/navigation/LandingHeader";
import { Card3D } from "@/components/ui/Card3D";
import { ArrowLeft } from "lucide-react";

export default function ConfidentialitePage() {
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
            Politique de Confidentialité
          </h1>
          <p className="text-sm font-bold text-[#64748B] mt-1">
            Conforme au RGPD • Dernière mise à jour : 9 octobre 2026
          </p>
        </div>

        <Card3D variant="default" className="space-y-6 text-[#0B3A5B]">
          <section className="space-y-2">
            <h2 className="text-xl font-black text-[#0B3A5B]">1. Données collectées</h2>
            <p className="text-sm font-semibold text-[#4A6B82] leading-relaxed">
              Nous collectons uniquement les informations strictement nécessaires au bon fonctionnement de votre apprentissage : votre adresse email, votre nom d&apos;utilisateur public, votre progression pédagogique (leçons terminées, XP, ligue, série), et de manière facultative votre photo de profil.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-black text-[#0B3A5B]">2. Utilisation des données et IA</h2>
            <p className="text-sm font-semibold text-[#4A6B82] leading-relaxed">
              Les extraits de code que vous soumettez dans le mini-éditeur sont analysés côté serveur par notre moteur déterministe et, si nécessaire, par l&apos;API Google Gemini pour formuler des conseils pédagogiques personnalisés. Vos codes ne sont ni revendus ni utilisés pour réentraîner des modèles publics tiers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-black text-[#0B3A5B]">3. Notifications et Stockage</h2>
            <p className="text-sm font-semibold text-[#4A6B82] leading-relaxed">
              Les notifications push sont soumises à votre consentement explicite dans le navigateur. Les notifications in-app sont éphémères et automatiquement supprimées de notre base dès leur consultation. Vos photos de profil sont stockées sur Cloud Storage.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-black text-[#0B3A5B]">4. Vos Droits (RGPD)</h2>
            <p className="text-sm font-semibold text-[#4A6B82] leading-relaxed">
              Conformément à la réglementation européenne, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression immédiate de l&apos;ensemble de vos données directement depuis la page Paramètres de votre compte.
            </p>
          </section>
        </Card3D>
      </main>
    </div>
  );
}
