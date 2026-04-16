"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  Globe,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Star,
  Video,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  clinicConfig,
  instagramGrid,
  navLinks,
  reviewPlaceholders,
  services,
  socialLinks,
  trustStats,
} from "@/app/data/clinic";

const popupStorageKey = "appointmentPopupShown";

const appointmentSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z
    .string()
    .min(10, "Please enter a valid mobile number")
    .max(15, "Please enter a valid mobile number"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  service: z.string().min(1, "Please choose a service"),
  doctor: z.string().optional(),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export function ClinicLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const normalizedPhone = useMemo(() => clinicConfig.phoneNumber.replace(/\D/g, ""), []);
  const totalReviews = reviewPlaceholders.length;

  const whatsappHref = useMemo(
    () =>
      `https://wa.me/${normalizedPhone}?text=Hi%2C+I%27d+like+to+book+an+appointment`,
    [normalizedPhone],
  );

  const phoneHref = useMemo(() => `tel:+${normalizedPhone}`, [normalizedPhone]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      service: "",
      doctor: clinicConfig.doctorName,
      notes: "",
    },
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    reset();
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 6);

      const hasShown = window.sessionStorage.getItem(popupStorageKey) === "true";
      if (y >= 200 && !hasShown) {
        setPopupOpen(true);
        window.sessionStorage.setItem(popupStorageKey, "true");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setReviewsLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (reviewsLoading || prefersReducedMotion || totalReviews < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveReviewIndex((current) => (current + 1) % totalReviews);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, reviewsLoading, totalReviews]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div id="home" className="relative bg-white text-slate-800">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 shadow-md backdrop-blur" : "bg-white/75"
        }`}
      >
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-2" aria-label="Go to homepage">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-sky-100 text-sky-600">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8.5 2.5c1.1 0 2.1.3 3 .8.3.2.7.2 1 0 .9-.5 1.9-.8 3-.8 3.1 0 5.5 2.7 5 5.8-.2 1.5-.8 2.9-1.8 4.1-.9 1.2-1.4 2.7-1.5 4.2-.1 1.2-.4 2.5-1 3.5-.4.6-1.2.9-1.8.7-.6-.2-1-.8-1.1-1.5L13 17c-.1-.6-.5-1-1-1s-.9.4-1 1l-.3 2.3c-.1.7-.5 1.3-1.1 1.5-.6.2-1.4-.1-1.8-.7-.6-1-1-2.3-1-3.5-.1-1.5-.6-3-1.5-4.2-1-1.2-1.6-2.6-1.8-4.1-.5-3.1 1.9-5.8 5-5.8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 sm:text-base">{clinicConfig.clinicName}</p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-700 transition hover:text-sky-600"
                aria-label={`Navigate to ${link.label}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={phoneHref}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-sky-50 px-4 text-sm font-semibold text-sky-700"
              aria-label="Call clinic phone number"
            >
              <Phone className="h-4 w-4" />
              {clinicConfig.phoneNumber}
            </a>
            <a
              href="#appointment"
              className="inline-flex min-h-12 items-center rounded-full bg-sky-500 px-5 text-sm font-semibold text-white transition hover:bg-sky-600"
              aria-label="Book appointment from header"
            >
              Book Appointment
            </a>
          </div>

          <button
            type="button"
            className="grid h-12 w-12 place-items-center rounded-full border border-slate-200 text-slate-700 md:hidden"
            aria-label="Open mobile menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-[70] bg-slate-950/95 p-6 text-white md:hidden"
          >
            <div className="mb-8 flex items-center justify-between">
              <p className="text-lg font-semibold">Menu</p>
              <button
                type="button"
                className="grid h-12 w-12 place-items-center rounded-full border border-white/30"
                aria-label="Close mobile menu"
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex min-h-12 items-center justify-between rounded-xl border border-white/15 px-4 text-base"
                  aria-label={`Navigate to ${link.label}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4" />
                </a>
              ))}
              <a
                href={phoneHref}
                className="mt-3 inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-4 font-semibold text-slate-900"
                aria-label="Call clinic phone number"
              >
                Call {clinicConfig.phoneNumber}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="overflow-hidden pb-24 md:pb-0">
        <section className="relative bg-gradient-to-b from-sky-50 via-white to-white px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-10 lg:pt-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),transparent_40%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-4 lg:grid-cols-2 lg:items-center lg:gap-8">
            <div className="max-w-xl">
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                <motion.a
                  whileTap={{ scale: 0.98 }}
                  animate={prefersReducedMotion ? undefined : { scale: [1, 1.015, 1] }}
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : { repeat: Number.POSITIVE_INFINITY, duration: 1.7, ease: "easeInOut" }
                  }
                  href="#appointment"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-sky-500 px-6 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600 sm:w-auto"
                  aria-label="Book an appointment now"
                >
                  Book an Appointment Now
                  <ChevronRight className="ml-1 h-4 w-4" />
                </motion.a>
                <a
                  href={phoneHref}
                  className="hidden min-h-12 items-center justify-center text-sm font-semibold text-sky-700 underline-offset-4 hover:underline sm:inline-flex sm:text-base"
                  aria-label="Call clinic from hero section"
                >
                  Or call us: {clinicConfig.phoneNumber}
                </a>
              </div>
              <div className="mt-3 hidden flex-col gap-2 sm:flex sm:flex-row">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-emerald-500 px-5 text-sm font-semibold text-white sm:w-auto"
                  aria-label="Contact clinic on WhatsApp"
                >
                  <Image
                    src="/whatsapp-logo.png"
                    alt="WhatsApp"
                    width={18}
                    height={18}
                    className="mr-2 h-[18px] w-[18px]"
                  />
                  WhatsApp Us
                </a>
                <a
                  href={phoneHref}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-sky-500 px-5 text-sm font-semibold text-white sm:w-auto"
                  aria-label="Call clinic now"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </a>
              </div>
            </div>

            <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
              <article className="rounded-3xl border-2 border-sky-200 bg-white p-4 shadow-xl shadow-sky-100">
                <div className="relative h-56 overflow-hidden rounded-2xl sm:h-64">
                  <Image
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1000"
                    alt="Female doctor portrait"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="mt-3">
                  <p className="text-lg font-semibold text-slate-900">{clinicConfig.doctorName}</p>
                  <p className="text-sm text-slate-600">
                    {clinicConfig.doctorQualifications} · {clinicConfig.specialization}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <span className="flex items-center text-amber-400">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </span>
                    500+ smiles transformed
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border-2 border-sky-200 bg-white p-4 shadow-xl shadow-sky-100">
                <div className="relative h-44 overflow-hidden rounded-2xl sm:h-56">
                  <Image
                    src="https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800"
                    alt="Modern clinic interior"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 text-base font-semibold text-slate-900">{clinicConfig.clinicName}</p>
                <p className="mt-1 rounded-xl bg-sky-50 px-3 py-2 text-xs font-medium text-sky-700">
                  Modern Equipment · Sterile Environment · ISO Certified
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="border-y border-sky-100 bg-white px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-x-auto pb-2">
            <div className="grid min-w-[720px] grid-cols-4 gap-3 md:min-w-0">
              {trustStats.map((stat) => (
                <article key={stat.label} className="rounded-2xl border-l-4 border-sky-400 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-bold text-sky-500">{stat.value}</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{stat.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="bg-sky-50/60 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Our Dental Services</h2>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Comprehensive care for every smile, at every age
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.name}
                  className="group rounded-3xl border border-sky-100 bg-white p-4 shadow-sm transition duration-200 hover:scale-[1.02] hover:border-sky-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{service.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{service.description}</p>
                  <a
                    href="#appointment"
                    className="mt-3 inline-flex min-h-12 items-center text-sm font-semibold text-sky-600"
                    aria-label={`Book ${service.name}`}
                  >
                    Book Now
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="appointment" className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Book Your Appointment</h2>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">Pick a date and time that works for you</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-3xl border border-sky-100 bg-sky-50/60 p-5 shadow-sm sm:p-6"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Full Name" error={errors.fullName?.message}>
                    <input
                      {...register("fullName")}
                      className="input"
                      placeholder="Your full name"
                      aria-label="Full name"
                    />
                  </Field>

                  <Field label="Mobile Number" error={errors.phone?.message}>
                    <input
                      {...register("phone")}
                      type="tel"
                      required
                      className="input"
                      placeholder="+91"
                      aria-label="Mobile number"
                    />
                  </Field>

                  <Field label="Email Address" error={errors.email?.message}>
                    <input
                      {...register("email")}
                      type="email"
                      className="input"
                      placeholder="you@example.com"
                      aria-label="Email address"
                    />
                  </Field>

                  <Field label="Service Required" error={errors.service?.message}>
                    <select {...register("service")} className="input" aria-label="Service required">
                      <option value="">Choose a service</option>
                      {services.map((service) => (
                        <option key={service.name} value={service.name}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Preferred Doctor" error={errors.doctor?.message}>
                    <input
                      {...register("doctor")}
                      className="input"
                      placeholder={clinicConfig.doctorName}
                      aria-label="Preferred doctor"
                    />
                  </Field>

                  <Field label="Message / Special Notes" error={errors.notes?.message}>
                    <textarea
                      {...register("notes")}
                      rows={4}
                      className="input resize-none"
                      placeholder="Optional notes"
                      aria-label="Message or special notes"
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-sky-500 px-6 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-75"
                  aria-label="Confirm appointment submission"
                >
                  {isSubmitting ? "Sending..." : "Confirm My Appointment"}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>

                <p className="mt-3 text-center text-xs text-slate-500">🔒 Your data is private and secure</p>
              </form>

              <div className="rounded-3xl border border-sky-100 bg-white p-2 shadow-sm sm:p-4">
                <iframe
                  src={`https://calendar.google.com/calendar/appointments/schedules/${clinicConfig.calendarScheduleId}`}
                  style={{ border: 0, width: "100%", height: "600px" }}
                  frameBorder="0"
                  title="Google Calendar Appointment Scheduler"
                  aria-label="Google Calendar booking widget"
                />
                <div className="mt-4 rounded-2xl bg-sky-50 p-4 text-xs leading-6 text-slate-600">
                  <p className="font-semibold text-slate-800">Admin setup notes</p>
                  <p>Google Calendar → Create → Appointment Schedule</p>
                  <p>Set hours (Mon-Sat, 9am-7pm), buffer 15 min, and 30-day booking window.</p>
                  <p>Enable auto confirmation email and 24h reminder.</p>
                  <p>Replace YOUR_SCHEDULE_ID with your generated schedule id.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about-doctor" className="bg-sky-50/60 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border-2 border-sky-200 bg-white p-3 shadow-sm">
              <div className="relative h-full w-full overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1000"
                  alt="Female doctor profile"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Meet {clinicConfig.doctorName}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  clinicConfig.doctorQualifications,
                  "BDS",
                  clinicConfig.specialization,
                  "Dental Surgeon",
                ].map((badge) => (
                  <span key={badge} className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                    {badge}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                With a patient-first approach and a strong focus on comfort, {clinicConfig.doctorName} combines modern technology with gentle care to deliver predictable, long-lasting results.
              </p>

              <div className="mt-5 space-y-2 text-sm text-slate-700">
                <p className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-sky-600" />
                  {clinicConfig.doctorQualifications}
                </p>
                <p className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-sky-600" />
                  Registration No. {clinicConfig.registrationNo}
                </p>
                <p className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-sky-600" />
                  Specialization: {clinicConfig.specialization}
                </p>
              </div>

              <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">
                  Registration No. {clinicConfig.registrationNo} · Dental Surgeon · Trusted family care
                </p>
              </div>

              <blockquote className="mt-4 rounded-2xl border-l-4 border-sky-400 bg-white p-4 text-sm italic text-slate-700">
                I believe every patient deserves a pain-free, comfortable experience. - {clinicConfig.doctorName}
              </blockquote>
            </div>
          </div>
        </section>

        <section id="reviews" className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">What Our Patients Are Saying</h2>
              <p className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                4.9 ★ on Google - 200+ Reviews
              </p>
            </div>

            {/* TODO: Replace with Google Places API (Place ID: YOUR_PLACE_ID) */}
            {/* GET https://maps.googleapis.com/maps/api/place/details/json?place_id=YOUR_PLACE_ID&fields=reviews&key=YOUR_KEY */}
            {/* Filter: only show reviews with rating >= 4 */}
            {reviewsLoading ? (
              <div className="mx-auto max-w-3xl">
                <div className="h-60 animate-pulse rounded-3xl bg-slate-100" />
              </div>
            ) : (
              <div className="mx-auto max-w-3xl">
                <div className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm sm:p-6">
                  <AnimatePresence mode="wait">
                    <motion.article
                      key={reviewPlaceholders[activeReviewIndex].name}
                      initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -24 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
                            {reviewPlaceholders[activeReviewIndex].initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{reviewPlaceholders[activeReviewIndex].name}</p>
                            <p className="text-xs text-slate-500">{reviewPlaceholders[activeReviewIndex].date}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">Google</span>
                      </div>
                      <div className="mb-2 flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className="h-4 w-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm leading-6 text-slate-600">{reviewPlaceholders[activeReviewIndex].text} ...read more</p>
                      <p className="mt-3 inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                        Verified Google Review
                      </p>
                    </motion.article>
                  </AnimatePresence>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveReviewIndex((current) => (current - 1 + totalReviews) % totalReviews)
                      }
                      className="grid h-10 w-10 place-items-center rounded-full border border-sky-200 text-sky-700 transition hover:bg-sky-50"
                      aria-label="Previous Google review"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveReviewIndex((current) => (current + 1) % totalReviews)}
                      className="grid h-10 w-10 place-items-center rounded-full border border-sky-200 text-sky-700 transition hover:bg-sky-50"
                      aria-label="Next Google review"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2" aria-label="Google reviews slide selectors">
                    {reviewPlaceholders.map((review, index) => (
                      <button
                        key={review.name}
                        type="button"
                        onClick={() => setActiveReviewIndex(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          index === activeReviewIndex ? "w-6 bg-sky-500" : "w-2.5 bg-sky-200"
                        }`}
                        aria-label={`Go to review ${index + 1}`}
                      />
                    ))}
                  </div>

                  <a
                    href={clinicConfig.googleMapsPlaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center rounded-full bg-sky-500 px-4 text-xs font-semibold text-white transition hover:bg-sky-600 sm:text-sm"
                    aria-label="Open all Google reviews"
                  >
                    View Google Reviews
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="contact" className="bg-sky-50/60 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 sm:text-3xl">Find Us</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <iframe
                  src={clinicConfig.googleMapsEmbedUrl}
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: "16px" }}
                  title="Clinic location map"
                  aria-label="Google Maps clinic location"
                  allowFullScreen
                />
                <a
                  href={clinicConfig.googleMapsPlaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-12 items-center rounded-full bg-sky-500 px-5 text-sm font-semibold text-white"
                  aria-label="Open directions in Google Maps"
                >
                  Get Directions
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
                <div className="space-y-4 text-sm text-slate-700">
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-sky-600" />
                    {clinicConfig.address}
                  </p>
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-sky-600" />
                    {clinicConfig.secondaryAddress}
                  </p>
                  <a href={phoneHref} className="flex min-h-12 items-center gap-3" aria-label="Call clinic">
                    <Phone className="h-5 w-5 text-sky-600" />
                    {clinicConfig.phoneNumber}
                  </a>
                  <p className="flex min-h-12 items-center gap-3 text-slate-700">
                    <Phone className="h-5 w-5 text-sky-600" />
                    Card mobile: {clinicConfig.cardMobileNumber}
                  </p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 items-center gap-3"
                    aria-label="Open WhatsApp chat"
                  >
                    <MessageCircle className="h-5 w-5 text-sky-600" />
                    {clinicConfig.phoneNumber}
                  </a>
                  <a href={`mailto:${clinicConfig.email}`} className="flex min-h-12 items-center gap-3" aria-label="Send email to clinic">
                    <Mail className="h-5 w-5 text-sky-600" />
                    {clinicConfig.email}
                  </a>
                  <div className="rounded-2xl bg-sky-50 p-4">
                    <p className="mb-1 flex items-center gap-2 font-semibold text-slate-900">
                      <Clock3 className="h-4 w-4 text-sky-600" />
                      Working Hours
                    </p>
                    <p>Morning: {clinicConfig.morningTimings}</p>
                    <p>Evening: {clinicConfig.eveningTimings}</p>
                  </div>
                </div>
                <a
                  href="#appointment"
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-sky-500 px-6 text-sm font-semibold text-white"
                  aria-label="Book appointment from contact section"
                >
                  Book Appointment
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Follow Us For Daily Smile Tips</h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {socialLinks.map((item) => (
                <article key={item.platform} className="rounded-2xl border border-sky-100 bg-sky-50/40 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <SocialIcon platform={item.platform} colorClass={item.colorClass} />
                    <p className="text-sm font-bold text-slate-900">{item.platform}</p>
                  </div>
                  <p className="text-xs text-slate-600">{item.handle}</p>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-12 items-center text-sm font-semibold text-sky-600"
                    aria-label={`Open ${item.platform} profile`}
                  >
                    {item.button}
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
              {instagramGrid.map((src, index) => (
                <div key={src + index} className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={src}
                    alt={`Clinic social media visual ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 px-4 py-12 text-slate-200 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-white">{clinicConfig.clinicName}</p>
            <p className="mt-2 text-sm text-slate-400">Modern, compassionate dental care for every generation.</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Services</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-400">
              {services.slice(0, 4).map((service) => (
                <li key={service.name}>{service.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Quick Links</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-400">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} aria-label={`Navigate to ${link.label}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Contact</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-400">
              <li>{clinicConfig.phoneNumber}</li>
              <li>{clinicConfig.cardMobileNumber}</li>
              <li>{clinicConfig.email}</li>
              <li>{clinicConfig.address}</li>
              <li>{clinicConfig.secondaryAddress}</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2025 {clinicConfig.clinicName}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" aria-label="Open privacy policy">
              Privacy Policy
            </a>
            <a href="#" aria-label="Open terms and conditions">
              Terms
            </a>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-5 right-4 z-[60] flex flex-col gap-3 md:hidden">
        <div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white"
            aria-label="Open WhatsApp chat"
          >
            <Image
              src="/whatsapp-logo.png"
              alt="WhatsApp"
              width={18}
              height={18}
              className="mr-2 h-[18px] w-[18px]"
            />
            WhatsApp Us
          </a>
        </div>
        <div>
          <a
            href={phoneHref}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-sky-500 px-4 text-sm font-semibold text-white"
            aria-label="Call clinic now"
          >
            <Phone className="mr-2 h-4 w-4" />
            Call Now
          </a>
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-[60] hidden flex-col gap-3 md:flex">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg"
          aria-label="Chat with us on WhatsApp"
          title="Chat with us"
        >
          <Image src="/whatsapp-logo.png" alt="WhatsApp" width={24} height={24} className="h-6 w-6" />
          <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1 text-xs text-white group-hover:block">
            Chat with us
          </span>
        </a>
        <a
          href={phoneHref}
          className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg"
          aria-label="Call us now"
          title="Call us now"
        >
          <Phone className="h-6 w-6" />
          <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1 text-xs text-white group-hover:block">
            Call us now
          </span>
        </a>
      </div>

      <AnimatePresence>
        {popupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-slate-900/65 px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Free smile checkup offer"
          >
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
              className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl sm:p-6"
            >
              <button
                type="button"
                className="ml-auto grid h-12 w-12 place-items-center rounded-full border border-slate-200"
                onClick={() => setPopupOpen(false)}
                aria-label="Close appointment popup"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-bold text-slate-900">Get Your Free Smile Checkup Today! 😊</h3>
              <p className="mt-2 text-sm text-slate-600">
                Limited slots available this week. Book in 60 seconds.
              </p>
              <input
                type="text"
                placeholder="Mobile number or name"
                className="input mt-4"
                aria-label="Mobile number or name"
              />
              <a
                href="#appointment"
                onClick={() => setPopupOpen(false)}
                className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-sky-500 px-5 text-sm font-semibold text-white"
                aria-label="Book free appointment from popup"
              >
                Book My Free Appointment
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700 md:col-span-1">
      <span className="mb-1 block">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}

function SocialIcon({ platform, colorClass }: { platform: string; colorClass: string }) {
  if (platform === "Instagram") {
    return <Camera className={`h-4 w-4 ${colorClass}`} />;
  }

  if (platform === "Facebook") {
    return <Globe className={`h-4 w-4 ${colorClass}`} />;
  }

  if (platform === "YouTube") {
    return <Video className={`h-4 w-4 ${colorClass}`} />;
  }

  if (platform === "WhatsApp") {
    return <MessageCircle className={`h-4 w-4 ${colorClass}`} />;
  }

  return <CalendarDays className={`h-4 w-4 ${colorClass}`} />;
}
