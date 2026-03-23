import { motion } from "framer-motion";
import { Building2, Cpu, FlaskConical, Square } from "lucide-react";

const facilities = [
  {
    icon: Square,
    title: "7,000 Sq. Ft. Dedicated Space",
    description: "Designed for focused execution with work zones, review spaces, and collaboration corners.",
  },
  {
    icon: Building2,
    title: "8 Centres of Excellence",
    description: "Domain clusters that support cross-functional innovation from concept to deployment.",
  },
  {
    icon: FlaskConical,
    title: "25+ Prototyping Labs",
    description: "Specialized lab ecosystem for hardware and product experimentation.",
  },
  {
    icon: Cpu,
    title: "Technical Resource Access",
    description: "Hands-on access to technical guidance and practical build resources.",
  },
];

const InfrastructureFacilities = () => {
  return (
    <section className="bg-secondary/15 px-6 py-24 md:px-12 lg:px-20" id="infrastructure">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12">
          <p className="font-mono-ui mb-4 text-primary uppercase tracking-widest">
            Infrastructure & Facilities
          </p>
          <h2 className="font-season-mix text-4xl md:text-6xl text-foreground">Built for Execution</h2>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Every core facility is mapped to a founder need: build, test, collaborate, and move to market quickly.
          </p>
        </div>

        <div className="mb-12 grid gap-5 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-muted">
            <img
              src="/incubation photos/DSC06912.JPG"
              alt="Incubation collaboration and workspaces"
              className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-[300px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 text-sm font-medium text-white md:text-base">Collaborative spaces for daily execution</p>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-muted">
            <img
              src="/incubation photos/DSC06916.JPG"
              alt="Prototyping lab and technical setup"
              className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-[300px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 text-sm font-medium text-white md:text-base">Rapid prototyping resources under one roof</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {facilities.map((facility, i) => (
            <motion.div
              key={facility.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-3xl border border-border/70 bg-card p-8 md:p-10"
            >
              <facility.icon className="w-6 h-6 text-accent mb-4" strokeWidth={1.6} />
              <h3 className="text-xl font-semibold text-foreground mb-3">{facility.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{facility.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfrastructureFacilities;
