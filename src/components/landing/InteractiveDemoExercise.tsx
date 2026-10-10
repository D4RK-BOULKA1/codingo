"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { CodieMascot, CodieMood } from "@/components/mascot/CodieMascot";
import { Button3D } from "@/components/ui/Button3D";
import { HeartDisplay } from "@/components/ui/HeartDisplay";
import { XpBadge } from "@/components/ui/XpBadge";
import { sounds } from "@/lib/audio/soundEffects";
import { Check, X, Sparkles, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ExerciseOption {
  id: string;
  code: string;
  explanation: string;
  isCorrect: boolean;
}

export const InteractiveDemoExercise: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [hearts, setHearts] = useState<number>(5);
  const [xp, setXp] = useState<number>(0);
  const [codieMood, setCodieMood] = useState<CodieMood>("waving");

  const options: ExerciseOption[] = [
    {
      id: "opt-1",
      code: "<h1>Mon premier titre</h1>",
      explanation: "Parfait ! La balise <h1> définit le titre de niveau 1, le plus important d'une page.",
      isCorrect: true,
    },
    {
      id: "opt-2",
      code: "<title>Mon premier titre</title>",
      explanation: "Pas tout à fait : <title> va dans le <head> et donne le titre de l'onglet du navigateur, pas le titre visible dans la page.",
      isCorrect: false,
    },
    {
      id: "opt-3",
      code: "<header>Mon premier titre</header>",
      explanation: "<header> est une balise sémantique qui sert de conteneur d'en-tête, elle n'affiche pas directement un titre.",
      isCorrect: false,
    },
  ];

  const handleSelect = (id: string) => {
    if (status !== "idle") return;
    setSelectedId(id);
    sounds.playClick();
  };

  const handleVerify = () => {
    if (!selectedId || status !== "idle") return;

    const chosen = options.find((o) => o.id === selectedId);
    if (chosen?.isCorrect) {
      setStatus("success");
      setCodieMood("happy");
      setXp((prev) => prev + 10);
      sounds.playSuccess();

      // Tir de confettis
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.65 },
          colors: ["#4CC2FF", "#FFC83D", "#2CD98F", "#1B9BE0"],
        });
      } catch {
        // Ignorer si bloqué par l'environnement
      }
    } else {
      setStatus("error");
      setCodieMood("encouraging");
      setHearts((prev) => Math.max(0, prev - 1));
      sounds.playError();
    }
  };

  const handleReset = () => {
    setSelectedId(null);
    setStatus("idle");
    setCodieMood("waving");
    sounds.playClick();
  };

  const activeOption = options.find((o) => o.id === selectedId);

  return (
    <div className="card-3d-blue p-6 md:p-8 max-w-2xl mx-auto bg-white relative">
      {/* Barre d'état supérieure : Cœurs et XP */}
      <div className="flex items-center justify-between pb-6 border-b-2 border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <HeartDisplay hearts={hearts} maxHearts={5} />
          <XpBadge xp={xp} />
        </div>
        <div className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-[#F1F5F9] rounded-xl text-[#0B3A5B] border border-[#CBD5E1]">
          Leçon Démo 1.1
        </div>
      </div>

      {/* Zone Pédagogique avec Mascotte Codie */}
      <div className="py-6 flex flex-col md:flex-row items-center gap-6">
        <div className="shrink-0">
          <CodieMascot mood={codieMood} size="md" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <span className="text-xs font-extrabold text-[#1B9BE0] uppercase tracking-wider block mb-1">
            Question interactive
          </span>
          <h3 className="text-xl md:text-2xl font-black text-[#0B3A5B] leading-tight">
            Quelle balise permet d&apos;afficher le titre principal visible dans le corps de votre page ?
          </h3>
        </div>
      </div>

      {/* Choix d'options */}
      <div className="space-y-3 pt-2">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          let borderClass = "border-[#CBD5E1]";
          let bgClass = "bg-white hover:bg-[#F8FAFC]";

          if (isSelected) {
            if (status === "success") {
              borderClass = "border-[#189C63] bg-[#F0FDF4]";
            } else if (status === "error") {
              borderClass = "border-[#D63030] bg-[#FEF2F2]";
            } else {
              borderClass = "border-[#1B9BE0] bg-[#F0F9FF]";
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={status !== "idle"}
              className={`w-full p-4 rounded-2xl border-2 text-left font-mono font-bold text-base transition-all flex items-center justify-between select-none ${borderClass} ${bgClass} active:scale-[0.99]`}
            >
              <span className="text-[#0B3A5B]">{option.code}</span>
              <div
                className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center shrink-0 ${
                  isSelected
                    ? status === "success"
                      ? "bg-[#2CD98F] border-[#189C63] text-white"
                      : status === "error"
                      ? "bg-[#FF5353] border-[#D63030] text-white"
                      : "bg-[#4CC2FF] border-[#1B9BE0] text-[#0B3A5B]"
                    : "border-[#CBD5E1] bg-white"
                }`}
              >
                {isSelected && status === "success" && <Check size={16} className="stroke-[3]" />}
                {isSelected && status === "error" && <X size={16} className="stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Zone d'explication pédagogique après réponse */}
      {status !== "idle" && activeOption && (
        <div
          className={`mt-6 p-4 rounded-2xl border-2 animate-fadeIn ${
            status === "success"
              ? "bg-[#F0FDF4] border-[#189C63] text-[#0B3A5B]"
              : "bg-[#FEF2F2] border-[#D63030] text-[#0B3A5B]"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              {status === "success" ? (
                <div className="w-6 h-6 rounded-lg bg-[#2CD98F] text-white flex items-center justify-center">
                  <Check size={16} className="stroke-[3]" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-lg bg-[#FF5353] text-white flex items-center justify-center">
                  <X size={16} className="stroke-[3]" />
                </div>
              )}
            </div>
            <div>
              <p className="font-extrabold text-sm mb-1">
                {status === "success" ? "Excellente réponse !" : "Pas de panique, Codie est là :"}
              </p>
              <p className="text-sm font-semibold">{activeOption.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Barre d'action */}
      <div className="mt-8 pt-4 border-t-2 border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
        {status === "idle" ? (
          <Button3D
            variant={selectedId ? "blue" : "disabled"}
            size="lg"
            fullWidth
            onClick={handleVerify}
            disabled={!selectedId}
          >
            Vérifier ma réponse
          </Button3D>
        ) : status === "success" ? (
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <Button3D
              variant="white"
              size="md"
              icon={<RefreshCw size={16} />}
              onClick={handleReset}
            >
              Réessayer
            </Button3D>
            <Button3D
              variant="yellow"
              size="md"
              fullWidth
              href="/inscription"
              icon={<Sparkles size={18} />}
            >
              Continuer le parcours complet
            </Button3D>
          </div>
        ) : (
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <Button3D
              variant="blue"
              size="md"
              fullWidth
              icon={<RefreshCw size={16} />}
              onClick={handleReset}
            >
              Compris, je réessaie !
            </Button3D>
          </div>
        )}
      </div>
    </div>
  );
};
