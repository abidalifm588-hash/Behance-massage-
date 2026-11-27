import type { Contact } from "./data";

export const MAX_TURNS = 4; // the contact closes the conversation on the 4th new reply

type Intent =
  | "greet"
  | "thanks"
  | "price"
  | "deadline"
  | "payment"
  | "details"
  | "agree"
  | "decline"
  | "question"
  | "other";

function detect(text: string): Intent {
  const t = text.toLowerCase();
  if (/\b(no|not interested|can't|cannot|busy|sorry|later|wait)\b/.test(t) && !/\bno problem\b/.test(t))
    return "decline";
  if (/\$|\b(price|budget|pay|rate|cost|charge|usd|dollar|amount|money|offer|k)\b/.test(t) && /\$|\d|price|budget|rate|cost|charge|amount|offer|how much/.test(t))
    return "price";
  if (/\b(deadline|when|days?|weeks?|hours?|date|time|how long|urgent|soon|tomorrow)\b/.test(t)) return "deadline";
  if (/\b(wallet|upwork|account|id|transfer|payment|paid|send|sent|invoice|bank)\b/.test(t)) return "payment";
  if (/\b(detail|details|what|project|about|scope|requirement|requirements|share|tell|explain|brief|which|how)\b/.test(t))
    return "details";
  if (/\b(thanks?|thank you|appreciate|great)\b/.test(t)) return "thanks";
  if (/\b(yes|yeah|ok|okay|sure|agree|deal|accept|interested|ready|fine|alright|done)\b/.test(t)) return "agree";
  if (/\b(hi|hello|hey|hola|good (morning|evening|afternoon))\b/.test(t)) return "greet";
  if (t.includes("?")) return "question";
  return "other";
}

type Pool = Partial<Record<Intent, string[]>> & { other: string[] };

const POOLS: Record<Contact["id"], Pool> = {
  wie: {
    greet: ["Hello again! Thanks for getting back to me. I have a new project for living.ai and I think you are the right person for it."],
    thanks: ["You are welcome! Working with you has been smooth so far, that is why I came back to you."],
    price: [
      "For this one I can pay $150. It is a full project contract again, and I will send it through My Wallet as soon as I check the work.",
      "I understand $150 may feel low for the work, but if you deliver quickly I can add a small bonus through My Wallet.",
    ],
    deadline: ["No pressure, but if you could deliver within 10 days that would be perfect. You can take extra time if you need it."],
    payment: ["Same as last time. I will transfer via My Wallet after I review everything. I still have your Upwork ID, eff4dcea, saved."],
    details: [
      "I need a new landing page layout for one of our home robots, plus a fix for a cart button bug on living.ai. Again only Python and HTML, please, no other languages.",
      "I will send the page files after you confirm. The main thing is a clean new banner style and a bug-free checkout section.",
    ],
    agree: ["Great, that is good news! I will send you the files shortly so you can start tonight if possible."],
    decline: ["I understand, but I would really prefer you for this. Can you tell me what would make it work for you?"],
    question: ["Good question. Let me think... I believe it will be similar to the last project, so it should be easy for you."],
    other: [
      "I see. Please let me know soon, because I would like to start this project this week.",
      "Understood. Just tell me your final decision so I can plan on my side.",
    ],
  },
  michael: {
    greet: ["Hey! Good to hear from you again. How is everything over there?"],
    thanks: ["No, thank YOU. Honestly it has been a pleasure doing business with you."],
    price: [
      "Business has been good lately. If you have another brand like AREXON, I can pay up to $1,000 for the copyright, no negotiation drama.",
      "I like your work, so I can stretch a little, maybe $1,200 for the next one if the branding is as strong as AREXON.",
    ],
    deadline: ["Whenever you are ready is fine this time. It is not as urgent as AREXON was, but sooner is always better for me."],
    payment: ["Payment will go to My Wallet again, same account number you gave me. Always on time, you know that."],
    details: [
      "I am planning a second brand for my downtown Miami business and would love your creative direction. Do you have anything ready to show me?",
      "I will send a short brief by email. Basically a fresh name, a logo and the full copyright transfer.",
    ],
    agree: ["Perfect! I will prepare the contract and send it to your Gmail. Just sign it and we are done."],
    decline: ["No worries at all, man. Just keep me in mind. The offer stays open for a little while."],
    question: ["Sure, ask me anything. I'm in Miami, it's pretty relaxed here. Let me know what's on your mind."],
    other: [
      "Got it. Let me know what you think, I'm around for a bit.",
      "Sounds good. Tell me whenever you are ready to move forward.",
    ],
  },
  alejandro: {
    greet: ["¡Hola! Thanks for writing back. I wanted to talk about a new project for my business here in Mexico."],
    thanks: ["De nada! I'm glad to be talking with you finally."],
    price: [
      "My budget is around $300 USD for the full project. If the quality is good, there could be more work later.",
      "I can go up to $350 if you can deliver fast. I will pay through My Wallet, like you prefer.",
    ],
    deadline: ["I need it within two weeks, but if you start this week I can be flexible by a few days."],
    payment: ["I can pay through My Wallet or any platform you use. Just send me your account number when we agree."],
    details: [
      "It's a website and logo for my food delivery startup in Mexico City. I need a clean landing page, an order form and a few banners.",
      "I already have the menu and photos ready. I only need someone to design and build the pages in HTML.",
    ],
    agree: ["Excelente! Then let's start. I'll send you the brand colors and menu photos today."],
    decline: ["Está bien, I understand. But please tell me soon, the project is something I want to start quickly."],
    question: ["Of course, ask me anything about the project. I'll answer as clearly as I can."],
    other: [
      "Entiendo. Let me know what you think about it, I'm waiting for your answer.",
      "Okay, perfect. Please tell me when we can start.",
    ],
  },
};

const CLOSINGS: Record<Contact["id"], string> = {
  wie: "It has gotten too late now, and I still do not have a clear confirmation. I am sorry, but I am contacting someone else for this project instead. Thank you for your time.",
  michael: "Hey man, it's gotten way too late on my end and I can't wait any longer. I'm going to contact someone else for this one. Thanks anyway, and take care!",
  alejandro: "Amigo, ya es muy tarde (it has gotten too late) and I need to move forward with my project. I am now contacting someone else instead. Gracias por tu tiempo.",
};

const used: Record<string, number> = {};

export function generateReply(contact: Contact, userText: string, turn: number): string {
  if (turn >= MAX_TURNS) return CLOSINGS[contact.id];
  const pool = POOLS[contact.id];
  const intent = detect(userText);
  const options = pool[intent] ?? pool.other;
  const key = `${contact.id}-${intent}`;
  const idx = used[key] ?? 0;
  used[key] = idx + 1;
  let reply = options[idx % options.length];
  // On the 3rd reply, the contact starts showing impatience
  if (turn === MAX_TURNS - 1) {
    reply += " Please confirm quickly, it is getting late here.";
  }
  return reply;
}

export function replyDelay(text: string) {
  return Math.min(900 + text.length * 14, 3200);
}
