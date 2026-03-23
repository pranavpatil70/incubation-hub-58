import { motion } from "framer-motion";
import { startups } from "@/data/startups";
import { ExternalLink } from "lucide-react";

const StartupGrid = () => {
  return (
    <section className="px-6 py-24 md:px-12 lg:px-20" id="startups">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16">
          <p className="font-mono-ui mb-4 text-primary uppercase tracking-widest">Portfolio</p>
          <h2 className="font-season-mix text-4xl md:text-6xl text-foreground">Active Cohort</h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            A diverse startup cohort building across domains with measurable traction and founder momentum.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {startups.map((startup, i) => (
            <motion.div
              key={startup.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.19, 1, 0.22, 1],
              }}
              className="group cursor-default rounded-3xl border border-border/70 bg-card p-8 shadow-[0_10px_24px_hsl(var(--foreground)/0.04)] transition-all duration-500 ease-expo hover:-translate-y-0.5 hover:shadow-[0_16px_36px_hsl(var(--foreground)/0.08)] md:p-10"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground">
                    {startup.name}
                  </h3>
                  <p className="font-mono-ui mt-1 text-muted-foreground">
                    Est. {startup.foundingYear}
                  </p>
                </div>
                {startup.website && (
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors duration-300 hover:text-accent"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>

              <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {startup.description || startup.achievement}
              </p>

              {/* Founder Names */}
              {startup.founderNames.length > 0 && (
                <div className="mb-6">
                  <span className="font-mono-ui text-xs uppercase tracking-wider text-primary/80">
                    {startup.founderNames.length === 1 ? "Founder" : "Co-founders"}
                  </span>
                  <p className="mt-1 text-sm text-foreground">
                    {startup.founderNames.length <= 3
                      ? startup.founderNames.join(", ")
                      : `${startup.founderNames.slice(0, 3).join(", ")} +${startup.founderNames.length - 3} more`}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 border-t border-border pt-4">
                <p className="font-mono-ui text-muted-foreground">
                  {startup.email}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StartupGrid;
