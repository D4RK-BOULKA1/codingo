import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "_");
}

export function isValidUsername(username: string): boolean {
  return USERNAME_REGEX.test(username);
}

/** Vérifie si un pseudo est déjà pris (collection usernames + fallback users). */
export async function isUsernameTaken(
  username: string,
  exceptUid?: string
): Promise<boolean> {
  const normalized = normalizeUsername(username);

  const usernameRef = doc(db, "usernames", normalized);
  const usernameSnap = await getDoc(usernameRef);
  if (usernameSnap.exists()) {
    const owner = usernameSnap.data()?.uid as string | undefined;
    if (owner && owner !== exceptUid) return true;
  }

  const usersQuery = query(
    collection(db, "users"),
    where("username", "==", normalized),
    limit(1)
  );
  const usersSnap = await getDocs(usersQuery);
  if (usersSnap.empty) return false;
  const existingUid = usersSnap.docs[0].id;
  return existingUid !== exceptUid;
}
