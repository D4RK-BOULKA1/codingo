"use client";

import { useState } from "react";
import { Eye, Code } from "lucide-react";

interface CodeEditorSandboxProps {
  initialCode?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function CodeEditorSandbox({
  initialCode = "",
  value,
  onChange,
  placeholder = "Écris ton code HTML ici...",
}: CodeEditorSandboxProps) {
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const codeValue = value ?? initialCode;

  // Iframe sandbox srcdoc
  const previewHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui, sans-serif; padding: 12px; color: #0B3A5B; margin: 0; }
        </style>
      </head>
      <body>
        ${codeValue}
      </body>
    </html>
  `;

  return (
    <div className="border-2 border-[#E2EEF7] rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Onglets Code / Aperçu */}
      <div className="flex bg-[#F8FAFC] border-b-2 border-[#E2EEF7]">
        <button
          type="button"
          onClick={() => setActiveTab("code")}
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider transition-colors ${
            activeTab === "code"
              ? "bg-white text-[#1B9BE0] border-b-2 border-[#1B9BE0] -mb-[2px]"
              : "text-[#64748B] hover:text-[#0B3A5B]"
          }`}
        >
          <Code className="w-4 h-4" />
          Code HTML
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider transition-colors ${
            activeTab === "preview"
              ? "bg-white text-[#1B9BE0] border-b-2 border-[#1B9BE0] -mb-[2px]"
              : "text-[#64748B] hover:text-[#0B3A5B]"
          }`}
        >
          <Eye className="w-4 h-4" />
          Aperçu en direct
        </button>
      </div>

      {/* Contenu */}
      <div className="relative">
        {activeTab === "code" ? (
          <div className="flex">
            {/* Numéros de ligne simulés */}
            <div className="w-10 bg-[#F8FAFC] py-4 text-right pr-3 select-none text-xs font-mono text-[#94B8D0] border-r border-[#E2EEF7]">
              {codeValue.split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={codeValue}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              spellCheck={false}
              className="flex-1 p-4 font-mono text-sm text-[#0B3A5B] bg-transparent focus:outline-none resize-none min-h-[180px] leading-relaxed"
            />
          </div>
        ) : (
          <div className="w-full h-[220px] bg-white">
            <iframe
              srcDoc={previewHtml}
              title="Aperçu sandbox"
              sandbox="allow-scripts"
              className="w-full h-full border-0"
            />
          </div>
        )}
      </div>
    </div>
  );
}
