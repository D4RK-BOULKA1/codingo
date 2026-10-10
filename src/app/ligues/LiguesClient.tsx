"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { UserProfile } from "@/types/user";
import { Trophy, ArrowLeft, Loader2, Award, Zap } from "lucide-react";

const LEAGUES = [
  { id: "bronze", name: "Bronze", color: "#CD7F32", minXp: 0 },
  { id: "argent", name: "Argent", color: "#C0C0C0", minXp: 500 },
  { id: "or", name: "Or", color: "#E0A81B", minXp: 1000 },
  { id: "saphir", name: "Saphir", color: "#1B9BE0", minXp: 1500 },
  { id: "rubis", name: "Rubis", color: "#D63030", minXp: 2000 },
  { id: "emeraude", name: "Émeraude", color: "#189C63", minXp: 2500 },
  { id: "amethyste", name: "Améthyste", color: "#7C3AED", minXp: 3000 },
  { id: "perle", name: "Perle", color: "#94A3B8", minXp: 3500 },
  { id: "obsidienne", name: "Obsidienne", color: "#0B3A5B", minXp: 4000 },
  { id: "diamant", name: "Diamant", color: "#4CC2FF", minXp: 5000 },
];

export default function LiguesClient() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/connexion");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const q = query(collection(db, "users"), orderBy("totalXp", "desc"), limit(20));
        const snap = await getDocs(q);
        const users = snap.docs.map((doc) => doc.data() as UserProfile);
        setLeaderboard(users);
      } catch (err) {
        console.error("Erreur chargement classement:", err);
      } finally {
        setLoadingBoard(false);
      }
    }
    fetchLeaderboard();
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
      </div>
    );
  }

  const currentLeague = LEAGUES.find((l) => l.id === user.leagueId) || LEAGUES[0];

  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      <header className="bg-white border-b-2 border-[#E2E8F0] sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.push("/apprendre")}
            className="p-2 rounded-xl hover:bg-[#F0F9FF] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0B3A5B]" />
          </button>
          <h1 className="text-lg font-black text-[#0B3A5B]">Classement des Ligues</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* En-tête de ligue */}
        <div 
          className="bg-white rounded-3xl border-2 border-[#E2E8F0] p-6 text-center relative overflow-hidden shadow-[0_4px_0_0_#CBD5E1]"
          style={{ borderColor: currentLeague.color }}
        >
          <div 
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-md"
            style={{ backgroundColor: currentLeague.color }}
          >
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#0B3A5B]">
            Ligue {currentLeague.name}
          </h2>
          <p className="text-sm text-[#4A7FA5] mt-1 font-bold">
            Atteins 500 XP dans ta ligue pour passer à la ligue supérieure !
          </p>
        </div>

        {/* Classement */}
        <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] p-6 shadow-[0_4px_0_0_#CBD5E1]">
          <h3 className="font-black text-[#0B3A5B] mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#E0A81B]" />
            Top Joueurs Codingo
          </h3>

          {loadingBoard ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#4CC2FF]" />
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((player, index) => {
                const isMe = player.uid === user.uid;
                return (
                  <div
                    key={player.uid}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      isMe 
                        ? "border-[#4CC2FF] bg-[#F0F9FF]" 
                        : "border-[#E2EEF7] bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 text-center font-black text-sm ${index === 0 ? "text-[#E0A81B] text-lg" : index === 1 ? "text-slate-400 text-lg" : index === 2 ? "text-amber-600 text-lg" : "text-[#4A7FA5]"}`}>
                        #{index + 1}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#0B3A5B] text-white font-bold flex items-center justify-center">
                        {player.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-[#0B3A5B] flex items-center gap-2">
                          {player.displayName || player.username}
                          {isMe && <span className="text-[10px] bg-[#1B9BE0] text-white px-2 py-0.5 rounded-full">Moi</span>}
                        </p>
                        <p className="text-xs text-[#4A7FA5]">@{player.username}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 font-black text-[#0B3A5B]">
                      <Zap className="w-4 h-4 text-[#FFC83D]" />
                      {player.totalXp} XP
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
