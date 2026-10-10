"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAllCourses } from "@/lib/courses";
import { Loader2, Zap, Flame, Trophy } from "lucide-react";

export default function ApprendrePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const courses = getAllCourses();

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/connexion");
      return;
    }
    if (!isLoading && user && !user.onboardingCompleted) {
      router.push("/onboarding");
    }
    if (user) {
      try {
        const stored = JSON.parse(
          localStorage.getItem(`codingo_completed_${user.uid}`) || "[]"
        );
        setCompletedLessons(stored);
      } catch {}
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
          <p className="text-sm text-[#4A7FA5]">Chargement de ta progression...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E2EEF7] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0B3A5B] flex items-center justify-center">
              <span className="text-[#4CC2FF] font-black text-sm">&lt;/&gt;</span>
            </div>
            <span className="text-lg font-black text-[#0B3A5B] tracking-tight">Codingo</span>
          </div>

          {/* Stats rapides */}
          <div className="flex items-center gap-4">
            {/* Série */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFC83D]" aria-hidden />
              <span className="font-bold text-[#0B3A5B] text-sm">{user.streakDays}j</span>
            </div>
            {/* Cœurs */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < user.hearts ? "text-red-500" : "text-[#E2EEF7]"}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ))}
            </div>
            {/* XP */}
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFC83D]" />
              <span className="font-bold text-[#0B3A5B] text-sm">{user.totalXp} XP</span>
            </div>
            {/* Profil */}
            <button
              id="btn-profil"
              onClick={() => router.push("/profil")}
              className="w-8 h-8 rounded-full bg-[#0B3A5B] flex items-center justify-center text-white text-xs font-bold hover:bg-[#4CC2FF] hover:text-[#0B3A5B] transition-colors"
            >
              {user.username.charAt(0).toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0B3A5B]">
              Bonjour, {user.displayName || user.username} !
            </h1>
            <p className="text-[#4A7FA5] mt-1 flex items-center gap-2">
              <Flame className={`w-4 h-4 ${user.streakDays > 0 ? "text-[#FFC83D]" : "text-[#94B8D0]"}`} />
              {user.streakDays > 0
                ? `Série de ${user.streakDays} jours. Continue comme ça !`
                : "Commence ta première leçon pour lancer ta série !"}
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="bg-white px-4 py-2 rounded-2xl border-2 border-[#E2EEF7] flex items-center gap-2 shadow-sm">
              <Zap className="w-4 h-4 text-[#FFC83D]" />
              <span className="text-sm font-black text-[#0B3A5B]">{user.totalXp} XP</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl border-2 border-[#E2EEF7] flex items-center gap-2 shadow-sm">
              <Trophy className="w-4 h-4 text-[#1B9BE0]" />
              <span className="text-sm font-black text-[#0B3A5B] uppercase">{user.leagueId}</span>
            </div>
          </div>
        </div>

        {/* Chemins d'apprentissage */}
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => {
            const isAvailable = course.status === "available";
            const color = course.id === "html" ? "#FF6B35" : course.id === "css" ? "#1B9BE0" : "#94A3B8";
            
            return (
              <div 
                key={course.id} 
                className={`bg-white rounded-3xl shadow-[0_4px_0_0_#CBD5E1] border-2 border-[#E2EEF7] p-6 flex flex-col relative transition-all ${!isAvailable ? "opacity-70 grayscale" : "hover:translate-y-[-2px] hover:shadow-[0_6px_0_0_#CBD5E1]"}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-[0_4px_0_0_rgba(0,0,0,0.1)]"
                    style={{ backgroundColor: color }}
                  >
                    {course.iconSvg}
                  </div>
                  <div>
                    <h2 className="font-black text-[#0B3A5B] text-xl leading-none mb-1">{course.title}</h2>
                    <p className="text-sm text-[#4A7FA5] font-medium">{course.description}</p>
                  </div>
                </div>

                {isAvailable ? (
                  <div className="mt-auto space-y-6">
                    {(() => {
                      const allCourseLessons: string[] = [];
                      course.units.forEach((u) =>
                        u.chapters.forEach((ch) =>
                          ch.lessons.forEach((l) => allCourseLessons.push(l.id))
                        )
                      );
                      const completedCount = allCourseLessons.filter((id) =>
                        completedLessons.includes(id)
                      ).length;
                      const pct =
                        allCourseLessons.length > 0
                          ? Math.round(
                              (completedCount / allCourseLessons.length) * 100
                            )
                          : 0;

                      return (
                        <div>
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#4A7FA5] mb-2">
                            <span>Progression</span>
                            <span>{completedCount} / {allCourseLessons.length} ({pct}%)</span>
                          </div>
                          <div className="h-3 bg-[#E2EEF7] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1000"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      );
                    })()}

                    <button
                      onClick={() => router.push(`/apprendre/${course.id}`)}
                      className="w-full py-3.5 rounded-2xl text-white font-black text-sm transition-all active:translate-y-1 active:shadow-none"
                      style={{ 
                        backgroundColor: color,
                        boxShadow: `0 4px 0 0 ${color}CC`
                      }}
                    >
                      CONTINUER LE PARCOURS
                    </button>
                  </div>
                ) : (
                  <div className="mt-auto pt-8">
                    <span className="inline-flex px-4 py-1.5 rounded-full bg-[#F1F5F9] text-[#64748B] text-[10px] font-black uppercase tracking-widest border-2 border-[#E2E8F0]">
                      Bientôt disponible
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Lien admin */}
        {user.role === "admin" && (
          <div className="mt-12 p-6 bg-[#0B3A5B] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="text-center sm:text-left">
              <p className="text-white font-black text-lg">Panneau d&apos;administration</p>
              <p className="text-[#4CC2FF] text-sm font-medium">Gère les utilisateurs, le contenu et les paramètres.</p>
            </div>
            <button
              onClick={() => router.push("/panel-codingo")}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#4CC2FF] text-[#0B3A5B] font-black text-sm hover:bg-white transition-all shadow-[0_4px_0_0_#1B9BE0] active:translate-y-1 active:shadow-none"
            >
              OUVRIR LE PANEL
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
