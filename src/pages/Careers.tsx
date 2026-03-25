import { BriefcaseBusiness, Clapperboard } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const roles = [
  {
    icon: BriefcaseBusiness,
    title: "Graphic Designer Intern",
    focus: "Poster and visual asset creation",
    openings: "1 Intern",
  },
  {
    icon: Clapperboard,
    title: "Video Editor Intern",
    focus: "High-quality video content production",
    openings: "1 Intern",
  },
];

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(120%_120%_at_10%_0%,hsl(var(--primary)/0.15),transparent_45%),radial-gradient(110%_110%_at_90%_8%,hsl(var(--accent)/0.14),transparent_42%),hsl(var(--background))]">
      <Navbar />
      <section className="mt-24 bg-secondary/10 px-6 py-16 md:px-12 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 grid gap-6 rounded-3xl border border-border/70 bg-card/85 p-8 shadow-[0_18px_45px_hsl(var(--foreground)/0.07)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="font-mono-ui mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-primary uppercase tracking-widest">
                Careers
              </p>
              <h2 className="font-season-mix text-4xl text-foreground md:text-6xl">Internship Opportunities</h2>
              <p className="mt-5 max-w-3xl text-base text-muted-foreground md:text-lg">
                To support the digital rollout, the incubation communication team is hiring the following interns.
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-muted">
              <img
                src="/incubation photos/DSC06905.JPG"
                alt="Creative team collaboration in incubation workspace"
                className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <p className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-foreground">
                Build creative assets for a founder-first ecosystem
              </p>
            </div>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            {roles.map((role, index) => (
              <motion.article
                key={role.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-3xl border border-border/70 bg-card p-8"
              >
                <role.icon className="mb-4 h-6 w-6 text-accent" strokeWidth={1.6} />
                <h3 className="mb-2 text-2xl font-semibold text-foreground">{role.title}</h3>
                <p className="text-muted-foreground">Focus: {role.focus}</p>
                <p className="font-mono-ui mt-5 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs uppercase tracking-widest text-primary">
                  {role.openings}
                </p>
              </motion.article>
            ))}
          </div>

       <div className="rounded-3xl border border-border/70 bg-card p-6 md:p-8 md:flex md:items-center md:justify-between">

  <div>
    <p className="font-mono-ui text-primary uppercase">
      Application Note
    </p>

    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
      Share your portfolio, 2-3 relevant projects, and a short note on why you want to contribute to the
      incubation communication team. Final application link or contact details can be placed here.
    </p>
  </div>

  {/* SVG Illustration */}
<div className="hidden md:flex md:items-center md:justify-center md:min-w-[220px] md:mr-12">

<svg
  width="220"
  height="180"
  viewBox="0 0 200 160"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"

  className="opacity-95 transition-all duration-500 
  drop-shadow-[0_12px_30px_rgba(0,0,0,0.08)]
  hover:drop-shadow-[0_18px_40px_rgba(0,0,0,0.12)]
  hover:scale-105 animate-[float_7s_ease-in-out_infinite]"

  style={{
    filter:"drop-shadow(0 0 14px rgba(79,70,229,0.15))"
  }}
>
    <rect
      x="30"
      y="20"
      width="120"
      height="120"
      rx="18"
      className="fill-primary/10 stroke-primary/30"
      strokeWidth="2"
    />

    <rect
      x="55"
      y="50"
      width="70"
      height="8"
      rx="4"
      className="fill-primary/40"
    />

    <rect
      x="55"
      y="70"
      width="55"
      height="8"
      rx="4"
      className="fill-primary/30"
    />

    <rect
      x="55"
      y="90"
      width="60"
      height="8"
      rx="4"
      className="fill-primary/20"
    />

    <circle
      cx="100"
      cy="30"
      r="10"
      className="fill-primary/30"
    />
  </svg>

</div>

</div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CareersPage;
