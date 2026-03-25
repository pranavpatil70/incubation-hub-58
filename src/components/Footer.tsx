import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer
      className="border-t border-border/70 bg-[linear-gradient(180deg,hsl(var(--secondary)/0.16)_0%,hsl(var(--background))_55%)] px-6 py-16 md:px-12 lg:px-20"
      id="about"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 flex flex-col gap-5 rounded-3xl border border-border/70 bg-card p-6 shadow-[0_14px_32px_hsl(var(--foreground)/0.06)] md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="font-mono-ui mb-2 text-primary uppercase tracking-widest">Build With Us</p>
            <p className="font-season-mix text-2xl text-foreground">Ready to launch your startup with DIF?</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-xl">
              <Link to="/careers">Apply for Incubation</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 rounded-3xl border border-border/70 bg-card p-8 shadow-[0_14px_32px_hsl(var(--foreground)/0.05)] md:grid-cols-4">
         <div>
  <div className="flex items-center gap-3 mb-4">
    <img
      src="/incubation photos/dyp_logo.png"
      alt="Dnyansagar Incubation"
      className="h-[48px] w-[48px] object-contain"
    />

    <h3 className="font-season-mix text-xl text-foreground leading-tight">
      DYP Dnyansagar<br/>Incubation Foundation
    </h3>
  </div>

  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
    D.Y. Patil College of Engineering, Akurdi, Pune, Maharashtra — 411044
  </p>
</div>
          <div>
            <p className="font-mono-ui text-primary uppercase tracking-widest mb-4">Links</p>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
              <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link>
              <Link to="/testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</Link>
              <Link to="/gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Gallery</Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Homepage</Link>
            </div>
          </div>
          <div>
            <p className="font-mono-ui text-primary uppercase tracking-widest mb-4">Contact</p>
            <p className="text-sm text-muted-foreground">DYP Dnyansagar Incubation Hub</p>
            <p className="text-sm text-muted-foreground">D.Y. Patil College of Engineering</p>
            <p className="text-sm text-muted-foreground">Akurdi, Pune</p>
          </div>
          <div>
            <p className="font-mono-ui text-primary uppercase tracking-widest mb-4">Social Connectivity</p>
            <div className="flex flex-col gap-2">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Instagram</a>
              <a href="mailto:dif@dypcoeakurdi.ac.in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Email</a>
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">X (Twitter)</a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">YouTube</a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border/70 pt-8">
          <p className="font-mono-ui text-muted-foreground text-center">
            © {new Date().getFullYear()} DYP Dnyansagar Incubation Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
