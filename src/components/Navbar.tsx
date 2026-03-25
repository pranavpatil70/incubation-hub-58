import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { label: "About Us", path: "/about" },
  { label: "Careers", path: "/careers" },
  { label: "Testimonials", path: "/testimonials" },
  { label: "Gallery", path: "/gallery" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
<div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-6 md:px-12">
       <Link to="/" className="flex items-center gap-3">
  <img 
    src="/incubation photos/dyp_logo.png"
    alt="Dnyansagar Incubation"
    className="h-[52px] w-[52px] object-contain"
  />

  <span className="font-season-mix text-lg text-foreground md:text-xl">
    Dnyansagar Incubation
  </span>
</Link>

        <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/70 p-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={[
                "font-mono-ui rounded-full px-4 py-2 transition-colors duration-300",
           isActive(link.path)
  ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20 shadow-sm"
  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild size="sm" className="rounded-xl">
            <Link to="/careers">Apply for Incubation</Link>
          </Button>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden" aria-label="Open navigation menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] max-w-sm">
            <SheetHeader>
              <SheetTitle className="font-season-mix text-2xl">Navigate</SheetTitle>
            </SheetHeader>

            <div className="mt-8 flex flex-col gap-4">
              {links.map((link) => (
                <SheetClose asChild key={link.path}>
                  <Link
                    to={link.path}
                    className={[
                      "font-mono-ui text-lg transition-colors duration-300",
                      isActive(link.path) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Button asChild>
                <Link to="/careers">Apply for Incubation</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
