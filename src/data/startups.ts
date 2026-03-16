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
  founderPhotos: string[];
  logo?: string;
}

const driveThumb = (id: string) =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w400`;

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
    founderPhotos: [driveThumb("1bO1c4420lEIoQR6Yl7Y9M9qPMuCQmcJu")],
    logo: driveThumb("1HCSMhqkevoTIxxd06z_oYAA-tyKoTF-9"),
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
    founderPhotos: [driveThumb("1DGRi_62Kse8wJlaKKBa5mn17jd16bSgg")],
    logo: driveThumb("1A81sNbGsfqy9R8-4J_m3Ymd_amfx2j2i"),
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
    founderPhotos: [driveThumb("1zPzNTF3qR7hz9fudIkZZoIwCGAqu8fIu")],
    logo: driveThumb("1X40GnfM6anSBrXnlGtkK_ItyrI_JuAz3"),
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
    founderPhotos: [
      driveThumb("1YOEvIm668TSBJK9_AmvlYExtW4uUq-qR"),
      driveThumb("19ERQTf1lZ2Jaxvjgif9SZ0Uq2ZmvusK5"),
    ],
    logo: driveThumb("1pNdK5-vVdSBwHrXK1NrTGRScIziMF2bK"),
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
    founderPhotos: [
      driveThumb("1f4jzsMLxjCLyOfYT9sqIWT1BaKoFD_Gu"),
      driveThumb("1oocbKbWsbjFGn9dJASt9dmi_jlhn829Y"),
      driveThumb("1RXu0T32ZzSBYhK_8_MNOvHDiqDwo5rSt"),
    ],
    logo: driveThumb("1331ljiGS-SYtXjcugHt8AWkSRlMw5YO-"),
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
    founderPhotos: [driveThumb("1yevFCBg4_tsU7Ty0oYUcmx5csvLkWzhl")],
    logo: driveThumb("16Fb8lX9mWECWyqkPh5ugH0JxghHlU5JQ"),
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
    founderPhotos: [driveThumb("12slLoDHvmB7rpp_mAMRWrPwvYXmG_bvz")],
    logo: driveThumb("1RQF0NrmKXnUVPIZY_5k7xmRnY8Q7JfWO"),
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
    founderPhotos: [
      driveThumb("1xvxDSzHk68fifOfDWsW9mOLumnEFMS2o"),
      driveThumb("1cLIzQBuVLwGK5ro6BW1p0VhX3P9VFhLc"),
      driveThumb("1zpLuXXC3OraVEyBXNsDDvEILjPj6g199"),
    ],
    logo: driveThumb("1yciXQP4yTmwyLYzEeUUbpqdFNbiGEr4S"),
  },
  {
    name: "Warmwrite",
    email: "contact@warmwrite.com",
    address: "Dr. D. Y. Patil College of Engineering, Akurdi, Pune",
    phone: "7028208635",
    achievement: "—",
    foundingYear: "2025",
    socials: ["https://www.instagram.com/warmwritedotcom"],
    website: "https://warmwrite.com",
    description:
      "A platform focused on warm, personalized written communication and content creation.",
    founderPhotos: [driveThumb("1nE12eYaVNqqidVAmR1bOyfVoORGvG7y8")],
    logo: driveThumb("1H3Aq6Saay5HDRLHOREjbVU6cGV5QzmLg"),
  },
];
