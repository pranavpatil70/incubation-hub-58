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
    <section className="flex flex-col border-b border-border px-6 pb-16 pt-24 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          <p className="font-mono-ui text-muted-foreground mb-6 uppercase tracking-widest">
            Scale Bold Ideas Into Real Companies.
          </p>
          <h1 className="font-season-mix text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground max-w-5xl" style={{ textWrap: "balance" as any }}>
            DYP Dnyansagar Incubation Foundation
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="mt-10 max-w-2xl"
        >
          <p className="text-lg text-muted-foreground leading-relaxed">
            DYP Dnyansagar Incubation Foundation powers high-growth ventures with
            dedicated infrastructure, expert mentorship, and strong funding support.
            From first prototype to market acceleration.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/careers">Apply for Incubation</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="mt-16 flex gap-12 md:gap-20"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-season-mix text-3xl md:text-4xl text-foreground">{stat.value}</p>
              <p className="font-mono-ui text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
