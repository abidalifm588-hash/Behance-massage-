export type Msg = {
  id: string;
  from: "me" | "them";
  text: string;
  day: string; // label such as "Oct 30" or "Today"
  time: string; // local time of the contact, e.g. "9:14 PM"
};

export type Contact = {
  id: "wie" | "michael" | "alejandro";
  name: string;
  location: string;
  flag: string;
  timeZone: string;
  tzLabel: string;
  avatar: string;
  alwaysOnline: boolean;
  lastSeen?: string;
  locked: boolean;
  unread: number;
  messages: Msg[];
};

let n = 0;
const m = (from: "me" | "them", day: string, time: string, text: string): Msg => ({
  id: `s${n++}`,
  from,
  day,
  time,
  text,
});

const W = (day: string, time: string, text: string) => m("them", day, time, text);
const Me = (day: string, time: string, text: string) => m("me", day, time, text);

export const CONTACTS: Contact[] = [
  {
    id: "wie",
    name: "Wie chan",
    location: "China",
    flag: "🇨🇳",
    timeZone: "Asia/Shanghai",
    tzLabel: "GMT+8",
    avatar:
      "https://images.pexels.com/photos/33369429/pexels-photo-33369429.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=300&w=300&fit=crop",
    alwaysOnline: true,
    locked: true,
    unread: 0,
    messages: [
      W("Oct 30", "9:14 PM", "I want to edit the HTML for the website living.ai and customize a new banner. Are you interested in taking on my project?"),
      Me("Oct 30", "9:21 PM", "Yes, I am interested. Please share the project details."),
      W("Oct 30", "9:33 PM", "I sell home robots on my website, living.ai. I am facing some HTML bug issues on the site that need to be identified and fixed. Only Python and HTML should be used—no other programming languages are allowed. Also, a specific banner needs to be placed in a new style. If you agree, we can move forward."),
      Me("Oct 30", "9:47 PM", "What is the project deadline?"),
      W("Oct 30", "9:52 PM", "Take as much time as you need, no problem, though delivering it by November 21 would be best."),
      Me("Oct 30", "10:06 PM", "Is this hourly work or a full project contract?"),
      W("Oct 30", "10:11 PM", "Full project contract."),
      Me("Oct 30", "10:25 PM", "How much can you pay for the project?"),
      W("Oct 30", "10:29 PM", "$100."),
      Me("Oct 31", "8:42 AM", "If you can do $120, I agree, and the work will be completed on time."),
      W("Oct 31", "9:05 AM", "Alright, I will send the dollars via My Wallet. That is what I use for transactions."),
      Me("Oct 31", "9:18 AM", "Okay, please share the source code."),
      W("Oct 31", "9:26 AM", "Here is the source code link: view-source:https://living.ai/ — Let me know once the work is done, and the banners are highlighted as well."),
      Me("Nov 20", "4:37 PM", "Your work is complete."),
      W("Nov 20", "5:02 PM", "I checked it, great job! Thank you. Please give me your Upwork ID so I can transfer the money."),
      Me("Nov 20", "5:09 PM", "My Upwork ID: eff4dcea"),
      W("Nov 20", "5:31 PM", "I have sent it. Please check My Wallet."),
      Me("Nov 20", "5:44 PM", "Received, thank you."),
      W("Nov 23", "10:26 AM", "I have another project I would like you to work on."),
      Me("Nov 23", "11:03 AM", "I will let you know in a little while."),
    ],
  },
  {
    id: "michael",
    name: "Michael Rivera",
    location: "Miami, USA",
    flag: "🇺🇸",
    timeZone: "America/New_York",
    tzLabel: "Eastern Time",
    avatar:
      "https://images.pexels.com/photos/7752813/pexels-photo-7752813.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=300&w=300&fit=crop",
    alwaysOnline: false,
    lastSeen: "last seen recently",
    locked: false,
    unread: 0,
    messages: [
      W("Nov 24", "3:42 PM", "I want to buy the copyright for the branding 'AREXON'. How much will you charge for the copyright?"),
      Me("Nov 24", "4:10 PM", "I will let you know, give me a little time."),
      W("Nov 26", "11:00 AM", "It is urgent—I need to buy the copyright for that branding, and I can offer you a good amount. Tell me how much you want, and if you want, I am ready to prepare the contract right away."),
      Me("Nov 26", "11:06 AM", "I want $2k."),
      W("Nov 26", "11:12 AM", "I can pay $900."),
      Me("Nov 26", "11:15 AM", "Alright."),
      W("Nov 26", "11:24 AM", "It is already Friday here, so I can only give you until 10:00 AM Saturday according to your Bangladesh time, not a minute more. I have sent the contract to your Gmail—sign it and keep it ready. I will send the money to your My Wallet account on Saturday at 9:00 AM once signed. Remember, I cannot give you any more time after 10:00 AM, so sorry. Please share your account number."),
      Me("Nov 26", "11:31 AM", "eff4dcea"),
      W("Nov 27", "7:15 PM", "I have signed and sent the money. I am really happy working with you. Let me know if you ever visit Miami, I will show you around all of Miami—I live in the downtown area. Thanks!"),
    ],
  },
  {
    id: "alejandro",
    name: "Alejandro Ramírez",
    location: "Mexico",
    flag: "🇲🇽",
    timeZone: "America/Mexico_City",
    tzLabel: "Central Time",
    avatar:
      "https://images.pexels.com/photos/26150470/pexels-photo-26150470.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=300&w=300&fit=crop",
    alwaysOnline: false,
    lastSeen: "last seen yesterday",
    locked: false,
    unread: 1,
    messages: [
      W("Nov 25", "1:48 PM", "Hello! I would like to discuss a new project with you."),
    ],
  },
];
