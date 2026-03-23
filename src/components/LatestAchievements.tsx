import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Landmark, Rocket } from "lucide-react";

type Achievement = {
  id: "portfolio" | "funding" | "growth";
  title: string;
  value: string;
  subtitle: string;
  description: string;
  yearlyData: { year: string; value: number }[];
  unit: "count" | "lakh";
};

const achievements: Achievement[] = [
  {
    id: "portfolio",
    title: "Startup Portfolio",
    value: "26+",
    subtitle: "Active startups",
    description: "The incubation cell supports a growing and diverse portfolio of active startups.",
    yearlyData: [
      { year: "2023", value: 9 },
      { year: "2024", value: 15 },
      { year: "2025", value: 21 },
      { year: "2026", value: 26 },
    ],
    unit: "count",
  },
  {
    id: "funding",
    title: "Funding Impact",
    value: "Rs. 75+ Lakh",
    subtitle: "Institutional funding secured",
    description: "Institutional funding has enabled faster prototyping, validation, and startup readiness.",
    yearlyData: [
      { year: "2023", value: 8 },
      { year: "2024", value: 22 },
      { year: "2025", value: 51 },
      { year: "2026", value: 75 },
    ],
    unit: "lakh",
  },
  {
    id: "growth",
    title: "Economic Growth",
    value: "Rs. 80+ Lakh",
    subtitle: "YTD incubate revenue",
    description: "Incubated ventures are translating support into strong year-to-date market revenue.",
    yearlyData: [
      { year: "2023", value: 7 },
      { year: "2024", value: 26 },
      { year: "2025", value: 54 },
      { year: "2026", value: 80 },
    ],
    unit: "lakh",
  },
];

const iconById = {
  portfolio: Rocket,
  funding: Landmark,
  growth: TrendingUp,
};

const LatestAchievements = () => {
  const [selectedId, setSelectedId] = useState<Achievement["id"]>("portfolio");
  const detailedViewRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (id: Achievement["id"]) => {
    setSelectedId(id);

    if (window.matchMedia("(max-width: 767px)").matches) {
      requestAnimationFrame(() => {
        detailedViewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const selected = useMemo(
    () => achievements.find((achievement) => achievement.id === selectedId) || achievements[0],
    [selectedId],
  );

  const maxValue = Math.max(...selected.yearlyData.map((item) => item.value));

  return (
    <section className="px-6 py-24 md:px-12 lg:px-20" id="latest-achievements">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8 md:mb-12">
          <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">Latest Achievements</p>
          <h2 className="font-season-mix text-4xl md:text-6xl text-foreground">Interactive Impact Dashboard</h2>
          <p className="mt-4 text-base md:mt-6 md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Click each info tile to view a detailed graphical breakdown of incubation performance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-[1px] md:bg-border mb-8 md:mb-12">
          {achievements.map((achievement) => {
            const Icon = iconById[achievement.id];
            const isSelected = achievement.id === selected.id;

            return (
              <button
                key={achievement.id}
                type="button"
                onClick={() => handleSelect(achievement.id)}
                className={[
                  "text-left p-6 md:p-8 bg-card rounded-2xl md:rounded-none border border-border/70 md:border-0 transition-colors duration-300",
                  isSelected ? "bg-foreground text-background" : "hover:bg-secondary",
                ].join(" ")}
              >
                <Icon className={isSelected ? "text-background/80" : "text-accent"} strokeWidth={1.6} />
                <p className={isSelected ? "mt-5 text-background/70 text-sm" : "mt-5 text-muted-foreground text-sm"}>
                  {achievement.title}
                </p>
                <p className="font-season-mix text-3xl mt-1">{achievement.value}</p>
                <p className={isSelected ? "text-background/70 mt-1" : "text-muted-foreground mt-1"}>
                  {achievement.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        <motion.div
          ref={detailedViewRef}
          key={selected.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="scroll-mt-24 border border-border bg-card p-6 md:p-10"
        >
          <p className="font-mono-ui uppercase tracking-widest text-muted-foreground mb-4">Detailed View</p>
          <h3 className="font-season-mix text-2xl md:text-4xl text-foreground mb-3">{selected.title}</h3>
          <p className="text-muted-foreground max-w-3xl">{selected.description}</p>

          <div className="mt-7 md:mt-10 overflow-x-auto pb-2">
            <div className="flex min-w-max items-end gap-4 md:gap-6">
              {selected.yearlyData.map((item) => {
                const height = Math.max(18, Math.round((item.value / maxValue) * 150));
                return (
                  <div key={item.year} className="w-[82px] md:w-[96px] flex-shrink-0 flex flex-col items-center">
                    <div
                      className="w-full bg-accent/20 border border-accent/30 rounded-sm"
                      style={{ height }}
                      aria-hidden="true"
                    />
                    <p className="font-season-mix text-lg md:text-xl text-foreground mt-3 text-center">
                      {selected.unit === "lakh" ? `Rs. ${item.value}L` : `${item.value}`}
                    </p>
                    <p className="text-muted-foreground text-sm">{item.year}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestAchievements;
