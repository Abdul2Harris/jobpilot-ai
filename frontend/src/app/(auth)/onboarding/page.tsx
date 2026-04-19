"use client";

import { useCallback, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useOnBoardUserFn } from "@/services/auth";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Upload,
  CloudUpload,
  Settings2,
  Star,
  ShieldCheck,
  Boxes,
  ArrowRight,
  AlertCircle,
  X,
} from "lucide-react";

type OnboardingStep = "upload" | "processing" | "done";

/* ─────────────────────────── types ─────────────────────────── */
type Step = "upload" | "processing" | "done";
type SubStep = "parse" | "extract" | "embed";

/* ─────────────────────────── helpers ───────────────────────── */
function StepCircle({
  state,
  children,
}: {
  state: "completed" | "active" | "upcoming";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300",
        state === "upcoming" &&
          "border border-outline-variant bg-surface-lowest text-on-surface-faint shadow-sm",
        state === "active" &&
          "bg-primary text-surface shadow-[0_0_0_4px_rgba(70,72,212,0.18)] animate-pulse-ring",
        state === "completed" &&
          "bg-primary text-surface shadow-[0_0_0_4px_rgba(70,72,212,0.14)]",
      )}
    >
      {children}
    </span>
  );
}

function Connector({ filled }: { filled: boolean }) {
  return (
    <div className="relative mx-1 mb-5 h-0.5 flex-1 overflow-hidden rounded-full bg-surface-low">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: filled ? "100%" : "0%" }}
      />
    </div>
  );
}

