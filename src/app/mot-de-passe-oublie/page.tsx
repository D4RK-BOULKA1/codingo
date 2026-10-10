"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getFirebaseAuthErrorMessage } from "@/lib/auth/errors";
import { CodingoLogo } from "@/components/mascot/CodingoLogo";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";

export default function MotDePasseOubliePage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      setError(getFirebaseAuthErrorMessage(code));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center mb-4">
            <CodingoLogo size="md" />
          </Link>
          <h1 className="text-xl font-bold text-[#0B3A5B]">
            Mot de passe oublié
          </h1>
          <p className="text-sm text-[#4A7FA5] mt-1">
            Indique ton email : on t&apos;envoie un lien de réinitialisation.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_0_0_#CBD5E1] border-2 border-[#E2E8F0] p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-[#E8FFF4] border-2 border-[#2CD98F] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#189C63]" />
              </div>
              <p className="text-sm font-semibold text-[#0B3A5B]">
                Si un compte existe pour {email}, un email vient d&apos;être
                envoyé.
              </p>
              <Link
                href="/connexion"
                className="inline-block font-bold text-[#1B9BE0] hover:underline text-sm"
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-semibold text-[#0B3A5B] mb-1.5"
                  htmlFor="reset-email"
                >
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94B8D0] w-4 h-4" />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    className="w-full pl-9 pr-4 py-3 border-2 border-[#E2E8F0] rounded-xl text-sm text-[#0B3A5B] placeholder-[#94B8D0] focus:outline-none focus:border-[#4CC2FF] transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-[#FFF0F0] border-2 border-[#FF5353] rounded-xl text-sm text-[#D63030]">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#4CC2FF] text-[#0B3A5B] font-bold text-sm border-2 border-[#1B9BE0] shadow-[0_4px_0_0_#1B9BE0] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#1B9BE0] active:shadow-none active:translate-y-1 transition-all duration-100 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Envoyer le lien"
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-[#4A7FA5] mt-4">
          <Link href="/connexion" className="font-bold hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
