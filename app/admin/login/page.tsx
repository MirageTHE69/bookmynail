"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Sign in failed.");
        return;
      }
      // Hard navigation: the session cookie changes the whole tree's auth
      // state, and a soft push can serve a cached logged-out RSC payload.
      window.location.assign(params.get("next") || "/admin");
    } catch {
      setError("Network error — is the server running?");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "min-h-[46px] w-full rounded-md border border-ink/20 bg-white px-3.5 text-[15px] text-ink";

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-[380px] rounded-lg border border-ink/10 bg-white p-7"
    >
      <p className="m-0 font-display text-2xl text-ink">BookMyNail</p>
      <p className="m-0 mb-6 text-[10px] uppercase tracking-[0.2em] text-ink/45">Admin sign in</p>

      <label className="mb-3.5 block">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/60">
          Email
        </span>
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
          required
        />
      </label>

      <label className="mb-5 block">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/60">
          Password
        </span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={field}
          required
        />
      </label>

      {error && (
        <p role="alert" className="m-0 mb-4 text-sm text-terracotta">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="min-h-[46px] w-full cursor-pointer rounded-full border-none bg-ink text-[11px] uppercase tracking-[0.16em] text-bone disabled:opacity-50"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F1ED] px-5">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
