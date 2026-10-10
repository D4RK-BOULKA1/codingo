/** Traduit les codes d'erreur Firebase Auth en messages français. */
export function getFirebaseAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Identifiant ou mot de passe incorrect.";
    case "auth/email-already-in-use":
      return "Cette adresse email est déjà utilisée.";
    case "auth/weak-password":
      return "Le mot de passe doit contenir au moins 6 caractères.";
    case "auth/invalid-email":
      return "Adresse email invalide.";
    case "auth/too-many-requests":
      return "Trop de tentatives. Veuillez patienter quelques minutes.";
    case "auth/popup-closed-by-user":
      return "La fenêtre Google a été fermée. Veuillez réessayer.";
    case "auth/network-request-failed":
      return "Problème de connexion réseau. Vérifiez votre connexion internet.";
    case "auth/user-disabled":
      return "Ce compte a été désactivé.";
    case "auth/requires-recent-login":
      return "Pour des raisons de sécurité, reconnecte-toi puis réessaie.";
    case "auth/missing-email":
      return "Indique une adresse email.";
    default:
      return "Une erreur est survenue. Veuillez réessayer.";
  }
}
