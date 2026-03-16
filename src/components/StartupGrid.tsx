import { motion } from "framer-motion";
import { startups } from "@/data/startups";
import { ExternalLink } from "lucide-react";

const StartupGrid = () => {
  return (
    <section className="px-6 py-24 md:px-12 lg:px-20" id="startups">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16">
          <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">Portfolio</p>
          <h2 className="font-season-mix text-4xl md:text-6xl text-foreground">Active Cohort</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-border">
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
              className="group bg-card p-8 md:p-10 transition-all duration-500 ease-expo hover:bg-foreground cursor-default"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-background transition-colors duration-500 ease-expo">
                    {startup.name}
                  </h3>
                  <p className="font-mono-ui text-muted-foreground group-hover:text-background/60 transition-colors duration-500 mt-1">
                    Est. {startup.foundingYear}
                  </p>
                </div>
                {startup.website && (
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground group-hover:text-background/60 hover:!text-accent transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>

              <p className="text-sm text-muted-foreground group-hover:text-background/70 transition-colors duration-500 leading-relaxed mb-6 line-clamp-3">
                {startup.description || startup.achievement}
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-border group-hover:border-background/20 transition-colors duration-500">
                <p className="font-mono-ui text-muted-foreground group-hover:text-background/50 transition-colors duration-500">
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
