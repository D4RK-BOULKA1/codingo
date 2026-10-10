"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Loader2, Crown, Sparkles, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { sounds } from "@/lib/audio/soundEffects";

export default function ParametresPage() {
  const { user, isLoading, updateProfileData, logout } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push("/connexion");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "true") {
        setPaymentSuccess(true);
        sounds.playLevelUp();
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#4CC2FF", "#FFC83D", "#2CD98F"],
        });
      }
    }
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
      </div>
    );
  }

  async function toggle(
    key: "soundEffects" | "notificationsEnabled",
    value: boolean
  ) {
    setSaving(true);
    try {
      sounds.setEnabled(key === "soundEffects" ? value : user!.settings.soundEffects);
      await updateProfileData({
        settings: { ...user!.settings, [key]: value },
      });
    } finally {
      setSaving(false);
    }
  }

  async function setGoal(minutes: number) {
    setSaving(true);
    try {
      await updateProfileData({
        settings: { ...user!.settings, dailyGoalMinutes: minutes },
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      <header className="bg-white border-b-2 border-[#E2E8F0]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.push("/profil")}
            className="p-2 rounded-xl hover:bg-[#F0F9FF]"
          >
            <ArrowLeft className="w-5 h-5 text-[#0B3A5B]" />
          </button>
          <h1 className="text-lg font-black text-[#0B3A5B]">Paramètres</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {paymentSuccess && (
          <div className="p-6 rounded-3xl bg-[#FFFBEB] border-2 border-[#FFC83D] shadow-[0_4px_0_0_#E0A81B] flex items-center gap-4 text-[#0B3A5B]">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC83D] flex items-center justify-center shrink-0 shadow-sm text-white">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-base flex items-center gap-1.5 text-[#D97706]">
                <Sparkles className="w-4 h-4" /> Félicitations !
              </p>
              <p className="text-sm font-bold text-[#4A7FA5] mt-0.5">
                Ton abonnement Premium 1 mois SaaSpay est bien pris en compte ! Cœurs illimités activés.
              </p>
            </div>
          </div>
        )}

        <section className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-5 space-y-4">
          <h2 className="font-bold text-[#0B3A5B]">Préférences</h2>

          <label className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-[#0B3A5B]">
              Effets sonores
            </span>
            <input
              type="checkbox"
              checked={user.settings.soundEffects}
              disabled={saving}
              onChange={(e) => toggle("soundEffects", e.target.checked)}
              className="w-5 h-5 accent-[#4CC2FF]"
            />
          </label>

          <label className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-[#0B3A5B]">
              Notifications
            </span>
            <input
              type="checkbox"
              checked={user.settings.notificationsEnabled}
              disabled={saving}
              onChange={(e) => toggle("notificationsEnabled", e.target.checked)}
              className="w-5 h-5 accent-[#4CC2FF]"
            />
          </label>

          <div>
            <p className="text-sm font-semibold text-[#0B3A5B] mb-2">
              Objectif quotidien
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((m) => (
                <button
                  key={m}
                  type="button"
                  disabled={saving}
                  onClick={() => setGoal(m)}
                  className={`py-2 rounded-xl border-2 text-sm font-bold ${
                    user.settings.dailyGoalMinutes === m
                      ? "border-[#E0A81B] bg-[#FFF8E6] text-[#0B3A5B]"
                      : "border-[#E2E8F0] text-[#0B3A5B]"
                  }`}
                >
                  {m} min
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#0B3A5B]">
              Langue de l&apos;interface
            </span>
            <span className="text-sm font-bold text-[#4A7FA5]">Français</span>
          </div>
        </section>

        <section className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-5 space-y-3">
          <h2 className="font-bold text-[#0B3A5B]">Abonnement</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#4A7FA5]">
              Plan actuel :{" "}
              <strong className="text-[#0B3A5B]">
                {user.isPremium ? "Premium (1 mois actif)" : "Gratuit"}
              </strong>
            </p>
            {user.isPremium && (
              <span className="px-2.5 py-1 rounded-full bg-[#2CD98F]/20 text-[#2CD98F] text-xs font-black uppercase flex items-center gap-1 border border-[#2CD98F]/40">
                <Check className="w-3.5 h-3.5" /> Actif
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => router.push("/tarifs")}
            className="w-full py-3 rounded-xl bg-[#FFC83D] text-[#0B3A5B] font-bold text-sm border-2 border-[#E0A81B] shadow-[0_4px_0_0_#E0A81B]"
          >
            {user.isPremium ? "Gérer mon abonnement" : "Passer Premium (SaaSpay)"}
          </button>
        </section>

        <section className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-5 space-y-3">
          <h2 className="font-bold text-[#0B3A5B]">Zone sensible</h2>
          <p className="text-sm text-[#4A7FA5]">
            Tu peux te déconnecter de ton compte sur cet appareil.
          </p>
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            className="w-full py-3 rounded-xl border-2 border-[#FF5353] text-[#D63030] font-semibold text-sm hover:bg-red-50 transition-colors"
          >
            Se déconnecter
          </button>
        </section>
      </main>
    </div>
  );
}
