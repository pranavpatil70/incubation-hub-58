const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 h-16 flex items-center justify-between">
        <a href="/" className="font-season-mix text-lg text-foreground">
          DIF
        </a>
        <div className="flex items-center gap-8">
          <a href="#startups" className="font-mono-ui text-muted-foreground hover:text-foreground transition-colors duration-300">
            Startups
          </a>
          <a href="#founders" className="font-mono-ui text-muted-foreground hover:text-foreground transition-colors duration-300">
            Founders
          </a>
          <a href="#about" className="font-mono-ui text-muted-foreground hover:text-foreground transition-colors duration-300">
            About
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
