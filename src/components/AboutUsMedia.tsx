import { motion } from "framer-motion";

const AboutUsMedia = () => {
  return (
    <section className="px-6 py-24 md:px-12 lg:px-20" id="about-us">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">About Us</p>
          <h2 className="font-season-mix text-4xl md:text-6xl text-foreground mb-6">The Story Behind the Hub</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            This section features the incubation story and leadership voice requested in the meeting,
            including a dedicated "About Us" video by Nakul Reddy with a keynote bit from the Director.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Replace the placeholder link below with the final approved video URL when available.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="border border-border bg-card p-4"
        >
          <div className="aspect-video bg-secondary/60 rounded-sm border border-border flex items-center justify-center">
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-ui text-sm uppercase tracking-wider text-foreground hover:text-accent transition-colors"
            >
              Open About Us Feature Video
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUsMedia;
