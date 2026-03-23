import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const Gallery = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const images = [
    "DSC06898.JPG",
    "DSC06900.JPG",
    "DSC06905.JPG",
    "DSC06910.JPG",
    "DSC06911.JPG",
    "DSC06912.JPG",
    "DSC06916.JPG",
    "DSC06918.JPG",
    "DSC06919.JPG",
    "DSC06920.JPG",
    "DSC06924.JPG",
    "R_S06893.JPG",
    "R_S06894.JPG",
  ];

  const selectedImage = selectedImageIndex === null ? null : images[selectedImageIndex];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <section className="mt-24 py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-3">
              Incubation Hub Gallery
            </p>
            <h1 className="font-season-mix text-4xl md:text-5xl text-foreground mb-4">
              Campus Moments and Infrastructure
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Explore the vibrant spaces, facilities, and moments from DYPEC Dnyansagar Incubation Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg cursor-pointer bg-muted aspect-square"
              >
                <img
                  src={`/incubation photos/${image}`}
                  alt={`Gallery image ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImageIndex(index)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
        <DialogContent className="max-w-5xl p-2 border-border bg-background">
          <DialogTitle className="sr-only">Gallery Image Preview</DialogTitle>
          {selectedImage && (
            <img
              src={`/incubation photos/${selectedImage}`}
              alt="Selected gallery image"
              className="w-full h-auto max-h-[80vh] object-contain rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Gallery;
