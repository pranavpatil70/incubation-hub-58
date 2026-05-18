import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialProof from "@/components/SocialProof";

const testimonials = [
  {
    id: 1,
    title: "Founder Story 1",
    instagram: "https://www.instagram.com/p/DX3gvqNpNeu/embed",
    founder: "Denivs",
  },
  {
    id: 2,
    title: "Founder Story 2",
    instagram: "https://www.instagram.com/p/DYNOSsJghEP/embed",
    founder: "Founder Coming Soon",
  },
  {
    id: 3,
    title: "Founder Story 3",
    instagram: "https://www.instagram.com/p/DXW212uJy5v/embed",
    founder: "RamaAstra",
  },
  {
    id: 4,
    title: "Founder Story 4",
    instagram: "https://www.instagram.com/p/DXPaggOJYPM/embed",
    founder: "EQvisor",
  },
];

const Testimonials = () => {
  const [selected, setSelected] = useState(null);

  // Close modal on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelected(null);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(120%_120%_at_12%_0%,hsl(var(--primary)/0.14),transparent_42%),radial-gradient(120%_120%_at_90%_8%,hsl(var(--accent)/0.12),transparent_42%),hsl(var(--background))]">
      <Navbar />

      <section className="mt-24 px-4 py-12 sm:px-6 md:px-10 lg:px-16 lg:py-20 xl:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 rounded-3xl border border-border/70 bg-card/85 p-5 text-center shadow-[0_18px_45px_hsl(var(--foreground)/0.07)] backdrop-blur sm:p-6 md:p-10">
            <p className="font-mono-ui mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-primary uppercase tracking-widest">
              Testimonials
            </p>

            <h2 className="font-season-mix mb-4 text-3xl text-foreground sm:text-4xl md:text-6xl">
              Founder Experiences
            </h2>

            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              Hear directly from our startup founders about their journey with
              the DYPEC Dnyansagar Incubation Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="overflow-hidden rounded-3xl border border-border/70 bg-card"
              >
                {/* Clickable video card — opens lightbox */}
                <div
                  className="aspect-video relative overflow-hidden border-y border-border/60 bg-secondary/30 cursor-pointer group"
                  onClick={() => setSelected(testimonial)}
                >
                  {/* Hover overlay with expand icon */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 group-hover:bg-black/45 transition-all duration-300">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 flex flex-col items-center gap-2">
                      <div className="rounded-full bg-white/90 p-4 shadow-xl">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7 text-black"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                          />
                        </svg>
                      </div>
                      <span className="text-white text-sm font-medium drop-shadow">
                        Watch Fullscreen
                      </span>
                    </div>
                  </div>

                  {/* iframe — pointer-events-none so click hits the div above */}
                  <div
                    className="absolute inset-0"
                    style={{
                      marginTop: "-56px",
                      height: "calc(100% + 56px)",
                    }}
                  >
                    <iframe
                      src={testimonial.instagram}
                      title={`${testimonial.title} video`}
                      allowTransparency={true}
                      allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
                      loading="lazy"
                      scrolling="no"
                      className="h-full w-full border-0 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-season-mix mb-2 text-2xl text-foreground">
                    {testimonial.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.founder}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-14 rounded-3xl border border-border/70 bg-card p-5 text-center sm:p-6"
          >
            <p className="mx-auto max-w-2xl text-muted-foreground">
              More founder testimonials coming soon! These videos will showcase
              real experiences from our startup ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      <SocialProof />
      <Footer />

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-border/60 bg-card shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-20 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition-colors"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Fullscreen video with header crop */}
              <div className="aspect-video w-full overflow-hidden bg-black relative">
                <div
                  className="absolute inset-0"
                  style={{
                    marginTop: "-56px",
                    height: "calc(100% + 56px)",
                  }}
                >
                  <iframe
                    src={selected.instagram}
                    title={`${selected.title} fullscreen`}
                    allowTransparency={true}
                    allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
                    className="h-full w-full border-0"
                    scrolling="no"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-season-mix text-xl text-foreground">
                    {selected.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selected.founder}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/50 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Testimonials;