import { motion } from "framer-motion";

const stats = [
  { label: "Active Startups", value: "9" },
  { label: "Industries", value: "7" },
  { label: "Combined Revenue", value: "₹45L+" },
];

const Hero = () => {
  return (
    <section className="min-h-[85svh] flex flex-col justify-end border-b border-border px-6 pb-16 pt-32 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          <p className="font-mono-ui text-muted-foreground mb-6 uppercase tracking-widest">
            DYP Dnyansagar Incubation Foundation
          </p>
          <h1 className="font-season-mix text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground max-w-5xl" style={{ textWrap: "balance" as any }}>
            The Foundation for What's Next.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="mt-10 max-w-2xl"
        >
          <p className="text-lg text-muted-foreground leading-relaxed">
            Incubating 9 student-led ventures at D.Y. Patil College of Engineering, Akurdi.
            From dorm room prototypes to market-ready products.
          </p>
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
