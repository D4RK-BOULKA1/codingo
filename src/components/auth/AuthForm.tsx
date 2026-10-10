"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getFirebaseAuthErrorMessage } from "@/lib/auth/errors";
import { CodingoLogo } from "@/components/mascot/CodingoLogo";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export type AuthMode = "login" | "signup";

interface AuthFormProps {
  initialMode?: AuthMode;
}

export function AuthForm({ initialMode = "login" }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    login,
    signup,
    loginWithGoogle,
    user,
    isLoading,
    checkUsernameAvailable,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(user.onboardingCompleted ? "/apprendre" : "/onboarding");
    }
  }, [user, isLoading, router]);

  function mapError(code: string): string {
    if (code === "auth/username-taken") {
      return "Ce pseudo est déjà pris. Choisis-en un autre.";
    }
    if (code === "auth/invalid-username") {
      return "Le pseudo doit contenir 3 à 20 caractères (lettres, chiffres, _).";
    }
    return getFirebaseAuthErrorMessage(code);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(emailOrUsername, password);
        // La redirection est gérée par useEffect selon onboardingCompleted
      } else {
        if (!email || !username || !password) {
          setError("Tous les champs sont requis.");
          return;
        }
        if (username.length < 3) {
          setError("Le pseudo doit contenir au moins 3 caractères.");
          return;
        }
        const available = await checkUsernameAvailable(username);
        if (!available) {
          setError("Ce pseudo est déjà pris. Choisis-en un autre.");
          return;
        }
        await signup(email, username, password);
        router.replace("/onboarding");
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      setError(mapError(code));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      // useEffect redirige vers /onboarding ou /apprendre
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      setError(mapError(code));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center mb-4">
            <CodingoLogo size="md" />
          </Link>
          <h1 className="text-xl font-bold text-[#0B3A5B]">
            {mode === "login"
              ? "Bon retour parmi nous !"
              : "Crée ton compte gratuit"}
          </h1>
          <p className="text-sm text-[#4A7FA5] mt-1">
            {mode === "login"
              ? "Connecte-toi avec Google ou ton email."
              : "Inscription en quelques secondes, puis onboarding guidé."}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_0_0_#CBD5E1] border-2 border-[#E2E8F0] p-8">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isSubmitting}
            id="btn-google-auth"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-[#E2E8F0] bg-white text-[#0B3A5B] font-semibold text-sm hover:bg-[#F0F9FF] hover:border-[#4CC2FF] transition-all duration-150 disabled:opacity-50 mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.2045Z" fill="#4285F4"/>
              <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
              <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.5931 3.68182 9C3.68182 8.4068 3.78409 7.8299 3.96409 7.29V4.9581H0.957275C0.347727 6.1731 0 7.5477 0 9C0 10.4522 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
              <path d="M9 3.5795C10.3214 3.5795 11.5077 4.0336 12.4405 4.9254L15.0218 2.344C13.4632 0.8918 11.4259 0 9 0C5.48182 0 2.43818 2.0168 0.957275 4.9581L3.96409 7.29C4.67182 5.1627 6.65591 3.5795 9 3.5795Z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>

          <div className="relative flex items-center mb-6">
            <div className="flex-1 border-t border-[#E2E8F0]" />
            <span className="mx-3 text-xs text-[#94B8D0] font-medium">ou</span>
            <div className="flex-1 border-t border-[#E2E8F0]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "login" ? (
              <div>
                <label
                  className="block text-sm font-semibold text-[#0B3A5B] mb-1.5"
                  htmlFor="login-email"
                >
                  Email ou pseudo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94B8D0] w-4 h-4" />
                  <input
                    id="login-email"
                    type="text"
                    autoComplete="username"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="ton@email.com ou boulka-admin"
                    required
                    className="w-full pl-9 pr-4 py-3 border-2 border-[#E2E8F0] rounded-xl text-sm text-[#0B3A5B] placeholder-[#94B8D0] focus:outline-none focus:border-[#4CC2FF] transition-colors"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label
                    className="block text-sm font-semibold text-[#0B3A5B] mb-1.5"
                    htmlFor="signup-email"
                  >
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94B8D0] w-4 h-4" />
                    <input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ton@email.com"
                      required
                      className="w-full pl-9 pr-4 py-3 border-2 border-[#E2E8F0] rounded-xl text-sm text-[#0B3A5B] placeholder-[#94B8D0] focus:outline-none focus:border-[#4CC2FF] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold text-[#0B3A5B] mb-1.5"
                    htmlFor="signup-username"
                  >
                    Pseudo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94B8D0] w-4 h-4" />
                    <input
                      id="signup-username"
                      type="text"
                      autoComplete="username"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
                        )
                      }
                      placeholder="alexdev_42"
                      required
                      minLength={3}
                      maxLength={20}
                      className="w-full pl-9 pr-4 py-3 border-2 border-[#E2E8F0] rounded-xl text-sm text-[#0B3A5B] placeholder-[#94B8D0] focus:outline-none focus:border-[#4CC2FF] transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="block text-sm font-semibold text-[#0B3A5B]"
                  htmlFor="auth-password"
                >
                  Mot de passe
                </label>
                {mode === "login" && (
                  <Link
                    href="/mot-de-passe-oublie"
                    className="text-xs font-semibold text-[#1B9BE0] hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94B8D0] w-4 h-4" />
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === "login"
                      ? "Ton mot de passe"
                      : "Minimum 6 caractères"
                  }
                  required
                  minLength={6}
                  className="w-full pl-9 pr-10 py-3 border-2 border-[#E2E8F0] rounded-xl text-sm text-[#0B3A5B] placeholder-[#94B8D0] focus:outline-none focus:border-[#4CC2FF] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94B8D0] hover:text-[#0B3A5B] transition-colors"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
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
              id="btn-auth-submit"
              className="w-full py-3 rounded-xl bg-[#4CC2FF] text-[#0B3A5B] font-bold text-sm border-2 border-[#1B9BE0] shadow-[0_4px_0_0_#1B9BE0] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#1B9BE0] active:shadow-none active:translate-y-1 transition-all duration-100 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "login" ? (
                "Se connecter"
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#4A7FA5] mt-6">
            {mode === "login" ? (
              <>
                Pas encore de compte ?{" "}
                <Link
                  href="/inscription"
                  className="font-bold text-[#0B3A5B] hover:underline"
                  id="btn-switch-to-signup"
                >
                  Inscris-toi gratuitement
                </Link>
              </>
            ) : (
              <>
                Déjà un compte ?{" "}
                <Link
                  href="/connexion"
                  className="font-bold text-[#0B3A5B] hover:underline"
                  id="btn-switch-to-login"
                >
                  Se connecter
                </Link>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-xs text-[#94B8D0] mt-4">
          En continuant, tu acceptes nos{" "}
          <Link href="/cgu" className="underline">
            CGU
          </Link>{" "}
          et notre{" "}
          <Link href="/confidentialite" className="underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
