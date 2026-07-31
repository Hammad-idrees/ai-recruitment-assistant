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
      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary">
            <FileText className="size-4 text-muted-foreground" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(0)} KB
            </p>
          </div>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Remove file"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
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
      onClick={() => !disabled && inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border py-10 text-center transition-colors",
        isDragOver ? "border-foreground/40 bg-secondary/60" : "border-border hover:bg-secondary/40",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-md bg-secondary">
        <Upload className="size-4 text-muted-foreground" />
      </span>
      <p className="text-sm font-medium">
        Drop a resume, or <span className="underline underline-offset-2">browse</span>
      </p>
      <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT · up to 5MB</p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
