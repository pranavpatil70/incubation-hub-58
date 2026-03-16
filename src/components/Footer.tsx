const Footer = () => {
  return (
    <footer className="border-t border-border px-6 py-16 md:px-12 lg:px-20" id="about">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
              <a href="#startups" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Startups</a>
              <a href="#founders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Founders</a>
            </div>
          </div>
          <div>
            <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">Contact</p>
            <p className="text-sm text-muted-foreground">DYP Dnyansagar Incubation Hub</p>
            <p className="text-sm text-muted-foreground">D.Y. Patil College of Engineering</p>
            <p className="text-sm text-muted-foreground">Akurdi, Pune</p>
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
