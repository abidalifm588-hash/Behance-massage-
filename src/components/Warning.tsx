import { ShieldAlert, Lock, ArrowRight, Banknote } from "lucide-react";

export default function Warning({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0508] text-white flex flex-col">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-red-600/30 blur-[140px] animate-pulse" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />

      {/* hazard stripe top */}
      <div
        className="h-3 w-full shrink-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,#facc15 0 18px,#0a0508 18px 36px)",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#1769ff] font-black text-lg">B</div>
          <span className="text-xl font-extrabold tracking-tight">Behance</span>
        </div>
        <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-300">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          Restricted Access
        </span>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-10">
        <div className="w-full max-w-3xl">
          <div className="relative rounded-3xl border-2 border-red-500/70 bg-gradient-to-b from-[#1c0a10] to-[#12070b] p-6 shadow-[0_0_80px_-10px_rgba(239,68,68,0.6)] sm:p-10">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <div className="relative grid h-20 w-20 place-items-center rounded-full bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.9)] ring-4 ring-[#0a0508]">
                <span className="absolute inset-0 rounded-full bg-red-500 opacity-60 animate-ping" />
                <ShieldAlert className="relative h-10 w-10" strokeWidth={2.2} />
              </div>
            </div>

            <p className="mt-8 text-center text-xs font-bold uppercase tracking-[0.35em] text-amber-400">
              ⚠ Important Warning ⚠
            </p>
            <h1 className="mt-3 text-center text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
              Financial transactions
              <br />
              <span className="bg-gradient-to-r from-red-400 via-amber-300 to-red-400 bg-clip-text text-transparent">
                take place here
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-red-50/90 sm:text-lg">
              Financial transactions take place on this platform, so{" "}
              <strong className="text-white underline decoration-red-500 decoration-2 underline-offset-4">
                all conversations must be kept strictly secret.
              </strong>{" "}
              Never share, screenshot or discuss any message, amount, contract or account detail with anyone.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <p className="text-sm text-white/80">Payments, wallets and account numbers are discussed in these chats.</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <p className="text-sm text-white/80">Some conversations are password protected. Keep passwords private.</p>
              </div>
            </div>

            <button
              onClick={onContinue}
              className="group mt-9 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 text-center text-base font-bold shadow-[0_10px_40px_-8px_rgba(239,68,68,0.8)] transition hover:scale-[1.02] hover:from-red-500 hover:to-amber-500 active:scale-[0.99] sm:text-lg cursor-pointer"
            >
              <span>I understand, and I will keep all conversations secret</span>
              <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </main>

      <div
        className="h-3 w-full shrink-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,#facc15 0 18px,#0a0508 18px 36px)",
        }}
      />
    </div>
  );
}
