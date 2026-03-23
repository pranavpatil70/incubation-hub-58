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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="font-season-mix text-lg text-foreground">
          Dnyansagar Incubation
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={[
                "font-mono-ui transition-colors duration-300",
                isActive(link.path) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button asChild size="sm">
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
