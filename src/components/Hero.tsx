import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Active Startups", value: "26+" },
  { label: "Institutional Funding", value: "₹75L+" },
  { label: "Incubate Revenue (YTD)", value: "₹80L+" },
];

const Hero = () => {
  return (
    <section className="border-b border-border/70 px-6 pb-16 pt-24 md:px-12 lg:px-20">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <p className="font-mono-ui mb-5 inline-flex rounded-full bg-primary/10 px-3 py-1 text-primary uppercase tracking-widest">
              Scale Bold Ideas Into Real Companies
            </p>
            <h1 className="font-season-mix max-w-3xl text-5xl text-foreground sm:text-6xl md:text-7xl lg:text-8xl" style={{ textWrap: "balance" as any }}>
              DYP Dnyansagar Incubation Foundation
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="mt-8 max-w-2xl"
          >
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Startup-ready infrastructure, practical mentoring, and a founder community that helps teams move from
              prototype to market faster.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl">
                <Link to="/careers">Apply for Incubation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl bg-background/80">
                <Link to="/gallery">View Campus Gallery</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur">
                <p className="font-season-mix text-3xl text-foreground md:text-4xl">{stat.value}</p>
                <p className="font-mono-ui mt-1 text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-muted sm:col-span-2">
            <img
              src="/incubation photos/DSC06924.JPG"
              alt="Startup founders discussing strategy"
              className="h-[280px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-[340px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/90 px-3 py-2 text-sm font-medium text-foreground">
              Founder-led execution spaces with daily mentoring touchpoints
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-muted">
            <img
              src="/incubation photos/DSC06911.JPG"
              alt="Innovation lab and incubation setup"
              className="h-[210px] w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-muted">
            <img
              src="/incubation photos/DSC06918.JPG"
              alt="Knowledge session with startups"
              className="h-[210px] w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
