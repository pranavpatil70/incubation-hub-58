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
    <section className="px-6 py-24 md:px-12 lg:px-20" id="social-proof">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12">
          <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">Social Proof</p>
          <h2 className="font-season-mix text-4xl md:text-6xl text-foreground">Trust Built in Public</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1px] bg-border mb-12">
          {testimonials.map((item, i) => (
            <motion.article
              key={item.author}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="bg-card p-8"
            >
              <p className="text-foreground leading-relaxed">"{item.quote}"</p>
              <p className="font-mono-ui text-sm uppercase tracking-wider text-muted-foreground mt-6">{item.author}</p>
            </motion.article>
          ))}
        </div>

        <div className="border border-border p-8 bg-card">
          <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">Strategic Partners</p>
          <div className="flex flex-wrap gap-3">
            {partners.map((partner) => (
              <span key={partner} className="px-4 py-2 border border-border text-sm text-foreground bg-background">
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
