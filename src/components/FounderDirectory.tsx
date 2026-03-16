import { motion } from "framer-motion";
import { startups } from "@/data/startups";

const FounderDirectory = () => {
  return (
    <section className="px-6 py-24 md:px-12 lg:px-20 border-t border-border" id="founders">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16">
          <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">Directory</p>
          <h2 className="font-season-mix text-4xl md:text-6xl text-foreground">Founders</h2>
        </div>

        <div className="border-t border-border">
          {startups.map((startup, i) => (
            <motion.div
              key={startup.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group grid grid-cols-12 gap-4 items-center py-5 border-b border-border hover:bg-secondary/50 transition-colors duration-300 ease-expo px-2 md:px-4"
            >
              {/* Founder photo(s) + Name */}
              <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                <div className="flex -space-x-2 shrink-0">
                  {startup.founderPhotos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 rounded-full overflow-hidden border-2 border-background bg-muted relative"
                    >
                      <img
                        src={photo}
                        alt={`${startup.name} founder ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                      <div className="absolute inset-0 items-center justify-center text-xs font-medium text-muted-foreground bg-muted hidden">
                        {startup.name.charAt(0)}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-medium text-foreground group-hover:text-accent transition-colors duration-300">
                    {startup.name}
                  </p>
                  <p className="font-mono-ui text-muted-foreground">Est. {startup.foundingYear}</p>
                </div>
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
                    className="font-mono-ui text-muted-foreground hover:text-accent transition-colors duration-300 underline underline-offset-4"
                  >
                    Website
                  </a>
                )}
                {startup.socials.length > 0 && (
                  <a
                    href={startup.socials[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-ui text-muted-foreground hover:text-accent transition-colors duration-300 underline underline-offset-4"
                  >
                    Social
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FounderDirectory;
