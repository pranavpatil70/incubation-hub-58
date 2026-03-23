import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t border-border px-6 py-16 md:px-12 lg:px-20" id="about">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12 border border-border bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-2">Build With Us</p>
            <p className="font-season-mix text-2xl text-foreground">Ready to launch your startup with DIF?</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/careers">Apply for Incubation</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="font-season-mix text-2xl text-foreground mb-4">
              DYP Dnyansagar<br />Incubation Foundation
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              D.Y. Patil College of Engineering, Akurdi, Pune, Maharashtra — 411044
            </p>
          </div>
          <div>
            <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">Links</p>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
              <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link>
              <Link to="/testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</Link>
              <Link to="/gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Gallery</Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Homepage</Link>
            </div>
          </div>
          <div>
            <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">Contact</p>
            <p className="text-sm text-muted-foreground">DYP Dnyansagar Incubation Hub</p>
            <p className="text-sm text-muted-foreground">D.Y. Patil College of Engineering</p>
            <p className="text-sm text-muted-foreground">Akurdi, Pune</p>
          </div>
          <div>
            <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">Social Connectivity</p>
            <div className="flex flex-col gap-2">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Instagram</a>
              <a href="mailto:dif@dypcoeakurdi.ac.in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Email</a>
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">X (Twitter)</a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">YouTube</a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border">
          <p className="font-mono-ui text-muted-foreground text-center">
            © {new Date().getFullYear()} DYP Dnyansagar Incubation Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
