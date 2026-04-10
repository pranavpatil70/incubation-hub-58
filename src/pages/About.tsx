import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";

const About = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(120%_120%_at_15%_0%,hsl(var(--primary)/0.16),transparent_45%),radial-gradient(100%_100%_at_92%_10%,hsl(var(--accent)/0.14),transparent_40%),hsl(var(--background))]">
      
      <Navbar />

      <section className="mt-24 px-4 py-12 sm:px-6 md:px-10 lg:px-16 lg:py-20 xl:px-20">
        
        <div className="mx-auto grid max-w-[1400px] gap-10 rounded-3xl border border-border/70 bg-card/80 p-5 shadow-[0_20px_60px_hsl(var(--foreground)/0.08)] backdrop-blur sm:p-6 md:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >

            <p className="font-mono-ui mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-primary uppercase tracking-widest">
              About Us
            </p>

            <h2 className="font-season-mix mb-5 text-3xl text-foreground sm:text-4xl md:text-6xl">
              The Story Behind the Hub
            </h2>

            <p className="mb-4 max-w-xl leading-relaxed text-muted-foreground">
              DYP Dnyansagar Incubation Foundation was created to help ambitious student and early-stage founders
              transform strong ideas into market-ready ventures.
            </p>

            <p className="max-w-xl leading-relaxed text-muted-foreground">
              Our approach combines mentoring, infrastructure, and startup community support so teams can test faster,
              iterate smarter, and launch with confidence.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">

              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <p className="font-season-mix text-3xl text-foreground">26+</p>
                <p className="text-xs text-muted-foreground">Active startups</p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <p className="font-season-mix text-3xl text-foreground">₹75L+</p>
                <p className="text-xs text-muted-foreground">Funding support</p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <p className="font-season-mix text-3xl text-foreground">25+</p>
                <p className="text-xs text-muted-foreground">Labs access</p>
              </div>

            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="space-y-4"
          >

            <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-muted">

              <img
                src="/incubation photos/DSC06910.JPG"
                alt="Incubation leadership and startup interaction"
                className="h-[320px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>

              <p className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-3 py-2 text-sm font-medium text-foreground">
                Leadership vision with founder-first execution
              </p>

            </div>

            {/* Feature Video */}
            <div className="rounded-3xl border border-border/70 bg-card p-5 relative overflow-hidden">

              {/* YouTube accent line */}
              <div className="absolute left-0 top-0 h-full w-[3px] bg-red-500/70"/>

              <p className="font-mono-ui mb-2 text-primary uppercase flex items-center gap-2">
                Feature Video

                <span className="rounded-md bg-red-500 px-2 py-[2px] text-[10px] text-white">
                  YouTube
                </span>

              </p>

              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Watch the official About Us narrative and leadership message. Replace this link with the approved final
                video URL when ready.
              </p>

              {/* Button restored to original style */}
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Open About Us Feature Video
              </a>

            </div>

          </motion.div>

        </div>

      </section>

      <TeamSection />

      <section className="px-4 pb-16 sm:px-6 md:px-10 lg:px-16 lg:pb-20 xl:px-20">

        <div className="mx-auto grid max-w-[1400px] gap-4 md:grid-cols-3">

          <article className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
            <p className="font-mono-ui text-primary uppercase">Mission</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Build a high-trust ecosystem where founders can validate fast and grow with practical support.
            </p>
          </article>

          <article className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
            <p className="font-mono-ui text-primary uppercase">Model</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Access to mentors, domain experts, infrastructure, and partner networks under one framework.
            </p>
          </article>

          <article className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
            <p className="font-mono-ui text-primary uppercase">Outcome</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              From concept to market readiness with measurable traction in funding, product, and revenue.
            </p>
          </article>

        </div>

      </section>

      <Footer />

    </div>
  );
};

export default About;
