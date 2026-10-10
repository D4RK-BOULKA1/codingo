"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAllCourses } from "@/lib/courses";
import {
  Loader2,
  Users,
  BarChart2,
  LogOut,
  Shield,
  CreditCard,
  BookOpen,
  Sparkles,
  Heart,
  Crown,
  CheckCircle2,
  Search,
  ExternalLink,
  Copy,
  Check,
  Send,
  AlertCircle,
  KeyRound,
  RefreshCw,
} from "lucide-react";

interface UserRow {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  role: string;
  isPremium: boolean;
  premiumExpiresAt?: number | null;
  totalXp: number;
  streakDays: number;
  hearts: number;
  gems: number;
  createdAt: number;
  lastActiveAt: number;
}

export default function PanelCodingoPage() {
  const { user, firebaseUser, login, logout, isLoading } = useAuth();
  const router = useRouter();

  // Navigation & state
  const [activeTab, setActiveTab] = useState<"users" | "stats" | "payments" | "courses">("users");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Formulaire de connexion admin dédié
  const [adminUsernameInput, setAdminUsernameInput] = useState("boulka-admin");
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupMessage, setSetupMessage] = useState<string | null>(null);

  // Simulateur de webhook
  const [simTargetEmail, setSimTargetEmail] = useState("");
  const [simEventType, setSimEventType] = useState("subscription.active");
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const courses = getAllCourses();

  useEffect(() => {
    if (user?.role === "admin" && firebaseUser) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, firebaseUser]);

  async function fetchUsers() {
    setLoadingUsers(true);
    setError(null);
    try {
      const headers: HeadersInit = {};
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        headers.Authorization = `Bearer ${idToken}`;
      }
      const res = await fetch("/api/admin/users?limit=100", { headers });
      if (!res.ok) throw new Error("Erreur de chargement des utilisateurs");
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setError("Impossible de charger les utilisateurs. Vérifiez la configuration Firebase Admin.");
    } finally {
      setLoadingUsers(false);
    }
  }

  // Connexion directe admin depuis le panel
  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      await login(adminUsernameInput, adminPasswordInput);
    } catch (err: unknown) {
      setLoginError((err as Error).message || "Identifiants invalides");
    } finally {
      setLoginLoading(false);
    }
  }

  // Initialisation rapide du compte admin
  async function handleRunSetup() {
    setSetupLoading(true);
    setSetupMessage(null);
    try {
      const res = await fetch("/api/admin/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de l'initialisation");
      setSetupMessage("✅ Compte boulka-admin initialisé avec succès !");
    } catch (err: unknown) {
      setSetupMessage(`❌ ${(err as Error).message}`);
    } finally {
      setSetupLoading(false);
    }
  }

  // Action sur un utilisateur
  async function handleUserAction(targetUid: string, updates: Record<string, any>) {
    setActionLoading(targetUid);
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        headers.Authorization = `Bearer ${idToken}`;
      }
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ targetUid, updates }),
      });
      if (!res.ok) throw new Error("Échec de la mise à jour");
      await fetchUsers();
    } catch (err) {
      alert("Erreur lors de la mise à jour : " + (err as Error).message);
    } finally {
      setActionLoading(null);
    }
  }

  // Test du simulateur de webhook SaaSpay
  async function handleSimulateWebhook(e: React.FormEvent) {
    e.preventDefault();
    setSimLoading(true);
    setSimResult(null);
    try {
      const payload = {
        event: simEventType,
        data: {
          customer_email: simTargetEmail,
          userId: users.find((u) => u.email === simTargetEmail)?.uid || undefined,
          amount: 2500,
          currency: "EUR",
          expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
        },
      };

      const res = await fetch("/api/webhooks/saaspay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setSimResult(data);
      if (res.ok) {
        await fetchUsers();
      }
    } catch (err: unknown) {
      setSimResult({ error: (err as Error).message });
    } finally {
      setSimLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/connexion");
  }

  // --- ÉCRAN 1 : Visiteur non connecté ou non admin ---
  if (!isLoading && (!user || user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-[#07131F] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0B3A5B] border-2 border-[#1A4F7A] rounded-3xl p-8 shadow-2xl text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#4CC2FF] flex items-center justify-center text-[#0B3A5B]">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-black">Codingo Admin</h1>
              <p className="text-[#4CC2FF] text-xs font-bold uppercase tracking-wider">
                Panneau d&apos;Administration Sécurisé
              </p>
            </div>
          </div>

          {user && user.role !== "admin" && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs font-semibold">
              Compte connecté : <strong>{user.username}</strong> (Rôle: {user.role}). Seul le compte administrateur <strong>boulka-admin</strong> a accès à ce panneau.
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#94B8D0] mb-1.5">
                Identifiant Administrateur
              </label>
              <input
                type="text"
                value={adminUsernameInput}
                onChange={(e) => setAdminUsernameInput(e.target.value)}
                placeholder="boulka-admin ou email"
                className="w-full px-4 py-3 rounded-xl bg-[#071E30] border border-[#1A4F7A] text-white font-bold text-sm focus:border-[#4CC2FF] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#94B8D0] mb-1.5">
                Mot de Passe
              </label>
              <input
                type="password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#071E30] border border-[#1A4F7A] text-white font-bold text-sm focus:border-[#4CC2FF] focus:outline-none"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500 text-red-200 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-[#4CC2FF] text-[#0B3A5B] font-black text-sm uppercase tracking-wider hover:bg-white transition-all shadow-[0_4px_0_0_#1B9BE0] active:translate-y-1 flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Connexion au Panel Admin
                </>
              )}
            </button>
          </form>

          {/* Assistant d'initialisation en 1 clic */}
          <div className="mt-8 pt-6 border-t border-[#1A4F7A] text-center">
            <p className="text-xs text-[#94B8D0] mb-3">
              Le compte admin n&apos;est pas encore créé ou configuré ?
            </p>
            <button
              type="button"
              onClick={handleRunSetup}
              disabled={setupLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#071E30] border border-[#1A4F7A] text-xs font-bold text-[#4CC2FF] hover:bg-[#1A4F7A] transition-colors flex items-center justify-center gap-2"
            >
              {setupLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Initialiser le compte Admin (boulka-admin)
                </>
              )}
            </button>
            {setupMessage && (
              <p className="mt-2 text-xs font-bold text-[#2CD98F]">
                {setupMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07131F]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
      </div>
    );
  }

  // --- STATS GLOBALES ---
  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalXp = users.reduce((acc, u) => acc + (u.totalXp || 0), 0);
  const premiumCount = users.filter((u) => u.isPremium).length;
  const activeToday = users.filter(
    (u) => Date.now() - u.lastActiveAt < 24 * 3600 * 1000
  ).length;

  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const webhookUrl = `${currentOrigin}/api/webhooks/saaspay`;

  return (
    <div className="min-h-screen bg-[#07131F] text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0B3A5B] border-r border-[#1A4F7A] flex flex-col fixed inset-y-0 z-30">
        <div className="p-6 border-b border-[#1A4F7A] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4CC2FF] flex items-center justify-center text-[#0B3A5B] font-black text-sm">
            &lt;/&gt;
          </div>
          <div>
            <p className="font-black text-sm leading-tight">Codingo</p>
            <p className="text-[#4CC2FF] text-[11px] font-bold">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "users"
                ? "bg-[#4CC2FF] text-[#0B3A5B] shadow-[0_3px_0_0_#1B9BE0]"
                : "text-[#94B8D0] hover:bg-[#1A4F7A] hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            Utilisateurs ({users.length})
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "payments"
                ? "bg-[#4CC2FF] text-[#0B3A5B] shadow-[0_3px_0_0_#1B9BE0]"
                : "text-[#94B8D0] hover:bg-[#1A4F7A] hover:text-white"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            SaaSpay & Webhooks
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "courses"
                ? "bg-[#4CC2FF] text-[#0B3A5B] shadow-[0_3px_0_0_#1B9BE0]"
                : "text-[#94B8D0] hover:bg-[#1A4F7A] hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Cours & Leçons
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "stats"
                ? "bg-[#4CC2FF] text-[#0B3A5B] shadow-[0_3px_0_0_#1B9BE0]"
                : "text-[#94B8D0] hover:bg-[#1A4F7A] hover:text-white"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Statistiques
          </button>
        </nav>

        <div className="p-4 border-t border-[#1A4F7A] space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#4CC2FF] flex items-center justify-center text-[#0B3A5B] font-black text-xs">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user?.username}</p>
              <p className="text-[10px] text-[#4CC2FF] truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-xl bg-[#071E30] text-[#94B8D0] hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-[#1A4F7A]"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Zone Principale */}
      <main className="ml-64 flex-1 p-8 max-w-7xl">
        {/* En-tête KPI */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Utilisateurs Inscrits", val: users.length, color: "#4CC2FF" },
            { label: "Abonnés Premium (Actifs)", val: premiumCount, color: "#FFC83D" },
            { label: "Actifs Dernières 24h", val: activeToday, color: "#2CD98F" },
            { label: "XP Distribué Total", val: totalXp.toLocaleString(), color: "#FF6B35" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-[#0B3A5B] border border-[#1A4F7A] rounded-2xl p-5 shadow-sm"
            >
              <p className="text-xs font-bold text-[#94B8D0] uppercase tracking-wider mb-1">
                {kpi.label}
              </p>
              <p className="text-2xl font-black" style={{ color: kpi.color }}>
                {kpi.val}
              </p>
            </div>
          ))}
        </div>

        {/* ONGLET 1 : GESTION DES UTILISATEURS */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94B8D0]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par pseudo ou email..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0B3A5B] border border-[#1A4F7A] text-sm text-white focus:outline-none focus:border-[#4CC2FF]"
                />
              </div>

              <button
                onClick={fetchUsers}
                className="px-4 py-2.5 rounded-2xl bg-[#0B3A5B] border border-[#1A4F7A] text-xs font-black text-[#4CC2FF] hover:bg-[#1A4F7A] transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Actualiser
              </button>
            </div>

            <div className="bg-[#0B3A5B] border border-[#1A4F7A] rounded-3xl overflow-hidden shadow-lg">
              {loadingUsers ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#1A4F7A] bg-[#071E30]/50 text-[#4CC2FF] text-[11px] font-black uppercase tracking-wider">
                        <th className="px-5 py-3.5">Utilisateur</th>
                        <th className="px-4 py-3.5">Rôle</th>
                        <th className="px-4 py-3.5">Statut Premium</th>
                        <th className="px-4 py-3.5">XP & Ligue</th>
                        <th className="px-4 py-3.5">Cœurs / Gemmes</th>
                        <th className="px-4 py-3.5 text-right">Actions Rapides</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A4F7A]/40">
                      {filteredUsers.map((u) => {
                        const isTargetBusy = actionLoading === u.uid;
                        return (
                          <tr key={u.uid} className="hover:bg-[#1A4F7A]/30 transition-colors">
                            <td className="px-5 py-4">
                              <p className="font-bold text-white">{u.username}</p>
                              <p className="text-xs text-[#94B8D0]">{u.email}</p>
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                  u.role === "admin"
                                    ? "bg-[#FFC83D]/20 text-[#FFC83D] border border-[#FFC83D]/40"
                                    : "bg-[#4CC2FF]/20 text-[#4CC2FF] border border-[#4CC2FF]/40"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              {u.isPremium ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-[#2CD98F]/20 text-[#2CD98F] border border-[#2CD98F]/40">
                                  <Crown className="w-3.5 h-3.5" /> Premium 1 Mois
                                </span>
                              ) : (
                                <span className="text-xs font-bold text-[#94B8D0]">
                                  Gratuit
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-4">
                              <p className="font-black text-[#FFC83D]">{u.totalXp} XP</p>
                              <p className="text-[11px] text-[#94B8D0] uppercase font-bold">
                                {u.streakDays}j de série
                              </p>
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-xs font-bold text-red-400">
                                  <Heart className="w-3.5 h-3.5 fill-current" />
                                  {u.isPremium ? "∞" : `${u.hearts}/5`}
                                </span>
                                <span className="text-xs font-bold text-[#2CD98F]">
                                  💎 {u.gems}
                                </span>
                              </div>
                            </td>

                            <td className="px-4 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* Activer/Désactiver Premium 1 mois */}
                                <button
                                  disabled={isTargetBusy}
                                  onClick={() =>
                                    handleUserAction(u.uid, {
                                      isPremium: !u.isPremium,
                                      premiumExpiresAt: !u.isPremium
                                        ? Date.now() + 30 * 24 * 60 * 60 * 1000
                                        : null,
                                      hearts: 5,
                                    })
                                  }
                                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                    u.isPremium
                                      ? "bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30"
                                      : "bg-[#FFC83D] text-[#0B3A5B] shadow-[0_2px_0_0_#B45309] hover:bg-white"
                                  }`}
                                  title={u.isPremium ? "Révoquer Premium" : "Offrir 1 mois Premium"}
                                >
                                  {u.isPremium ? "Retirer" : "+1 Mois Premium"}
                                </button>

                                {/* Donner +100 XP */}
                                <button
                                  disabled={isTargetBusy}
                                  onClick={() =>
                                    handleUserAction(u.uid, {
                                      totalXp: (u.totalXp || 0) + 100,
                                      leagueXp: 100,
                                    })
                                  }
                                  className="px-2.5 py-1.5 rounded-xl bg-[#071E30] border border-[#1A4F7A] text-xs font-bold text-[#4CC2FF] hover:bg-[#1A4F7A]"
                                  title="Ajouter 100 XP"
                                >
                                  +100 XP
                                </button>

                                {/* Restaurer 5 Cœurs */}
                                <button
                                  disabled={isTargetBusy}
                                  onClick={() =>
                                    handleUserAction(u.uid, {
                                      hearts: 5,
                                      lastHeartLostAt: null,
                                      nextHeartRecoveryAt: null,
                                    })
                                  }
                                  className="p-1.5 rounded-xl bg-[#071E30] border border-[#1A4F7A] text-red-400 hover:bg-[#1A4F7A]"
                                  title="Restaurer 5 cœurs"
                                >
                                  <Heart className="w-4 h-4 fill-current" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ONGLET 2 : PASSERELLE SAASPAY & WEBHOOKS */}
        {activeTab === "payments" && (
          <div className="space-y-8">
            {/* Guide de configuration Webhook pour Vercel & Production */}
            <div className="bg-[#0B3A5B] border border-[#1A4F7A] rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#4CC2FF]" />
                Configuration Passerelle SaaSpay & Webhooks
              </h2>
              <p className="text-sm text-[#94B8D0] mb-6">
                Voici les informations exactes à renseigner dans le tableau de bord de SaaSpay pour activer la synchronisation automatique des abonnements Premium lors du déploiement sur Vercel.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#071E30] p-4 rounded-2xl border border-[#1A4F7A]">
                  <p className="text-xs font-black text-[#4CC2FF] uppercase tracking-wider mb-1">
                    URL du Webhook en Production (Vercel)
                  </p>
                  <code className="text-xs font-mono text-white block bg-[#0B1929] p-2.5 rounded-xl border border-[#1A4F7A] overflow-x-auto">
                    https://&lt;ton-domaine-vercel&gt;.vercel.app/api/webhooks/saaspay
                  </code>
                </div>

                <div className="bg-[#071E30] p-4 rounded-2xl border border-[#1A4F7A]">
                  <p className="text-xs font-black text-[#FFC83D] uppercase tracking-wider mb-1">
                    URL du Webhook Actuelle (Ce Serveur)
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-white flex-1 bg-[#0B1929] p-2.5 rounded-xl border border-[#1A4F7A] overflow-x-auto">
                      {webhookUrl}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(webhookUrl);
                        setCopiedUrl(true);
                        setTimeout(() => setCopiedUrl(false), 2000);
                      }}
                      className="p-2.5 rounded-xl bg-[#4CC2FF] text-[#0B3A5B] font-bold"
                      title="Copier l'URL"
                    >
                      {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#071E30] p-4 rounded-2xl border border-[#1A4F7A] space-y-2 text-xs text-[#94B8D0]">
                <p>
                  <strong>Événements SaaSpay gérés :</strong>{" "}
                  <code className="text-[#2CD98F]">subscription.active</code>,{" "}
                  <code className="text-[#2CD98F]">subscription.created</code>,{" "}
                  <code className="text-[#2CD98F]">checkout.session.completed</code>,{" "}
                  <code className="text-[#2CD98F]">subscription.canceled</code>
                </p>
                <p>
                  <strong>Effet du webhook :</strong> Accorde instantanément <strong>30 jours (1 mois)</strong> d&apos;abonnement Premium dans Firestore avec cœurs illimités et sauvegarde de la transaction.
                </p>
              </div>
            </div>

            {/* Simulateur de Webhook SaaSpay 1-Clic */}
            <div className="bg-[#0B3A5B] border border-[#1A4F7A] rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-black mb-2 flex items-center gap-2">
                <Send className="w-5 h-5 text-[#FFC83D]" />
                Simulateur de Webhook SaaSpay (Test en direct)
              </h3>
              <p className="text-xs text-[#94B8D0] mb-6">
                Teste l&apos;arrivée d&apos;un événement SaaSpay pour n&apos;importe quel compte afin de vérifier que la passerelle active bien les 30 jours de Premium en temps réel.
              </p>

              <form onSubmit={handleSimulateWebhook} className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-black uppercase text-[#94B8D0] mb-1">
                    Email de l&apos;utilisateur à tester
                  </label>
                  <select
                    value={simTargetEmail}
                    onChange={(e) => setSimTargetEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#071E30] border border-[#1A4F7A] text-sm text-white font-bold focus:border-[#4CC2FF] focus:outline-none"
                    required
                  >
                    <option value="">-- Choisir un utilisateur --</option>
                    {users.map((u) => (
                      <option key={u.uid} value={u.email}>
                        {u.username} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#94B8D0] mb-1">
                    Événement SaaSpay
                  </label>
                  <select
                    value={simEventType}
                    onChange={(e) => setSimEventType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#071E30] border border-[#1A4F7A] text-sm text-white font-bold focus:border-[#4CC2FF] focus:outline-none"
                  >
                    <option value="subscription.active">
                      subscription.active (Paiement 1 mois réussi)
                    </option>
                    <option value="subscription.created">subscription.created</option>
                    <option value="subscription.canceled">subscription.canceled (Résiliation)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={simLoading || !simTargetEmail}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#FFC83D] text-[#0B3A5B] font-black text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[0_3px_0_0_#B45309] active:translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    {simLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Envoyer le Webhook de Test
                      </>
                    )}
                  </button>
                </div>
              </form>

              {simResult && (
                <div className="p-4 rounded-2xl bg-[#071E30] border border-[#1A4F7A] text-xs font-mono">
                  <p className="text-[#4CC2FF] font-bold mb-2">Réponse du Webhook :</p>
                  <pre className="text-white overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(simResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ONGLET 3 : COURS & LEÇONS */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#4CC2FF]" />
              Parcours et Leçons Actives ({courses.length} Langages)
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {courses.map((c) => {
                const totalLessons = c.units.reduce(
                  (acc, u) =>
                    acc + u.chapters.reduce((a, ch) => a + ch.lessons.length, 0),
                  0
                );
                return (
                  <div
                    key={c.id}
                    className="bg-[#0B3A5B] border border-[#1A4F7A] rounded-3xl p-6 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="w-10 h-10 rounded-xl bg-[#4CC2FF] text-[#0B3A5B] font-black text-lg flex items-center justify-center">
                          {c.iconSvg}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#2CD98F]/20 text-[#2CD98F] border border-[#2CD98F]/40">
                          {c.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white">{c.title}</h3>
                      <p className="text-xs text-[#94B8D0] mt-1 mb-4">
                        {c.description}
                      </p>

                      <div className="space-y-2 text-xs font-bold text-[#4CC2FF]">
                        <p>• {c.units.length} Unités d&apos;apprentissage</p>
                        <p>• {totalLessons} Leçons interactives au total</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#1A4F7A]">
                      <button
                        onClick={() => router.push(`/apprendre/${c.id}`)}
                        className="w-full py-2.5 rounded-xl bg-[#071E30] text-[#4CC2FF] font-black text-xs hover:bg-[#1A4F7A] transition-colors flex items-center justify-center gap-1.5"
                      >
                        Voir le parcours <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ONGLET 4 : STATISTIQUES */}
        {activeTab === "stats" && (
          <div className="bg-[#0B3A5B] border border-[#1A4F7A] rounded-3xl p-8 space-y-6">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#4CC2FF]" />
              Indicateurs de Performance Plateforme
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#071E30] border border-[#1A4F7A]">
                <p className="text-xs text-[#94B8D0] uppercase font-bold mb-1">
                  Taux de Conversion Premium
                </p>
                <p className="text-3xl font-black text-[#FFC83D]">
                  {users.length > 0
                    ? `${Math.round((premiumCount / users.length) * 100)}%`
                    : "0%"}
                </p>
                <p className="text-xs text-[#94B8D0] mt-1">
                  {premiumCount} abonnés sur {users.length} apprenants
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#071E30] border border-[#1A4F7A]">
                <p className="text-xs text-[#94B8D0] uppercase font-bold mb-1">
                  Engagement Quotidien
                </p>
                <p className="text-3xl font-black text-[#2CD98F]">
                  {users.length > 0
                    ? `${Math.round((activeToday / users.length) * 100)}%`
                    : "0%"}
                </p>
                <p className="text-xs text-[#94B8D0] mt-1">
                  Apprenants connectés dans les dernières 24 heures
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#071E30] border border-[#1A4F7A]">
                <p className="text-xs text-[#94B8D0] uppercase font-bold mb-1">
                  Moyenne XP / Apprenant
                </p>
                <p className="text-3xl font-black text-[#4CC2FF]">
                  {users.length > 0
                    ? Math.round(totalXp / users.length).toLocaleString()
                    : 0}{" "}
                  XP
                </p>
                <p className="text-xs text-[#94B8D0] mt-1">
                  Progression globale sur l&apos;ensemble des cours
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
