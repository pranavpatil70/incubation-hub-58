import { useState } from "react";
import { motion } from "framer-motion";
import { startups } from "@/data/startups";

const FounderDirectory = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleStartups = showAll ? startups : startups.slice(0, 10);

  return (
    <section className="border-t border-border/70 bg-secondary/10 px-6 py-24 md:px-12 lg:px-20" id="founders">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16">
          <p className="font-mono-ui mb-4 text-primary uppercase tracking-widest">Directory</p>
          <h2 className="font-season-mix text-4xl md:text-6xl text-foreground">Founders</h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Founder contacts and startup details organized for quick outreach and ecosystem visibility.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_12px_28px_hsl(var(--foreground)/0.05)]">
          {visibleStartups.map((startup, i) => (
            <motion.div
              key={startup.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group grid grid-cols-12 items-center gap-4 border-b border-border/70 px-3 py-5 transition-colors duration-300 ease-expo hover:bg-secondary/40 md:px-5"
            >
              <div className="col-span-12 md:col-span-5 flex flex-col gap-1">
                <p className="font-medium text-foreground group-hover:text-accent transition-colors duration-300">
                  {startup.name}
                </p>
                <p className="font-mono-ui text-sm text-muted-foreground">
                  {startup.founderNames.length > 0
                    ? startup.founderNames.length <= 2
                      ? startup.founderNames.join(", ")
                      : `${startup.founderNames.slice(0, 2).join(", ")} +${startup.founderNames.length - 2} more`
                    : "—"}
                </p>
                <p className="font-mono-ui text-xs text-muted-foreground/60">Est. {startup.foundingYear}</p>
              </div>

              <div className="col-span-6 md:col-span-3">
                <p className="font-mono-ui text-muted-foreground">{startup.phone}</p>
              </div>
              <div className="col-span-6 md:col-span-2">
                <p className="font-mono-ui text-muted-foreground truncate">{startup.email}</p>
              </div>
              <div className="col-span-12 md:col-span-2 flex justify-end gap-3">
                {startup.website && (
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-ui rounded-full border border-border/70 px-3 py-1 text-muted-foreground transition-colors duration-300 hover:text-accent"
                  >
                    Website
                  </a>
                )}
                {startup.socials.length > 0 && (
                  <a
                    href={startup.socials[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-ui rounded-full border border-border/70 px-3 py-1 text-muted-foreground transition-colors duration-300 hover:text-accent"
                  >
                    Social
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {startups.length > 10 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="rounded-xl border border-border/70 bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {showAll ? "Show Less" : "Explore All"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FounderDirectory;
