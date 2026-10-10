"use client";

import { useState } from "react";
import Link from "next/link";
import { CodingoLogo } from "@/components/mascot/CodingoLogo";
import { Button3D } from "@/components/ui/Button3D";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function TarifsPage() {
  const { user, firebaseUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (!user) {
      router.push("/connexion");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const headers: HeadersInit = {};
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors du paiement");
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Impossible de lancer le paiement SaaSpay.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      <header className="bg-white border-b-2 border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <CodingoLogo size="md" />
          </Link>
          <Button3D variant="blue" size="sm" href={user ? "/apprendre" : "/inscription"}>
            {user ? "Mon Cours" : "Commencer"}
          </Button3D>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#0B3A5B]">
            Choisis ton plan
          </h1>
          <p className="text-[#4A7FA5] mt-2 font-semibold">
            Propulsé par la passerelle de paiement sécurisée SaaSpay (Mode Sandbox).
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-100 border-2 border-red-300 text-red-700 rounded-2xl text-center font-bold">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] shadow-[0_4px_0_0_#CBD5E1] p-6 flex flex-col">
            <h2 className="text-xl font-black text-[#0B3A5B]">Gratuit</h2>
            <p className="text-3xl font-black text-[#0B3A5B] mt-2">0 €</p>
            <ul className="mt-6 space-y-2 text-sm text-[#4A7FA5] flex-1">
              {[
                "5 cœurs",
                "10 XP par leçon sans erreur",
                "Parcours HTML et CSS",
                "Reset des cœurs après 5 heures",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#189C63] mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button3D variant="white" fullWidth href={user ? "/apprendre" : "/inscription"}>
                Plan actuel
              </Button3D>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-[#E0A81B] shadow-[0_4px_0_0_#E0A81B] p-6 flex flex-col">
            <p className="text-xs font-black uppercase tracking-wide text-[#E0A81B]">
              Recommandé
            </p>
            <h2 className="text-xl font-black text-[#0B3A5B]">Premium</h2>
            <p className="text-3xl font-black text-[#0B3A5B] mt-2">
              25 € <span className="text-base font-bold text-[#4A7FA5]">/ mois</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm text-[#4A7FA5] flex-1">
              {[
                "Cœurs illimités",
                "25 XP par leçon sans erreur",
                "Correction IA illimitée",
                "Accès à tous les mini-projets",
                "Badge diamant à côté du nom",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#E0A81B] mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button3D variant="yellow" fullWidth onClick={handleCheckout} disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Passer Premium (SaaSpay)"}
              </Button3D>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
