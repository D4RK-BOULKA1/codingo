import { auth } from "@/lib/firebase/client";

/** Crée le cookie de session HTTP-only après une connexion réussie. */
export async function createServerSession(): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const idToken = await user.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
}

/** Supprime le cookie de session côté serveur. */
export async function clearServerSession(): Promise<void> {
  await fetch("/api/auth/session", { method: "DELETE" });
}
