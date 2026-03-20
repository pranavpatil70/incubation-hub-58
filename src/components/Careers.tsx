import { BriefcaseBusiness, Clapperboard } from "lucide-react";

const roles = [
  {
    icon: BriefcaseBusiness,
    title: "Graphic Designer Intern",
    focus: "Poster and visual asset creation",
    openings: "1 Intern",
  },
  {
    icon: Clapperboard,
    title: "Video Editor Intern",
    focus: "High-quality video content production",
    openings: "1 Intern",
  },
];

const Careers = () => {
  return (
    <section className="px-6 py-24 md:px-12 lg:px-20 bg-secondary/20" id="careers">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10">
          <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">Careers</p>
          <h2 className="font-season-mix text-4xl md:text-6xl text-foreground">Internship Opportunities</h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-3xl">
            To support the digital rollout, the incubation communication team is hiring the following interns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-border">
          {roles.map((role) => (
            <article key={role.title} className="bg-card p-8 md:p-10">
              <role.icon className="w-6 h-6 text-accent mb-4" strokeWidth={1.6} />
              <h3 className="text-xl font-semibold text-foreground mb-2">{role.title}</h3>
              <p className="text-muted-foreground">Focus: {role.focus}</p>
              <p className="font-mono-ui text-sm uppercase tracking-widest text-muted-foreground mt-5">{role.openings}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Careers;
