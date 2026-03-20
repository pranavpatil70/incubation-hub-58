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
    <section className="px-6 py-24 md:px-12 lg:px-20 bg-secondary/20" id="infrastructure">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12">
          <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">
            Infrastructure & Facilities
          </p>
          <h2 className="font-season-mix text-4xl md:text-6xl text-foreground">Built for Execution</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-border">
          {facilities.map((facility, i) => (
            <motion.div
              key={facility.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="bg-card p-8 md:p-10"
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