function SubStepPill({
  status,
  label,
}: {
  status: "done" | "current" | "pending";
  label: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300",
        status === "done" && "border-primary/30 bg-primary/10 text-primary",
        status === "current" && "border-primary bg-primary/10 text-primary",
        status === "pending" && "border-outline-variant text-on-surface-faint",
      )}
    >
      {status === "done" ? (
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <span
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            status === "current"
              ? "animate-[blink_1s_ease_infinite] bg-primary"
              : "bg-gray-300",
          )}
        />
      )}
      {label}
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>("upload");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [subStep, setSubStep] = useState<SubStep>("parse");
  const router = useRouter();
  // const onboarding = useOnBoardUserFn();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* progress bar widths */
  const cardProgress =
    step === "upload" ? "33%" : step === "processing" ? "66%" : "100%";

  /* stepper states */
  const s1 = step === "upload" ? "active" : "completed";
  const s2 =
    step === "upload"
      ? "upcoming"
      : step === "processing"
        ? "active"
        : "completed";
  const s3 = step === "done" ? "done-final" : "upcoming";

  const handleUpload = async () => {
    if (!resumeFile) {
      setError("Please select a resume file first");
      return;
    }

    setLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      // Step 1 — Get auth user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push("/login");
        return;
      }

      setStep("processing");

      // Step 2 — Upload PDF to Supabase Storage
      const fileExt = resumeFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, resumeFile, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      // Step 3 — Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("resumes").getPublicUrl(filePath);
      console.log("publicUrl:", publicUrl);

      // Step 4 — Get name + email from localStorage
      const name = localStorage.getItem("onboarding_name") || "";
      const email =
        localStorage.getItem("onboarding_email") || user.email || "";

      // Step 5 — Call backend (handles profile creation + n8n)
      // onboarding.mutateAsync({
      //   resumeUrl: publicUrl,
      //   name,
      //   email,
      //   authUserId: user.id,
      // });

      // Step 6 — Cleanup + redirect
      localStorage.removeItem("onboarding_name");
      localStorage.removeItem("onboarding_email");

      setStep("done");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setStep("upload");
    } finally {
      setLoading(false);
    }
  };

  /* ── file validation ── */
  const handleFile = useCallback((file: File | null | undefined) => {
    if (!file) return;
    setError(null);
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }
    setResumeFile(file);
  }, []);

  /* ── drag & drop ── */
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <>
      {/* ── Global keyframes injected via Tailwind @layer or a <style> tag ── */}
      <style>{`
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,.35); }
          70%  { box-shadow: 0 0 0 10px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        @keyframes blink {
          0%,100% { opacity:1 } 50% { opacity:.25 }
        }
        @keyframes dotBounce {
          0%,80%,100% { transform:scale(.8); opacity:.4 }
          40%         { transform:scale(1.1); opacity:1 }
        }
        .animate-pulse-ring { animation: pulse-ring 1.8s ease infinite; }
      `}</style>

      {/* ── Page shell ── */}
      <div className="flex min-h-screen flex-col bg-surface">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-lowest px-6 py-4">
          <a
            href="#"
            className="flex items-center gap-2 font-semibold text-on-surface"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Boxes className="h-4 w-4 text-surface" />
            </span>
            Atelier AI
          </a>

          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-faint hover:bg-surface-low hover:text-on-surface">
              {/* icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-faint hover:bg-surface-low hover:text-on-surface">
              {/* icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
          {/* ── Stepper ── */}
          <div className="flex w-full max-w-[540px] items-center">
            {/* Step 1 */}
            <div className="flex shrink-0 flex-col items-center gap-2">
              <StepCircle state={s1}>
                {s1 === "completed" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </StepCircle>
              <span
                className={cn(
                  "text-[0.65rem] font-bold uppercase tracking-widest",
                  "text-primary",
                )}
              >
                Upload Resume
              </span>
            </div>

            <Connector filled={step !== "upload"} />

            {/* Step 2 */}
            <div className="flex shrink-0 flex-col items-center gap-2">
              <StepCircle state={s2}>
                {s2 === "completed" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Settings2 className="h-4 w-4" />
                )}
              </StepCircle>
              <span
                className={cn(
                  "text-[0.65rem] font-bold uppercase tracking-widest",
                  s2 !== "upcoming"
                    ? "text-primary"
                    : "text-on-surface-variant",
                )}
              >
                Processing
              </span>
            </div>

            <Connector filled={step === "done"} />

            {/* Step 3 */}
            <div className="flex shrink-0 flex-col items-center gap-2">
              <StepCircle state={step === "done" ? "completed" : "upcoming"}>
                <Star className="h-4 w-4" />
              </StepCircle>
              <span
                className={cn(
                  "text-[0.65rem] font-bold uppercase tracking-widest",
                  step === "done" ? "text-primary" : "text-on-surface-variant",
                )}
              >
                Done
              </span>
            </div>
          </div>

          {/* ── Card ── */}
          <div className="w-full max-w-[540px] overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-lowest shadow-md">
            <div className="h-[3px] bg-surface-low">
              <div
                className="h-full rounded-r-full bg-primary transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: cardProgress }}
              />
            </div>
            <div className="px-10 py-10">
              {step === "upload" && (
                <div className="flex flex-col items-center">
                  <div className="mb-6 w-full">
                    <h2 className="mb-2 text-xl font-bold text-on-surface">
                      Resume Parsing
                    </h2>
                    <p className="text-sm leading-relaxed text-on-surface-variant">
                      Let's start by building your profile. Upload your latest
                      resume to automatically extract your skills and
                      experience.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-5 flex w-full items-center gap-2 rounded-md border border-error/30 bg-error/10 px-4 py-3 text-xs font-medium text-error">
                      {" "}
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{error}</span>
                      <button
                        onClick={() => setError(null)}
                        className="ml-auto rounded-full p-0.5 hover:bg-error"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Upload resume PDF"
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) =>
                      e.key === "Enter" && fileInputRef.current?.click()
                    }
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    className={cn(
                      "relative mb-6 flex w-full cursor-pointer flex-col items-center gap-3 rounded-lg border-[1.5px] border-dashed px-6 py-10 text-center transition-colors duration-200",
                      resumeFile
                        ? "border-primary bg-primary/10"
                        : isDragging
                          ? "border-primary-container bg-primary/10"
                          : "border-outline-variant bg-surface-low hover:border-primary-container hover:bg-primary/5",
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="sr-only"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-outline-variant bg-surface-lowest shadow-sm">
                      <CloudUpload className="h-6 w-6 text-primary" />
                    </div>
                    {resumeFile ? (
                      <>
                        <span className="text-sm font-semibold text-on-surface">
                          File selected
                        </span>
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-primary">
                          {resumeFile.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-semibold text-on-surface">
                          Click or drag your resume here
                        </span>
                        <span className="text-xs text-onSurface-variant">
                          PDF only, max 5MB
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    disabled={!resumeFile || loading}
                    onClick={handleUpload}
                    className={cn(
                      "group flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold tracking-wide text-surface shadow-[0_2px_8px_rgba(99,102,241,0.25)] transition-all duration-200",
                      resumeFile && !loading
                        ? "bg-primary hover:bg-indigo-700 hover:shadow-[0_4px_16px_rgba(99,102,241,0.35)] active:scale-[0.98]"
                        : "cursor-not-allowed bg-indigo-400 opacity-50 shadow-none",
                    )}
                  >
                    Upload &amp; Continue
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>

                  {/* <p className="mt-3 text-center text-xs text-on-surface-variant">
                    By uploading, you agree to our{" "}
                    <a href="#" className="underline hover:text-gray-600">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline hover:text-gray-600">
                      Privacy Policy
                    </a>
                    .
                  </p>

                  <div className="mt-5 flex items-center justify-center gap-2">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-on-surface-variant">
                      Trusted by
                    </span>
                    {[
                      <CheckCircle2 key="1" className="h-3 w-3" />,
                      <ShieldCheck key="2" className="h-3 w-3" />,
                      <svg
                        key="3"
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>,
                    ].map((icon, i) => (
                      <span
                        key={i}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-surface-lowest text-on-surface-variant dark:border-slate-700 dark:bg-slate-800"
                      >
                        {icon}
                      </span>
                    ))}
                  </div> */}
                </div>
              )}

              {step === "processing" && (
                <div className="flex flex-col items-center">
                  <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
                    <div className="absolute inset-[-4px] animate-spin rounded-full border-[2.5px] border-transparent border-t-indigo-600 border-r-indigo-200" />
                    <Settings2 className="h-8 w-8 text-primary" />
                  </div>

                  <div className="mb-8 text-center">
                    <h2 className="mb-2 text-xl font-bold text-on-surface">
                      Analyzing your resume...
                    </h2>
                    <p className="text-sm text-on-surface-variant">
                      Our AI engine is currently extracting your professional
                      profile.
                    </p>
                  </div>

                  <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
                    <SubStepPill
                      label="Parsing resume"
                      status={subStep === "parse" ? "current" : "done"}
                    />
                    <SubStepPill
                      label="Extracting skills"
                      status={
                        subStep === "parse"
                          ? "pending"
                          : subStep === "extract"
                            ? "current"
                            : "done"
                      }
                    />
                    <SubStepPill
                      label="Generating embeddings"
                      status={
                        subStep === "embed"
                          ? "current"
                          : subStep === "parse" || subStep === "extract"
                            ? "pending"
                            : "done"
                      }
                    />
                  </div>

                  <div className="grid w-full grid-cols-2 gap-3">
                    <div className="rounded-xl border border-surface-low bg-surface-lowest p-5">
                      <div className="mb-3 text-primary">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="h-5 w-5"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                          <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                      </div>
                      <h4 className="mb-1 text-sm font-semibold text-on-surface ">
                        Semantic Search
                      </h4>
                      <p className="text-xs leading-relaxed text-on-surface-variant">
                        We index your experience using vector embeddings for
                        perfect role matching.
                      </p>
                    </div>
                    <div className="rounded-xl border border-surface-low bg-surface-lowest p-5">
                      <div className="mb-3 text-primary">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <h4 className="mb-1 text-sm font-semibold text-on-surface ">
                        Privacy First
                      </h4>
                      <p className="text-xs leading-relaxed text-on-surface-variant">
                        Your data is encrypted and used only for your personal
                        career atelier.
                      </p>
                    </div>
                  </div>

                  <p className="mt-8 text-center text-xs text-on-surface-variant">
                    This usually takes about 15–30 seconds. Please don't close
                    the window.
                  </p>
                </div>
              )}

              {step === "done" && (
                <div className="flex flex-col items-center">
                  <div className="mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-primary shadow-[0_8px_28px_rgba(99,102,241,0.3)]">
                    <CheckCircle2
                      className="h-10 w-10 text-surface"
                      strokeWidth={2.5}
                    />
                  </div>

                  <div className="mb-6 text-center">
                    <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-on-surface ">
                      You're all set!
                    </h2>
                    <p className="text-sm leading-relaxed text-on-surface-variant">
                      Your workspace is ready.
                      <br />
                      Redirecting you to the dashboard in a few moments...
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-full border border-surface-low bg-surface-lowest px-6 py-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:border-slate-700 dark:bg-slate-900">
                    <span className="flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-on-surface-faint"
                        />
                      ))}
                    </span>
                    Preparing your atelier
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        {/* <footer className="py-6 text-center text-xs text-on-surface-variant">
            {step === "done"
              ? "THE DIGITAL ATELIER © 2024"
              : "© 2024 Atelier AI. All rights reserved."}
          </footer> */}
      </div>
    </>
  );
}
