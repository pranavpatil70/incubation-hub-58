import { motion } from "framer-motion";
import { Building2, Lightbulb, IndianRupee, Users, Printer, Award } from "lucide-react";

const benefits = [
  {
    icon: Building2,
    title: "Dedicated Workspace",
    description: "3 private cubicles, 1 board room, and dedicated 3D printing space in B Building, Ground Floor.",
  },
  {
    icon: IndianRupee,
    title: "Institute Funding",
    description: "₹8.7L+ disbursed by the institute for company registration and facility enhancement.",
  },
  {
    icon: Award,
    title: "Company Registration",
    description: "5 companies registered under company law with institute support. Full legal and compliance guidance.",
  },
  {
    icon: Lightbulb,
    title: "Mentorship & Guidance",
    description: "Access to faculty mentors, industry experts, and Dr. Manish Sharma as Innovation & Incubation Coordinator.",
  },
  {
    icon: Users,
    title: "Angel Investor Access",
    description: "Direct pipeline to angel investors — 2 startups have already secured external funding.",
  },
  {
    icon: Printer,
    title: "Prototyping Facility",
    description: "On-campus 3D printing and rapid prototyping capabilities to build and iterate on hardware products.",
  },
];

const stats = [
  { value: "20", label: "Startups Incubated" },
  { value: "₹8.7L+", label: "Institute Funding" },
  { value: "5", label: "Companies Registered" },
  { value: "₹33L+", label: "Revenue Generated" },
];

const IncubationBenefits = () => {
  return (
    <section className="px-6 py-24 md:px-12 lg:px-20 bg-secondary/30" id="benefits">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16">
          <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">Why Join Us</p>
          <h2 className="font-season-mix text-4xl md:text-6xl text-foreground">
            Built for Builders
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Inaugurated on 23rd October 2023, the DYPEC Dnyansagar Incubation Hub provides everything 
            student entrepreneurs need to go from idea to market — funding, workspace, mentorship, and investor access.
          </p>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-border mb-16"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card p-8 text-center">
              <p className="font-season-mix text-3xl md:text-4xl text-foreground">{stat.value}</p>
              <p className="font-mono-ui text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-border">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.19, 1, 0.22, 1],
              }}
              className="bg-card p-8 md:p-10"
            >
              <benefit.icon className="w-6 h-6 text-accent mb-5" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold text-foreground mb-3">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Coordinator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 pt-8 border-t border-border"
        >
          <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-2">Coordinator</p>
          <p className="text-xl font-semibold text-foreground">Dr. Manish Sharma</p>
          <p className="text-sm text-muted-foreground mt-1">
            Institute Innovation and Incubation Coordinator · In-charge, DYPEC Dnyansagar Incubation Hub
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default IncubationBenefits;
