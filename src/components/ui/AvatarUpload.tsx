"use client";

import { useRef, useState } from "react";
import { Loader2, Camera } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/client";

interface AvatarUploadProps {
  uid: string;
  currentUrl: string | null;
  username: string;
  onUploaded: (url: string) => Promise<void> | void;
}

/** Recadre au carré et compresse en JPEG avant upload Storage. */
async function cropAndCompress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const size = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - size) / 2;
  const sy = (bitmap.height - size) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible");

  ctx.drawImage(bitmap, sx, sy, size, size, 0, 0, 256, 256);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Compression échouée"));
        else resolve(blob);
      },
      "image/jpeg",
      0.85
    );
  });
}

export function AvatarUpload({
  uid,
  currentUrl,
  username,
  onUploaded,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choisis une image (JPG ou PNG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image trop lourde (max 5 Mo).");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const blob = await cropAndCompress(file);
      const storageRef = ref(storage, `avatars/${uid}.jpg`);
      await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });
      const url = await getDownloadURL(storageRef);
      await onUploaded(url);
    } catch {
      setError(
        "Upload impossible. Vérifie que Firebase Storage est activé et configuré."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#E2E8F0] bg-[#0B3A5B] text-white flex items-center justify-center group"
        aria-label="Changer la photo de profil"
      >
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentUrl}
            alt={`Avatar de ${username}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl font-black">
            {username.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="absolute inset-0 bg-[#0B3A5B]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="text-xs text-[#D63030] font-semibold">{error}</p>}
    </div>
  );
}
