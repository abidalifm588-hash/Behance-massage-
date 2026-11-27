import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Lock, Send, Eye, EyeOff, X, ShieldCheck, KeyRound, CheckCheck, Search } from "lucide-react";
import { CONTACTS, type Contact, type Msg } from "../data";
import { MAX_TURNS, generateReply, replyDelay } from "../reply";

const PASSWORD = "amimealon@2022";

function localTime(tz: string, d = new Date()) {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" }).format(d);
}

function Avatar({ c, size = 48, ring }: { c: Contact; size?: number; ring?: boolean }) {
  const [failed, setFailed] = useState(false);
  const initials = c.name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#1769ff] to-purple-600 ${ring ? "ring-2 ring-emerald-400/70" : ""}`}
      style={{ width: size, height: size }}
    >
      {failed ? (
        <div className="grid h-full w-full place-items-center font-bold text-white" style={{ fontSize: size / 2.6 }}>
          {initials}
        </div>
      ) : (
        <img src={c.avatar} alt={c.name} className="h-full w-full object-cover" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

export default function Messenger() {
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [activeId, setActiveId] = useState<Contact["id"] | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [askPw, setAskPw] = useState(false);
  const [turns, setTurns] = useState<Record<string, number>>({});
  const [ended, setEnded] = useState<Record<string, boolean>>({});
  const [typing, setTyping] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [, tick] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => tick((x) => x + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const active = contacts.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length, typing[activeId ?? ""], activeId]);

  const open = (c: Contact) => {
    if (c.id === "wie" && !unlocked) {
      setAskPw(true);
      return;
    }
    setActiveId(c.id);
    setDraft("");
    setContacts((cs) => cs.map((x) => (x.id === c.id ? { ...x, unread: 0 } : x)));
  };

  const addMsg = (id: Contact["id"], msg: Msg) =>
    setContacts((cs) => cs.map((c) => (c.id === id ? { ...c, messages: [...c.messages, msg] } : c)));

  const send = () => {
    if (!active || !draft.trim() || typing[active.id] || ended[active.id]) return;
    const text = draft.trim();
    const contact = active;
    const turn = (turns[contact.id] ?? 0) + 1;
    setDraft("");
    setTurns((t) => ({ ...t, [contact.id]: turn }));
    addMsg(contact.id, {
      id: `m${Date.now()}`,
      from: "me",
      text,
      day: "Today",
      time: localTime(contact.timeZone),
    });
    setTyping((t) => ({ ...t, [contact.id]: true }));
    const reply = generateReply(contact, text, turn);
    window.setTimeout(() => {
      addMsg(contact.id, {
        id: `r${Date.now()}`,
        from: "them",
        text: reply,
        day: "Today",
        time: localTime(contact.timeZone),
      });
      setTyping((t) => ({ ...t, [contact.id]: false }));
      if (turn >= MAX_TURNS) setEnded((e) => ({ ...e, [contact.id]: true }));
    }, replyDelay(reply));
  };

  const filtered = useMemo(
    () => contacts.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [contacts, query]
  );

  return (
    <div className="flex h-screen w-full bg-[#0b0f17] text-white">
      {/* Sidebar */}
      <aside className={`${active ? "hidden md:flex" : "flex"} w-full flex-col border-r border-white/10 bg-[#0f1520] md:w-[360px] md:shrink-0`}>
        <div className="flex items-center justify-between px-5 pb-3 pt-5">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#1769ff] text-lg font-black">B</div>
            <h1 className="text-xl font-extrabold tracking-tight">Behance</h1>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Private
          </span>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-white/50 focus-within:ring-1 focus-within:ring-[#1769ff]">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search messages"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
          </div>
        </div>
        <p className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">Messages</p>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((c) => {
            const last = c.messages[c.messages.length - 1];
            const isActive = c.id === activeId;
            const locked = c.id === "wie" && !unlocked;
            return (
              <button
                key={c.id}
                onClick={() => open(c)}
                className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition hover:bg-white/5 ${isActive ? "bg-[#1769ff]/15" : ""}`}
              >
                <div className="relative">
                  <Avatar c={c} size={52} />
                  {c.alwaysOnline && (
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#0f1520] bg-emerald-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-semibold">{c.name}</span>
                    <span className="shrink-0 text-[11px] text-white/40">{last.day === "Today" ? last.time : last.day}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex min-w-0 items-center gap-1 truncate text-sm text-white/55">
                      {locked ? (
                        <>
                          <Lock className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                          <span className="truncate text-amber-300/80">Password protected chat</span>
                        </>
                      ) : (
                        <>
                          {last.from === "me" && <CheckCheck className="h-3.5 w-3.5 shrink-0 text-[#4d8dff]" />}
                          <span className="truncate">{last.from === "me" ? "You: " : ""}{last.text}</span>
                        </>
                      )}
                    </p>
                    {c.unread > 0 && (
                      <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-[#1769ff] px-1.5 text-[11px] font-bold">
                        {c.unread}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-white/35">
                    {c.flag} {c.location} · {localTime(c.timeZone)} local
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="border-t border-white/10 px-5 py-3 text-[11px] text-amber-300/80">
          ⚠ Financial transactions happen here. Keep all conversations secret.
        </div>
      </aside>

      {/* Chat */}
      <section className={`${active ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col`}>
        {active ? (
          <>
            <header className="flex items-center gap-3 border-b border-white/10 bg-[#0f1520] px-4 py-3">
              <button onClick={() => setActiveId(null)} className="cursor-pointer rounded-full p-1.5 hover:bg-white/10 md:hidden">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Avatar c={active} size={44} ring={active.alwaysOnline} />
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-semibold leading-tight">{active.name}</h2>
                <p className="flex items-center gap-1.5 truncate text-xs">
                  {active.alwaysOnline ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="font-medium text-emerald-400">Active now</span>
                    </>
                  ) : (
                    <span className="text-white/50">{active.lastSeen}</span>
                  )}
                  <span className="text-white/40">
                    · {active.flag} {active.location} · {localTime(active.timeZone)} ({active.tzLabel})
                  </span>
                </p>
              </div>
              <span className="hidden items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-300 sm:flex">
                <Lock className="h-3 w-3" /> Confidential
              </span>
            </header>

            <div
              className="flex-1 overflow-y-auto px-3 py-4 sm:px-8"
              style={{
                backgroundImage: "radial-gradient(circle at 20% 0%, rgba(23,105,255,0.08), transparent 45%), radial-gradient(circle at 90% 100%, rgba(147,51,234,0.07), transparent 40%)",
              }}
            >
              <div className="mx-auto flex max-w-3xl flex-col gap-1.5">
                <div className="mx-auto mb-3 flex max-w-md items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-center text-[11px] text-amber-200">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  Financial transactions take place here. Keep this conversation strictly secret.
                </div>
                {active.messages.map((msg, i) => {
                  const prev = active.messages[i - 1];
                  const newDay = !prev || prev.day !== msg.day;
                  const mine = msg.from === "me";
                  return (
                    <div key={msg.id} className="flex flex-col">
                      {newDay && (
                        <div className="my-3 self-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/60">
                          {msg.day === "Today" ? "Today" : `${msg.day}, 2025`}
                        </div>
                      )}
                      <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[15px] leading-relaxed shadow-sm sm:max-w-[75%] ${
                            mine ? "rounded-br-md bg-[#1769ff] text-white" : "rounded-bl-md bg-[#1c2433] text-white/95"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                          <p className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${mine ? "text-white/70" : "text-white/40"}`}>
                            {msg.time}
                            {mine && <CheckCheck className="h-3 w-3" />}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {typing[active.id] && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[#1c2433] px-4 py-3">
                      {[0, 150, 300].map((d) => (
                        <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-white/60" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                {ended[active.id] && (
                  <div className="mx-auto mt-4 rounded-lg bg-white/5 px-4 py-2 text-center text-xs text-white/50">
                    {active.name} has left this conversation and is contacting someone else.
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            <footer className="border-t border-white/10 bg-[#0f1520] p-3">
              <div className="mx-auto flex max-w-3xl items-center gap-2">
                <input
                  value={draft}
                  disabled={!!ended[active.id]}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={ended[active.id] ? "Conversation ended" : `Message ${active.name}…`}
                  className="flex-1 rounded-full bg-white/5 px-5 py-3 text-sm outline-none placeholder:text-white/35 focus:ring-1 focus:ring-[#1769ff] disabled:opacity-50"
                />
                <button
                  onClick={send}
                  disabled={!draft.trim() || !!typing[active.id] || !!ended[active.id]}
                  className="grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-[#1769ff] transition hover:bg-[#3b82ff] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-white/50">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-[#1769ff]/15 text-4xl font-black text-[#4d8dff]">B</div>
            <h2 className="text-2xl font-bold text-white">Behance Messages</h2>
            <p className="max-w-sm text-sm">Select a conversation from the left to start chatting. Remember: everything here stays secret.</p>
          </div>
        )}
      </section>

      {askPw && (
        <PasswordModal
          contact={CONTACTS[0]}
          onClose={() => setAskPw(false)}
          onSuccess={() => {
            setUnlocked(true);
            setAskPw(false);
            setActiveId("wie");
            setDraft("");
          }}
        />
      )}
    </div>
  );
}

function PasswordModal({ contact, onClose, onSuccess }: { contact: Contact; onClose: () => void; onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === PASSWORD) onSuccess();
    else {
      setError(true);
      setPw("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <form onSubmit={submit} className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#121a28] p-6 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute right-3 top-3 cursor-pointer rounded-full p-1.5 text-white/50 hover:bg-white/10">
          <X className="h-4 w-4" />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar c={contact} size={72} ring />
            <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-amber-500 text-black ring-4 ring-[#121a28]">
              <Lock className="h-4 w-4" />
            </span>
          </div>
          <h3 className="mt-4 text-lg font-bold">Chat locked</h3>
          <p className="mt-1 text-sm text-white/55">Enter the password to open your conversation with {contact.name}.</p>
        </div>
        <div className={`mt-5 flex items-center gap-2 rounded-xl border bg-white/5 px-3 py-2.5 ${error ? "border-red-500" : "border-white/10"}`}>
          <KeyRound className="h-4 w-4 text-white/40" />
          <input
            autoFocus
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="cursor-pointer text-white/50 hover:text-white">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-400">Incorrect password. Please try again.</p>}
        <button type="submit" className="mt-4 w-full cursor-pointer rounded-xl bg-[#1769ff] py-3 text-sm font-semibold transition hover:bg-[#3b82ff]">
          Unlock conversation
        </button>
      </form>
    </div>
  );
}
