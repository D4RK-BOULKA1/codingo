import React from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/navigation/LandingHeader";
import { CodieMascot } from "@/components/mascot/CodieMascot";
import { Button3D } from "@/components/ui/Button3D";
import { Card3D } from "@/components/ui/Card3D";
import { InteractiveDemoExercise } from "@/components/landing/InteractiveDemoExercise";
import {
  Code,
  Heart,
  Trophy,
  Flame,
  Sparkles,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Shield,
  Layers,
  Terminal,
  Compass,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#0B3A5B] flex flex-col">
      {/* Navigation Principale */}
      <LandingHeader />

      <main className="flex-1">
        {/* ================================================================
            SECTION HERO
            ================================================================ */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b-2 border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Colonne Gauche : Titre & Appel à l'action */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F0F9FF] border-2 border-[#1B9BE0] text-[#0B3A5B] text-xs md:text-sm font-black uppercase tracking-wider">
                  <Sparkles size={16} className="text-[#1B9BE0]" />
                  <span>Le Duolingo du Code est enfin là</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B3A5B] tracking-tight leading-[1.1]">
                  La façon la plus{" "}
                  <span className="text-[#1B9BE0] underline decoration-[#FFC83D] decoration-wavy decoration-2">
                    addictive
                  </span>{" "}
                  d&apos;apprendre à programmer.
                </h1>

                <p className="text-lg md:text-xl font-bold text-[#4A6B82] max-w-2xl mx-auto lg:mx-0">
                  Pas de vidéos interminables. Avancez par micro-leçons de 5 minutes, gagnez de l&apos;XP, montez de ligue et écrivez réellement du code vérifié par votre compagnon Codie et une IA patiente.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Button3D
                    variant="blue"
                    size="lg"
                    href="/inscription"
                    className="w-full sm:w-auto text-base"
                    icon={<ArrowRight size={20} />}
                  >
                    Commencer gratuitement
                  </Button3D>

                  <Button3D
                    variant="white"
                    size="lg"
                    href="#demo"
                    className="w-full sm:w-auto text-base"
                  >
                    Tester un exercice
                  </Button3D>
                </div>

                {/* Micro Réassurance */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs md:text-sm font-bold text-[#64748B]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#2CD98F]" />
                    <span>100% Gratuit pour démarrer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#2CD98F]" />
                    <span>HTML &amp; CSS disponibles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#2CD98F]" />
                    <span>Correction IA instantanée</span>
                  </div>
                </div>
              </div>

              {/* Colonne Droite : Mascotte Codie en Majesté */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative">
                  {/* Carte Flat 3D porteuse */}
                  <div className="card-3d-blue p-8 md:p-12 bg-white flex flex-col items-center text-center max-w-sm">
                    <CodieMascot mood="happy" size="lg" />
                    
                    <div className="mt-6 space-y-2">
                      <div className="text-xl font-black text-[#0B3A5B]">
                        Rencontrez Codie !
                      </div>
                      <p className="text-sm font-bold text-[#4A6B82]">
                        Votre guide personnel dans l&apos;univers du code. Toujours encourageant, jamais impatient.
                      </p>
                    </div>

                    <div className="mt-6 w-full pt-4 border-t-2 border-[#E2E8F0] flex items-center justify-around">
                      <div className="text-center">
                        <div className="text-lg font-black text-[#FFC83D]">5 cœurs</div>
                        <div className="text-xs font-bold text-[#64748B]">Par jour</div>
                      </div>
                      <div className="w-0.5 h-8 bg-[#E2E8F0]" />
                      <div className="text-center">
                        <div className="text-lg font-black text-[#1B9BE0]">10 ligues</div>
                        <div className="text-xs font-bold text-[#64748B]">À gravir</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION DÉMO INTERACTIVE EN DIRECT
            ================================================================ */}
        <section id="demo" className="py-16 md:py-24 bg-[#F8FAFC] border-b-2 border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs md:text-sm font-black uppercase tracking-wider text-[#1B9BE0]">
                Faites l&apos;expérience immédiate
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0B3A5B] mt-2">
                Testez une leçon Codingo en 30 secondes
              </h2>
              <p className="text-base md:text-lg font-bold text-[#4A6B82] mt-3">
                Touchez, répondez, écoutez et constatez la clarté des explications.
              </p>
            </div>

            <InteractiveDemoExercise />
          </div>
        </section>

        {/* ================================================================
            SECTION "LA MÉTHODE CODINGO" (Pourquoi c&apos;est supérieur à un cours classique)
            ================================================================ */}
        <section id="methode" className="py-16 md:py-24 border-b-2 border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs md:text-sm font-black uppercase tracking-wider text-[#1B9BE0]">
                Pédagogie Révolutionnaire
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0B3A5B] mt-2">
                Conçu pour ceux qui abandonnent les tutoriels classiques
              </h2>
              <p className="text-base md:text-lg font-bold text-[#4A6B82] mt-3">
                90% des personnes qui débutent la programmation lâchent prise à cause de cours trop théoriques. Codingo inverse la tendance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pilier 1 : Cœurs */}
              <Card3D variant="default" hoverEffect className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF1F1] border-2 border-[#FF5353] flex items-center justify-center">
                  <Heart size={28} className="fill-[#FF5353] text-[#D63030]" />
                </div>
                <h3 className="text-xl font-black text-[#0B3A5B]">Système de Cœurs</h3>
                <p className="text-sm font-bold text-[#4A6B82]">
                  5 cœurs pour stimuler votre concentration. Chaque erreur est expliquée immédiatement sans jugement, avec recharge automatique côté serveur en 5 heures.
                </p>
              </Card3D>

              {/* Pilier 2 : Mini-Éditeur & Sandbox */}
              <Card3D variant="default" hoverEffect className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F0F9FF] border-2 border-[#1B9BE0] flex items-center justify-center">
                  <Terminal size={28} className="text-[#1B9BE0]" />
                </div>
                <h3 className="text-xl font-black text-[#0B3A5B]">Vrai Code Interactif</h3>
                <p className="text-sm font-bold text-[#4A6B82]">
                  Au moins 5 exercices pratiques par leçon dans un mini-éditeur sécurisé avec aperçu live en temps réel. Vous codez dès le premier jour.
                </p>
              </Card3D>

              {/* Pilier 3 : Tuteur IA Bienveillant */}
              <Card3D variant="default" hoverEffect className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FFFBEB] border-2 border-[#E0A81B] flex items-center justify-center">
                  <Cpu size={28} className="text-[#E0A81B]" />
                </div>
                <h3 className="text-xl font-black text-[#0B3A5B]">IA Pédagogique</h3>
                <p className="text-sm font-bold text-[#4A6B82]">
                  Propulsée par les modèles Google les plus récents, l&apos;IA détecte votre blocage et vous donne des indices progressifs sans dévoiler la solution brute.
                </p>
              </Card3D>

              {/* Pilier 4 : Ligues & Flammes */}
              <Card3D variant="default" hoverEffect className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F0FDF4] border-2 border-[#189C63] flex items-center justify-center">
                  <Trophy size={28} className="text-[#189C63]" />
                </div>
                <h3 className="text-xl font-black text-[#0B3A5B]">10 Ligues &amp; Séries</h3>
                <p className="text-sm font-bold text-[#4A6B82]">
                  Gravissez les échelons de Bronze à Diamant. Maintenez votre série quotidienne pour débloquer des gemmes et personnaliser votre profil.
                </p>
              </Card3D>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION CATALOGUE DE LANGAGES
            ================================================================ */}
        <section id="langages" className="py-16 md:py-24 bg-[#F8FAFC] border-b-2 border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs md:text-sm font-black uppercase tracking-wider text-[#1B9BE0]">
                Catalogue Disponible
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0B3A5B] mt-2">
                Choisissez votre premier langage
              </h2>
              <p className="text-base md:text-lg font-bold text-[#4A6B82] mt-3">
                Vous pouvez suivre plusieurs langages simultanément. Votre progression et vos statistiques sont sauvegardées indépendamment pour chacun.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Langage 1 : HTML (Disponible) */}
              <Card3D variant="blue" hoverEffect className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-xl bg-[#2CD98F] text-[#0B3A5B] border border-[#189C63] text-xs font-black uppercase">
                      Disponible
                    </span>
                    <span className="text-xs font-black text-[#1B9BE0]">8 Unités complètes</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#0B3A5B] mb-2">HTML5</h3>
                  <p className="text-sm font-bold text-[#4A6B82] mb-4">
                    La structure de tout le web moderne : balises fondamentales, textes, images, formulaires, balises sémantiques et bonnes pratiques SEO.
                  </p>
                </div>
                <Button3D variant="blue" size="md" href="/inscription" fullWidth>
                  Apprendre le HTML
                </Button3D>
              </Card3D>

              {/* Langage 2 : CSS (Disponible) */}
              <Card3D variant="blue" hoverEffect className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-xl bg-[#2CD98F] text-[#0B3A5B] border border-[#189C63] text-xs font-black uppercase">
                      Disponible
                    </span>
                    <span className="text-xs font-black text-[#1B9BE0]">10 Unités complètes</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#0B3A5B] mb-2">CSS3</h3>
                  <p className="text-sm font-bold text-[#4A6B82] mb-4">
                    Le design et la mise en page : sélecteurs, typographie, Box Model, Flexbox, Grid, animations et conception responsive mobile-first.
                  </p>
                </div>
                <Button3D variant="blue" size="md" href="/inscription" fullWidth>
                  Apprendre le CSS
                </Button3D>
              </Card3D>

              {/* Langage 3 : JavaScript (Bientôt) */}
              <Card3D variant="default" className="flex flex-col justify-between opacity-85">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-xl bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] text-xs font-black uppercase">
                      Bientôt disponible
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#0B3A5B] mb-2">JavaScript</h3>
                  <p className="text-sm font-bold text-[#4A6B82] mb-4">
                    Donnez vie à vos pages web : variables, fonctions, manipulation du DOM, événements et appels API.
                  </p>
                </div>
                <div className="py-2 text-center text-xs font-extrabold text-[#64748B] uppercase tracking-wider">
                  En cours de rédaction
                </div>
              </Card3D>

              {/* Langage 4 : Python (Bientôt) */}
              <Card3D variant="default" className="flex flex-col justify-between opacity-85">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-xl bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] text-xs font-black uppercase">
                      Bientôt disponible
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#0B3A5B] mb-2">Python</h3>
                  <p className="text-sm font-bold text-[#4A6B82] mb-4">
                    La syntaxe la plus élégante : scripts, traitement de données, algorithmique et bases du backend.
                  </p>
                </div>
                <div className="py-2 text-center text-xs font-extrabold text-[#64748B] uppercase tracking-wider">
                  En cours de rédaction
                </div>
              </Card3D>

              {/* Langage 5 : React (Bientôt) */}
              <Card3D variant="default" className="flex flex-col justify-between opacity-85">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-xl bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] text-xs font-black uppercase">
                      Bientôt disponible
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#0B3A5B] mb-2">React</h3>
                  <p className="text-sm font-bold text-[#4A6B82] mb-4">
                    Le framework web mondial : composants réutilisables, props, état local (hooks) et interfaces réactives.
                  </p>
                </div>
                <div className="py-2 text-center text-xs font-extrabold text-[#64748B] uppercase tracking-wider">
                  En cours de rédaction
                </div>
              </Card3D>

              {/* Langage 6 : Lua (Bientôt) */}
              <Card3D variant="default" className="flex flex-col justify-between opacity-85">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-xl bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] text-xs font-black uppercase">
                      Bientôt disponible
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#0B3A5B] mb-2">Lua</h3>
                  <p className="text-sm font-bold text-[#4A6B82] mb-4">
                    Le langage des créateurs de jeux vidéo : scripts légers, programmation d&apos;automates et logiques interactives.
                  </p>
                </div>
                <div className="py-2 text-center text-xs font-extrabold text-[#64748B] uppercase tracking-wider">
                  En cours de rédaction
                </div>
              </Card3D>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION CALL TO ACTION FINAL
            ================================================================ */}
        <section className="py-20 md:py-28 bg-white border-b-2 border-[#E2E8F0]">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <CodieMascot mood="coach" size="lg" className="mx-auto" />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B3A5B]">
              Prêt à écrire votre première ligne de code aujourd&apos;hui ?
            </h2>

            <p className="text-lg font-bold text-[#4A6B82] max-w-xl mx-auto">
              Rejoignez des milliers d&apos;apprenants. Aucun prérequis technique demandé. Codie vous accompagne dès la première minute.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button3D
                variant="blue"
                size="lg"
                href="/inscription"
                icon={<ArrowRight size={20} />}
                className="w-full sm:w-auto"
              >
                Créer mon compte gratuit
              </Button3D>
              <Button3D
                variant="white"
                size="lg"
                href="/connexion"
                className="w-full sm:w-auto"
              >
                J&apos;ai déjà un compte
              </Button3D>
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================
          FOOTER (100% EN FRANÇAIS, AUCUN DÉGRADÉ, LIENS LÉGAUX)
          ================================================================ */}
      <footer className="bg-white py-12 border-t-2 border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b-2 border-[#F1F5F9]">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-[#0B3A5B]">Codingo</span>
              <span className="text-xs font-bold text-[#64748B]">
                Le Duolingo de la programmation
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-[#4A6B82]">
              <Link href="/tarifs" className="hover:text-[#1B9BE0]">
                Abonnement Premium
              </Link>
              <Link href="/cgu" className="hover:text-[#1B9BE0]">
                Conditions Générales
              </Link>
              <Link href="/confidentialite" className="hover:text-[#1B9BE0]">
                Politique de Confidentialité
              </Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#94A3B8]">
            <p>&copy; 2026 Codingo. Tous droits réservés.</p>
            <p>Conçu pour une pédagogie patiente, bienveillante et progressive.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
