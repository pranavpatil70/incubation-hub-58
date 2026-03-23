import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const testimonials = [
  {
    id: 1,
    title: "Founder Story 1",
    videoId: "dQw4w9WgXcQ",
    founder: "Founder Coming Soon",
  },
  {
    id: 2,
    title: "Founder Story 2",
    videoId: "dQw4w9WgXcQ",
    founder: "Founder Coming Soon",
  },
  {
    id: 3,
    title: "Founder Story 3",
    videoId: "dQw4w9WgXcQ",
    founder: "Founder Coming Soon",
  },
  {
    id: 4,
    title: "Founder Story 4",
    videoId: "dQw4w9WgXcQ",
    founder: "Founder Coming Soon",
  },
];

const Testimonials = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <section className="mt-24 px-6 py-24 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12 text-center">
            <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">Testimonials</p>
            <h2 className="font-season-mix text-4xl md:text-6xl text-foreground mb-6">
              Founder Experiences
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Hear directly from our startup founders about their journey with the DYPEC Dnyansagar Incubation Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-border bg-card rounded-lg overflow-hidden"
              >
                <div className="aspect-video bg-secondary/40 flex items-center justify-center relative overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${testimonial.videoId}`}
                    title={testimonial.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="font-season-mix text-xl text-foreground mb-2">{testimonial.title}</h3>
                  <p className="text-muted-foreground text-sm">{testimonial.founder}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-muted-foreground max-w-2xl mx-auto">
              More founder testimonials coming soon! These videos will showcase real experiences from our startup ecosystem.
            </p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Testimonials;
