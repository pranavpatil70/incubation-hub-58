import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialProof from "@/components/SocialProof";

const getYouTubeVideoId = (value: string) => {
  const input = value.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  try {
    const url = new URL(input);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "").slice(0, 11);
    }

    if (url.pathname.startsWith("/shorts/")) {
      return (url.pathname.split("/shorts/")[1] || "").slice(0, 11);
    }

    if (url.pathname.startsWith("/embed/")) {
      return (url.pathname.split("/embed/")[1] || "").slice(0, 11);
    }

    if (url.searchParams.has("v")) {
      return (url.searchParams.get("v") || "").slice(0, 11);
    }
  } catch {
    return "";
  }

  return "";
};

const testimonials = [
  {
    id: 1,
    title: "Founder Story 1",
    youtube: "dQw4w9WgXcQ",
    founder: "Founder Coming Soon",
  },
  {
    id: 2,
    title: "Founder Story 2",
    youtube: "dQw4w9WgXcQ",
    founder: "Founder Coming Soon",
  },
  {
    id: 3,
    title: "Founder Story 3",
    youtube: "dQw4w9WgXcQ",
    founder: "Founder Coming Soon",
  },
  {
    id: 4,
    title: "Founder Story 4",
    youtube: "dQw4w9WgXcQ",
    founder: "Founder Coming Soon",
  },
];

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(120%_120%_at_12%_0%,hsl(var(--primary)/0.14),transparent_42%),radial-gradient(120%_120%_at_90%_8%,hsl(var(--accent)/0.12),transparent_42%),hsl(var(--background))]">
      <Navbar />
      <section className="mt-24 px-6 py-16 md:px-12 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 rounded-3xl border border-border/70 bg-card/85 p-8 text-center shadow-[0_18px_45px_hsl(var(--foreground)/0.07)] backdrop-blur md:p-10">
            <p className="font-mono-ui mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-primary uppercase tracking-widest">
              Testimonials
            </p>
            <h2 className="font-season-mix mb-4 text-4xl text-foreground md:text-6xl">Founder Experiences</h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              Hear directly from our startup founders about their journey with the DYPEC Dnyansagar Incubation Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="overflow-hidden rounded-3xl border border-border/70 bg-card"
              >
                <div className="aspect-video bg-secondary/30 flex items-center justify-center relative overflow-hidden border-y border-border/60">
                  {(() => {
                    const videoId = getYouTubeVideoId(testimonial.youtube);

                    if (!videoId) {
                      return (
                        <p className="px-6 text-center text-sm text-muted-foreground">
                          Invalid YouTube link. Add a valid YouTube URL or 11-character video ID.
                        </p>
                      );
                    }

                    return (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                        title={`${testimonial.title} video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        className="h-full w-full"
                      />
                    );
                  })()}
                </div>
                <div className="p-6">
                  <h3 className="font-season-mix mb-2 text-2xl text-foreground">{testimonial.title}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.founder}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-14 rounded-3xl border border-border/70 bg-card p-6 text-center"
          >
            <p className="mx-auto max-w-2xl text-muted-foreground">
              More founder testimonials coming soon! These videos will showcase real experiences from our startup ecosystem.
            </p>
          </motion.div>
        </div>
      </section>
      <SocialProof />
      <Footer />
    </div>
  );
};

export default Testimonials;
