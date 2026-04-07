import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const Gallery = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const galleryItems = [
    { image: "DSC06898.JPG", title: "Prototype Workbench", tag: "Makerspace" },
    { image: "DSC06900.JPG", title: "Mentor Huddle", tag: "Mentorship" },
    { image: "DSC06905.JPG", title: "Team Sprint Zone", tag: "Collaboration" },
    { image: "DSC06910.JPG", title: "Pitch Room", tag: "Investor Readiness" },
    { image: "DSC06911.JPG", title: "Idea Lab", tag: "Innovation" },
    { image: "DSC06912.JPG", title: "Community Events", tag: "Network" },
    { image: "DSC06916.JPG", title: "Product Demo Bay", tag: "Validation" },
    { image: "DSC06918.JPG", title: "Knowledge Sessions", tag: "Learning" },
    { image: "DSC06919.JPG", title: "Founders Meetup", tag: "Peer Growth" },
    { image: "DSC06920.JPG", title: "Incubation Offices", tag: "Infrastructure" },
    { image: "DSC06924.JPG", title: "Build to Launch", tag: "Execution" },
    { image: "R_S06893.JPG", title: "Startup Showcase", tag: "Visibility" },
    { image: "R_S06894.JPG", title: "Campus Ecosystem", tag: "Culture" },
  ];

  const selectedImage = selectedImageIndex === null ? null : galleryItems[selectedImageIndex];
  const featuredItem = galleryItems[0];

  return (
    <div className="min-h-screen bg-[radial-gradient(100%_100%_at_20%_0%,hsl(var(--primary)/0.18),transparent_45%),radial-gradient(100%_100%_at_90%_10%,hsl(var(--accent)/0.18),transparent_40%),hsl(var(--background))]">
      <Navbar />
      <section className="mt-24 px-4 py-10 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 rounded-3xl border border-border/60 bg-card/80 p-5 shadow-[0_20px_60px_hsl(var(--foreground)/0.08)] backdrop-blur sm:p-6 md:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div>
            <p className="font-mono-ui mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-primary uppercase tracking-widest">
              Incubation Hub Gallery
            </p>
            <h1 className="font-season-mix text-4xl leading-[0.95] text-foreground sm:text-5xl md:text-6xl">
              Built for Founders,
              <br />
              Designed for Momentum.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              Step into the spaces where ideas become prototypes, teams sharpen their strategy, and startups get
              launch-ready through mentorship, infrastructure, and community.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <p className="text-3xl font-semibold text-foreground">13+</p>
                <p className="mt-1 text-sm text-muted-foreground">Visual snapshots</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <p className="text-3xl font-semibold text-foreground">6</p>
                <p className="mt-1 text-sm text-muted-foreground">Core spaces</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <p className="text-3xl font-semibold text-foreground">1</p>
                <p className="mt-1 text-sm text-muted-foreground">Founder-first ecosystem</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="group relative overflow-hidden rounded-3xl border border-border/70 bg-muted text-left"
            onClick={() => setSelectedImageIndex(0)}
          >
            <img
              src={`/incubation photos/${featuredItem.image}`}
              alt={featuredItem.title}
               className="h-[300px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 sm:h-[380px] lg:h-[420px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <p className="font-mono-ui mb-2 text-xs text-white/90 uppercase">Featured Space</p>
              <p className="text-2xl font-semibold text-white">{featuredItem.title}</p>
              <p className="mt-1 text-sm text-white/85">Tap to preview full image</p>
            </div>
          </button>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 md:px-10 lg:px-16 lg:pb-24 xl:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono-ui text-primary uppercase tracking-wider">Inside the Hub</p>
              <h2 className="font-season-mix mt-2 text-3xl text-foreground md:text-4xl">Visual Storyboard</h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground md:text-base">
              Every frame captures a part of the startup journey, from ideation and mentoring to demo preparation and
              community building.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-muted ${
                  index % 5 === 0 ? "md:col-span-2 lg:col-span-1" : ""
                } ${index % 3 === 0 ? "aspect-[5/4]" : "aspect-[4/3]"}`}
              >
                <img
                  src={`/incubation photos/${item.image}`}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  onClick={() => setSelectedImageIndex(index)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 p-4">
                  <p className="font-mono-ui mb-1 text-[11px] text-white/85 uppercase tracking-wide">{item.tag}</p>
                  <p className="text-lg font-semibold text-white">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
        <DialogContent className="max-w-5xl border-border bg-background p-2">
          <DialogTitle className="sr-only">Gallery Image Preview</DialogTitle>
          {selectedImage && (
            <div className="rounded-lg bg-black p-1">
              <img
                src={`/incubation photos/${selectedImage.image}`}
                alt={selectedImage.title}
                className="max-h-[80vh] w-full rounded-md object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Gallery;
