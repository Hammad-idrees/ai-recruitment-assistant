"use client";

import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt"];

interface ResumeDropzoneProps {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

function isAllowed(file: File): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase();
  return !!ext && ALLOWED_EXTENSIONS.includes(ext);
}

export function ResumeDropzone({ file, onChange, disabled }: ResumeDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    const candidate = files?.[0];
    if (!candidate) return;
    if (!isAllowed(candidate)) return;
    onChange(candidate);
  }

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/3 px-5 py-4 backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/5">
            <FileText className="size-5 text-muted-foreground" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-white">{file.name}</p>
            <p className="text-sm text-white/60">
              {(file.size / 1024).toFixed(0)} KB
            </p>
          </div>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Remove file"
          >
            <X className="size-5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <label
      htmlFor="resume-file-input"
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-16 text-center backdrop-blur-xl transition-colors",
        disabled ? "pointer-events-none opacity-50" : "cursor-pointer",
        isDragOver
          ? "border-glow-amber/50 bg-glow-amber/6"
          : "border-white/15 bg-white/2 hover:border-white/25 hover:bg-white/4"
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-white/5">
        <Upload className="size-6 text-muted-foreground" />
      </span>
      <p className="text-base font-semibold text-white">
        Drop a resume, or <span className="underline underline-offset-2 text-glow-amber">browse</span>
      </p>
      <p className="text-sm text-white/50">PDF, DOCX, or TXT · up to 5MB</p>
      <input
        id="resume-file-input"
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </label>
  );
}
