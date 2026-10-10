"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import {
  Loader2,
  ArrowLeft,
  Star,
  Flame,
  Gem,
  Heart,
  LogOut,
  Trophy,
  Shield,
  Save,
} from "lucide-react";

export default function ProfilPage() {
  const { user, logout, isLoading, updateProfileData } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/connexion");
    }
    if (!isLoading && user && !user.onboardingCompleted) {
      router.push("/onboarding");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName || "");
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setUsername(user.username || "");
    setBio(user.bio || "");
  }, [user]);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await updateProfileData({
        displayName: displayName.trim() || username,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim().toLowerCase(),
        bio: bio.trim().slice(0, 160),
      });
      setMessage("Profil enregistré.");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      if (code === "auth/username-taken") {
        setError("Ce pseudo est déjà pris.");
      } else if (code === "auth/invalid-username") {
        setError("Pseudo invalide (3-20 caractères, a-z, 0-9, _).");
      } else {
        setError("Impossible d'enregistrer le profil.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
      </div>
    );
  }

  const leagueColors: Record<string, string> = {
    bronze: "#CD7F32",
    argent: "#C0C0C0",
    or: "#E0A81B",
    saphir: "#1B9BE0",
    rubis: "#D63030",
    emeraude: "#189C63",
    amethyste: "#7C3AED",
    perle: "#94A3B8",
    obsidienne: "#0B3A5B",
    diamant: "#4CC2FF",
  };
  const leagueColor = leagueColors[user.leagueId] || "#CD7F32";

  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      <header className="bg-white border-b-2 border-[#E2E8F0]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.push("/apprendre")}
            id="btn-back-profil"
            className="p-2 rounded-xl hover:bg-[#F0F9FF] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0B3A5B]" />
          </button>
          <h1 className="text-lg font-black text-[#0B3A5B]">Mon Profil</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-[0_4px_0_0_#CBD5E1] border-2 border-[#E2E8F0] p-6">
          <div className="flex items-start gap-4">
            <AvatarUpload
              uid={user.uid}
              currentUrl={user.avatarUrl}
              username={user.username}
              onUploaded={async (url) => {
                await updateProfileData({ avatarUrl: url });
              }}
            />

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black text-[#0B3A5B] truncate flex items-center gap-2 flex-wrap">
                {user.displayName || user.username}
                {user.role === "admin" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#0B3A5B] text-white text-[10px] font-black tracking-wide">
                    <Shield className="w-3 h-3" />
                    ADMIN
                  </span>
                )}
                {user.isPremium && user.role !== "admin" && (
                  <span className="inline-flex px-2 py-0.5 rounded-lg bg-[#FFC83D] text-[#0B3A5B] text-[10px] font-black tracking-wide border-2 border-[#E0A81B]">
                    DIAMANT
                  </span>
                )}
              </h2>
              <p className="text-sm text-[#4A7FA5]">@{user.username}</p>
              <div
                className="inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-lg text-xs font-bold"
                style={{
                  backgroundColor: `${leagueColor}20`,
                  color: leagueColor,
                }}
              >
                <Trophy className="w-3 h-3" />
                Ligue{" "}
                {user.leagueId.charAt(0).toUpperCase() + user.leagueId.slice(1)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: <Star className="w-5 h-5 text-[#E0A81B]" />,
              label: "XP Total",
              value: user.totalXp.toLocaleString(),
            },
            {
              icon: <Flame className="w-5 h-5 text-[#FF5353]" />,
              label: "Série",
              value: `${user.streakDays} jours`,
            },
            {
              icon: <Gem className="w-5 h-5 text-[#1B9BE0]" />,
              label: "Gemmes",
              value: user.gems.toLocaleString(),
            },
            {
              icon: <Heart className="w-5 h-5 text-[#FF5353]" />,
              label: "Coeurs",
              value: user.isPremium ? "Illimités" : `${user.hearts} / 5`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] flex items-center justify-center">
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-[#4A7FA5]">{stat.label}</p>
                <p className="font-black text-[#0B3A5B]">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-6 space-y-4"
        >
          <h3 className="font-bold text-[#0B3A5B]">Modifier mon profil</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-[#0B3A5B]" htmlFor="firstName">
                Prénom
              </label>
              <input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 border-2 border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#4CC2FF]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#0B3A5B]" htmlFor="lastName">
                Nom
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 border-2 border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#4CC2FF]"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-[#0B3A5B]" htmlFor="displayName">
              Nom affiché
            </label>
            <input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 border-2 border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#4CC2FF]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#0B3A5B]" htmlFor="username">
              Pseudo
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
              }
              minLength={3}
              maxLength={20}
              className="mt-1 w-full px-3 py-2.5 border-2 border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#4CC2FF]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#0B3A5B]" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 160))}
              rows={3}
              className="mt-1 w-full px-3 py-2.5 border-2 border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#4CC2FF] resize-none"
              placeholder="Une courte présentation..."
            />
            <p className="text-xs text-[#94B8D0] mt-1">{bio.length}/160</p>
          </div>

          {message && (
            <p className="text-sm font-semibold text-[#189C63]">{message}</p>
          )}
          {error && (
            <p className="text-sm font-semibold text-[#D63030]">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#4CC2FF] text-[#0B3A5B] font-bold text-sm border-2 border-[#1B9BE0] shadow-[0_4px_0_0_#1B9BE0] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#1B9BE0] active:shadow-none active:translate-y-1 transition-all disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer
          </button>
        </form>

        <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-6">
          <h3 className="font-bold text-[#0B3A5B] mb-4">Compte</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#4A7FA5]">Email</span>
              <span className="text-[#0B3A5B] font-medium break-all text-right">
                {user.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4A7FA5]">Membre depuis</span>
              <span className="text-[#0B3A5B] font-medium">
                {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4A7FA5]">Abonnement</span>
              <span
                className={`font-bold ${user.isPremium ? "text-[#E0A81B]" : "text-[#4A7FA5]"}`}
              >
                {user.isPremium ? "Premium" : "Gratuit"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4A7FA5]">Langages suivis</span>
              <span className="text-[#0B3A5B] font-medium">
                {user.selectedLanguages.length > 0
                  ? user.selectedLanguages.join(", ").toUpperCase()
                  : "Aucun"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/parametres")}
            className="w-full py-3 rounded-xl border-2 border-[#E2E8F0] text-[#0B3A5B] font-semibold text-sm hover:bg-white transition-colors"
          >
            Paramètres
          </button>
          <button
            onClick={handleLogout}
            id="btn-logout"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#FF5353] text-[#D63030] font-semibold text-sm hover:bg-[#FFF0F0] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </main>
    </div>
  );
}
