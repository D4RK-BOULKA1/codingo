"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/user";
import {
  ArrowLeft,
  Flame,
  Loader2,
  Shield,
  Star,
  Trophy,
} from "lucide-react";

interface PublicProfilClientProps {
  username: string;
}

export default function PublicProfilClient({ username }: PublicProfilClientProps) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/connexion");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !username) return;

    async function load() {
      setLoading(true);
      setNotFound(false);
      try {
        const q = query(
          collection(db, "users"),
          where("username", "==", username.toLowerCase()),
          limit(1)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
          setNotFound(true);
          setProfile(null);
        } else {
          setProfile(snap.docs[0].data() as UserProfile);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, username]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      <header className="bg-white border-b-2 border-[#E2E8F0]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-[#F0F9FF]"
          >
            <ArrowLeft className="w-5 h-5 text-[#0B3A5B]" />
          </button>
          <h1 className="text-lg font-black text-[#0B3A5B]">Profil public</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {notFound || !profile ? (
          <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-8 text-center">
            <p className="font-bold text-[#0B3A5B]">Joueur introuvable</p>
            <p className="text-sm text-[#4A7FA5] mt-1">
              Aucun profil ne correspond à @{username}.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] shadow-[0_4px_0_0_#CBD5E1] p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#0B3A5B] text-white flex items-center justify-center text-3xl font-black">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.username.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h2 className="text-xl font-black text-[#0B3A5B] flex items-center gap-2 flex-wrap">
                  {profile.displayName || profile.username}
                  {profile.role === "admin" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#0B3A5B] text-white text-[10px] font-black">
                      <Shield className="w-3 h-3" />
                      ADMIN
                    </span>
                  )}
                  {profile.isPremium && profile.role !== "admin" && (
                    <span className="inline-flex px-2 py-0.5 rounded-lg bg-[#FFC83D] text-[#0B3A5B] text-[10px] font-black border-2 border-[#E0A81B]">
                      DIAMANT
                    </span>
                  )}
                </h2>
                <p className="text-sm text-[#4A7FA5]">@{profile.username}</p>
              </div>
            </div>

            {profile.bio && (
              <p className="text-sm text-[#4A7FA5]">{profile.bio}</p>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border-2 border-[#E2E8F0] p-3 text-center">
                <Star className="w-4 h-4 text-[#E0A81B] mx-auto mb-1" />
                <p className="text-xs text-[#4A7FA5]">XP</p>
                <p className="font-black text-[#0B3A5B]">{profile.totalXp}</p>
              </div>
              <div className="rounded-2xl border-2 border-[#E2E8F0] p-3 text-center">
                <Flame className="w-4 h-4 text-[#FF5353] mx-auto mb-1" />
                <p className="text-xs text-[#4A7FA5]">Série</p>
                <p className="font-black text-[#0B3A5B]">
                  {profile.streakDays} j
                </p>
              </div>
              <div className="rounded-2xl border-2 border-[#E2E8F0] p-3 text-center">
                <Trophy className="w-4 h-4 text-[#1B9BE0] mx-auto mb-1" />
                <p className="text-xs text-[#4A7FA5]">Ligue</p>
                <p className="font-black text-[#0B3A5B] capitalize">
                  {profile.leagueId}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
