export interface Startup {
  name: string;
  email: string;
  address: string;
  phone: string;
  achievement: string;
  foundingYear: string;
  socials: string[];
  website: string | null;
  description?: string;
}

export const startups: Startup[] = [
  {
    name: "Denivs",
    email: "denivsofficial@gmail.com",
    address: "D.Y. Patil College of Engineering, Akurdi, Pune 411044",
    phone: "7447318961",
    achievement: "First product is ready and second product is in development",
    foundingYear: "2025",
    socials: [
      "https://www.instagram.com/denivs_official",
      "https://youtube.com/@denivs_official",
      "https://x.com/denivs_official",
    ],
    website: "https://denivs.com",
  },
  {
    name: "Reddy Arts Media",
    email: "reddyartsmedia@gmail.com",
    address: "DYP Dnyansagar Incubation Foundation",
    phone: "9766525043",
    achievement: "—",
    foundingYear: "2023",
    socials: ["https://www.instagram.com/reddy_arts_media/"],
    website: "https://reddyartsmedia.com",
  },
  {
    name: "NO-BOT Innovations",
    email: "atharvadinde48@gmail.com",
    address: "D.Y. Patil College of Engineering, Akurdi, Pune 411044",
    phone: "7558261727",
    achievement:
      "Best Hardware Innovation Award – INNOVATIONS 2025 · Winners – RIT Hackathon 2K25 (National Level) · 2nd Rank – UTKARSH 2K25 · 1st Rank – PRAKALP, PIONEER 2K25 · 2nd Rank – Roborastra 2K25",
    foundingYear: "2023",
    socials: [],
    website: null,
  },
  {
    name: "EQvisor Fintech Pvt Ltd",
    email: "sales@eqvisor.in",
    address: "Dnyansagar Incubation Hub, D.Y. Patil College of Engineering, Akurdi, Pune 411044",
    phone: "9175509079",
    achievement: "Best Startup Award",
    foundingYear: "2025",
    socials: [],
    website: "https://www.eqvisor.in",
  },
  {
    name: "Elenco Corporation",
    email: "elencocorporation@gmail.com",
    address: "Pimpri Chinchwad, Pune 411019",
    phone: "9011060514",
    achievement:
      "SPPU Letter of Intent for incubation · Copyright granted for flagship software · ₹10L initial funding LOI from major hotelier",
    foundingYear: "2023",
    socials: ["https://www.linkedin.com/company/elenco-corporation/"],
    website: "https://www.elencocorporation.com",
  },
  {
    name: "RamaAstra Aerospace & Defence",
    email: "ramastraaerospaceanddefencepvt@gmail.com",
    address: "D.Y. Patil College of Engineering",
    phone: "9373742371",
    achievement: "₹10L+ revenue generated",
    foundingYear: "—",
    socials: [
      "https://www.linkedin.com/company/ramaastra-aerospace-and-defence-pvt-ltd/",
    ],
    website: "https://www.ramaastra.com",
  },
  {
    name: "Agri-RANA Automations",
    email: "jaysingingle0147@gmail.com",
    address: "Chikhli, Gandhi Nagar",
    phone: "9834471715",
    achievement: "₹33 Lakhs total sales in two years",
    foundingYear: "2024",
    socials: ["https://www.instagram.com/agrirana_automations"],
    website: "https://www.agri-rana.in",
    description:
      "GSM and IoT-based farm automation devices enabling remote control of irrigation systems, real-time alerts, and data-driven farming decisions.",
  },
  {
    name: "AgriBot",
    email: "agribot.tech.io@gmail.com",
    address: "Akurdi, Pune",
    phone: "9309796279",
    achievement: "2nd Rank – State Level Hackathon at VES Polytechnic, Mumbai",
    foundingYear: "2026",
    socials: [],
    website: null,
    description:
      "AI-powered agricultural technology helping farmers with crop monitoring and guidance in their own language.",
  },
];
