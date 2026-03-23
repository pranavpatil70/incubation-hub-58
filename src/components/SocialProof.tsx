import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "The incubation team gave us the right push at the right time, from product direction to market-facing execution.",
    author: "Founder Testimonial",
  },
  {
    quote:
      "Faculty mentorship and legal guidance helped us avoid early mistakes and focus on growth.",
    author: "Incubated Startup Team",
  },
  {
    quote:
      "The ecosystem here combines technical depth with practical startup support in a way that is hard to find.",
    author: "Alumni Entrepreneur",
  },
];

const partners = ["Academic Mentors", "Alumni Network", "Legal Advisor", "Industry Mentors", "Investor Community"];

const SocialProof = () => {
  return (
    <section
      className="bg-[linear-gradient(180deg,hsl(var(--secondary)/0.18)_0%,hsl(var(--background))_60%)] px-6 py-24 md:px-12 lg:px-20"
      id="social-proof"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12">
          <p className="font-mono-ui mb-4 text-primary uppercase tracking-widest">Social Proof</p>
          <h2 className="font-season-mix text-4xl md:text-6xl text-foreground">Trust Built in Public</h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Real founder voices, cross-functional support, and strategic partnerships that help ventures scale with confidence.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.article
              key={item.author}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-3xl border border-border/70 bg-card p-8 shadow-[0_12px_28px_hsl(var(--foreground)/0.05)]"
            >
              <p className="text-foreground leading-relaxed">"{item.quote}"</p>
              <p className="font-mono-ui mt-6 text-sm uppercase tracking-wider text-primary/80">{item.author}</p>
            </motion.article>
          ))}
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-[0_12px_28px_hsl(var(--foreground)/0.05)]">
          <p className="font-mono-ui mb-4 text-primary uppercase tracking-widest">Strategic Partners</p>
          <div className="flex flex-wrap gap-3">
            {partners.map((partner) => (
              <span key={partner} className="rounded-full border border-border/70 bg-background px-4 py-2 text-sm text-foreground">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
