"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CodieMascot } from "@/components/mascot/CodieMascot";
import { Button3D } from "@/components/ui/Button3D";
import { StartingLevel } from "@/types/user";
import {
  Bell,
  BookOpen,
  Check,
  Clock,
  Loader2,
  Sparkles,
} from "lucide-react";

const LANGUAGES = [
  {
    id: "html",
    title: "HTML",
    description: "Structure des pages web",
    available: true,
  },
  {
    id: "css",
    title: "CSS",
    description: "Mise en forme et design",
    available: true,
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "Bientôt disponible",
    available: false,
  },
  {
    id: "python",
    title: "Python",
    description: "Bientôt disponible",
    available: false,
  },
];

const GOALS = [5, 10, 15, 20];

export default function OnboardingPage() {
  const { user, isLoading, completeOnboarding } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["html"]);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(10);
  const [startingLevel, setStartingLevel] = useState<StartingLevel>("beginner");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/connexion");
    }
    if (!isLoading && user?.onboardingCompleted) {
      router.replace("/apprendre");
    }
  }, [user, isLoading, router]);

  function toggleLanguage(id: string, available: boolean) {
    if (!available) return;
    setSelectedLanguages((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  }

  async function requestNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationsEnabled(false);
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === "granted");
  }

  async function finish() {
    setSaving(true);
    setError(null);
    try {
      await completeOnboarding({
        selectedLanguages,
        dailyGoalMinutes,
        startingLevel,
        notificationsEnabled,
      });
      router.replace("/apprendre");
    } catch {
      setError("Impossible d'enregistrer ton onboarding. Réessaie.");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
      </div>
    );
  }

  const steps = [
    {
      title: "Choisis tes langages",
      subtitle: "Tu pourras en ajouter d'autres plus tard.",
    },
    {
      title: "Ton objectif quotidien",
      subtitle: "Un rythme régulier bat un sprint unique.",
    },
    {
      title: "Ton niveau de départ",
      subtitle: "On adapte le parcours à ton rythme.",
    },
    {
      title: "Les rappels utiles",
      subtitle: "Séries, cœurs rechargés, messages importants.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F9FF] px-4 py-8">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#1B9BE0]">
              Étape {step + 1} / {steps.length}
            </p>
            <h1 className="text-2xl font-black text-[#0B3A5B]">
              {steps[step].title}
            </h1>
            <p className="text-sm text-[#4A7FA5] mt-1">{steps[step].subtitle}</p>
          </div>
          <CodieMascot mood="happy" size="sm" />
        </div>

        <div className="h-2 bg-[#E2E8F0] rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-[#4CC2FF] rounded-full transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] shadow-[0_4px_0_0_#CBD5E1] p-6 space-y-4">
          {step === 0 && (
            <div className="grid gap-3">
              {LANGUAGES.map((lang) => {
                const selected = selectedLanguages.includes(lang.id);
                return (
                  <button
                    key={lang.id}
                    type="button"
                    disabled={!lang.available}
                    onClick={() => toggleLanguage(lang.id, lang.available)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-colors ${
                      !lang.available
                        ? "opacity-50 border-[#E2E8F0] bg-[#F8FAFC]"
                        : selected
                          ? "border-[#1B9BE0] bg-[#F0F9FF]"
                          : "border-[#E2E8F0] hover:border-[#4CC2FF]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0B3A5B] text-white flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-[#0B3A5B]">{lang.title}</p>
                        <p className="text-xs text-[#4A7FA5]">
                          {lang.description}
                        </p>
                      </div>
                    </div>
                    {selected && lang.available && (
                      <Check className="w-5 h-5 text-[#1B9BE0]" />
                    )}
                    {!lang.available && (
                      <span className="text-xs font-bold text-[#64748B]">
                        Bientôt
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => setDailyGoalMinutes(minutes)}
                  className={`p-4 rounded-2xl border-2 font-bold transition-colors ${
                    dailyGoalMinutes === minutes
                      ? "border-[#E0A81B] bg-[#FFF8E6] text-[#0B3A5B]"
                      : "border-[#E2E8F0] text-[#0B3A5B] hover:border-[#FFC83D]"
                  }`}
                >
                  <Clock className="w-5 h-5 mb-2 text-[#E0A81B]" />
                  {minutes} min / jour
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setStartingLevel("beginner")}
                className={`w-full p-4 rounded-2xl border-2 text-left ${
                  startingLevel === "beginner"
                    ? "border-[#1B9BE0] bg-[#F0F9FF]"
                    : "border-[#E2E8F0]"
                }`}
              >
                <p className="font-bold text-[#0B3A5B]">Débutant total</p>
                <p className="text-sm text-[#4A7FA5]">
                  On commence depuis la toute première leçon HTML.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setStartingLevel("placement")}
                className={`w-full p-4 rounded-2xl border-2 text-left ${
                  startingLevel === "placement"
                    ? "border-[#1B9BE0] bg-[#F0F9FF]"
                    : "border-[#E2E8F0]"
                }`}
              >
                <p className="font-bold text-[#0B3A5B] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E0A81B]" />
                  Test de placement court
                </p>
                <p className="text-sm text-[#4A7FA5]">
                  Un quiz rapide arrivera en phase 3 pour ajuster ton point de
                  départ. Pour l&apos;instant, tu démarres aussi sur l&apos;unité
                  1.
                </p>
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border-2 border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-[#1B9BE0] mt-0.5" />
                  <div>
                    <p className="font-bold text-[#0B3A5B]">
                      Pourquoi activer les notifications ?
                    </p>
                    <ul className="mt-2 text-sm text-[#4A7FA5] space-y-1 list-disc list-inside">
                      <li>Rappel de série quotidienne</li>
                      <li>Alerte quand tes cœurs sont rechargés</li>
                      <li>Messages importants de l&apos;équipe</li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button3D
                variant={notificationsEnabled ? "green" : "blue"}
                fullWidth
                onClick={requestNotifications}
                type="button"
              >
                {notificationsEnabled
                  ? "Notifications activées"
                  : "Activer les notifications"}
              </Button3D>
              <button
                type="button"
                onClick={() => setNotificationsEnabled(false)}
                className="w-full text-sm font-semibold text-[#64748B] hover:underline"
              >
                Continuer sans notifications
              </button>
            </div>
          )}

          {error && (
            <p className="text-sm text-[#D63030] font-semibold">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <Button3D
                variant="white"
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex-1"
              >
                Retour
              </Button3D>
            )}
            {step < steps.length - 1 ? (
              <Button3D
                variant="blue"
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="flex-1"
              >
                Continuer
              </Button3D>
            ) : (
              <Button3D
                variant="yellow"
                type="button"
                onClick={finish}
                disabled={saving}
                className="flex-1"
              >
                {saving ? "Enregistrement..." : "Lancer Codingo"}
              </Button3D>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
