export const clinicConfig = {
  clinicName: "CHHAYA CLINIC AND DENTAL CARE",
  doctorName: "Dr. Rakhi Mahesh Sabale",
  doctorQualifications: "B.D.S (M.U.H.S)",
  registrationNo: "A-34905",
  specialization: "Dental Surgeon",
  phoneNumber: "+91 99214 98104",
  cardMobileNumber: "+91 96046 58424",
  whatsappNumber: "919921498104",
  email: "clinic@email.com",
  address:
    "Shop no. 111, Ganesh Park B Wing, Katraj Jakat Naka, Near Bhaji Mandai, Katraj, Pune 411046",
  secondaryAddress:
    "Lane no. 44, Hanuman Mandal, Janta Vashat, Parvati, Pune 411009",
  morningTimings: "10:00 AM - 1:30 PM",
  eveningTimings: "6:00 PM - 9:00 PM",
  googleMapsPlaceUrl:
    "https://www.google.com/maps/place/CHHAYA+CLINIC+AND+DENTAL+CARE/@18.444808,73.859077,14z/data=!4m10!1m2!2m1!1sShop+no.+111,+Ganesh+Park+B+Wing,+Katraj+Jakat+Naka,+Near+Bhaji+Mandai,+Katraj,+Pune+411046!3m6!1s0x3bc2ebf49bb43c11:0x432dc4ec7d73610b!8m2!3d18.4458991!4d73.8584914!15sCltTaG9wIG5vLiAxMTEsIEdhbmVzaCBQYXJrIEIgV2luZywgS2F0cmFqIEpha2F0IE5ha2EsIE5lYXIgQmhhamkgTWFuZGFpLCBLYXRyYWosIFB1bmUgNDExMDQ2WlciVXNob3Agbm8gMTExIGdhbmVzaCBwYXJrIGIgd2luZyBrYXRyYWogamFrYXQgbmFrYSBuZWFyIGJoYWppIG1hbmRhaSBrYXRyYWogcHVuZSA0MTEwNDaSAQ1kZW50YWxfY2xpbmljmgFEQ2k5RFFVbFJRVU52WkVOb2RIbGpSamx2VDIxb05sSXhiSEpoUlZZMFpWaEdlVnBxVm5Sa1NIQkNZbXhOZUZkWVl4QULgAQD6AQQIABAY!16s%2Fg%2F11w1gm2fmw?hl=en-GB&entry=ttu&g_ep=EgoyMDI2MDQxNC4wIKXMDSoASAFQAw%3D%3D",
  googleMapsEmbedUrl: "https://www.google.com/maps?q=18.4458991,73.8584914&z=14&output=embed",
  calendarScheduleId: "YOUR_SCHEDULE_ID",
  googlePlaceId: "YOUR_PLACE_ID",
} as const;

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About Doctor", href: "#about-doctor" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
] as const;

export const trustStats = [
  { value: "5000+", label: "Happy Patients" },
  { value: "15+", label: "Years Experience" },
  { value: "4.9★", label: "Google Rating" },
  { value: "98%", label: "Pain-Free Success Rate" },
] as const;

export const services = [
  {
    name: "Teeth Cleaning & Whitening",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800",
    description: "Remove stains, tartar, and brighten your natural smile.",
  },
  {
    name: "Dental Implants",
    image: "https://images.unsplash.com/photo-1588776814546-1ffbb47ff5bf?w=800",
    description: "Permanent tooth replacement that looks and feels real.",
  },
  {
    name: "Braces & Aligners (Orthodontics)",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800",
    description: "Metal braces, ceramic braces, and clear aligner options.",
  },
  {
    name: "Root Canal Treatment",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800",
    description: "Pain-free RCT with advanced rotary equipment.",
  },
  {
    name: "Cosmetic Dentistry",
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800",
    description: "Veneers, bonding, smile makeovers your dream smile awaits.",
  },
  {
    name: "Pediatric Dentistry",
    image: "https://images.unsplash.com/photo-1588776814546-ec5b4537f4b8?w=800",
    description: "Gentle, fun dental care designed especially for children.",
  },
  {
    name: "Dentures & Crowns",
    image: "https://images.unsplash.com/photo-1571772996211-2f02974562ce?w=800",
    description: "Custom-fitted crowns, bridges, and removable dentures.",
  },
  {
    name: "Gum Disease Treatment",
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=800",
    description: "Deep cleaning, scaling, and periodontal therapy.",
  },
  {
    name: "Dental X-Ray & Diagnostics",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800",
    description: "Digital X-rays with 90% less radiation for accurate diagnosis.",
  },
] as const;

export const heroTrustPoints = [
  "15+ Years Experience",
  "Pain-Free Treatment",
  "NABH Certified",
] as const;

export const reviewPlaceholders = [
  {
    name: "Priya S.",
    initials: "PS",
    text: "The clinic is spotless and the staff explained every step clearly. I felt comfortable from consultation to treatment.",
    date: "2 weeks ago",
  },
  {
    name: "Rohit K.",
    initials: "RK",
    text: "I came in for aligners and the results are amazing. Appointments were always on time and painless.",
    date: "1 month ago",
  },
  {
    name: "Anita M.",
    initials: "AM",
    text: "Dr. Rakhi Sabale is very patient and kind. My root canal was much easier than I expected.",
    date: "3 weeks ago",
  },
  {
    name: "Vikram P.",
    initials: "VP",
    text: "We bring our child here regularly. The pediatric team makes every visit friendly and stress-free.",
    date: "5 days ago",
  },
  {
    name: "Sneha R.",
    initials: "SR",
    text: "Great diagnosis and modern equipment. Booking was simple and follow-up reminders were very helpful.",
    date: "4 weeks ago",
  },
  {
    name: "Neha D.",
    initials: "ND",
    text: "My smile makeover turned out better than expected. Highly recommend for cosmetic dentistry.",
    date: "2 months ago",
  },
] as const;

export const socialLinks = [
  {
    platform: "Instagram",
    handle: "@chhaya_clinic_and_dental_care",
    href: "https://instagram.com/[handle]",
    button: "Follow",
    colorClass: "text-pink-600",
  },
  {
    platform: "Facebook",
    handle: "CHHAYA CLINIC AND DENTAL CARE",
    href: "https://facebook.com/[page]",
    button: "Visit",
    colorClass: "text-blue-600",
  },
  {
    platform: "YouTube",
    handle: "CHHAYA CLINIC AND DENTAL CARE",
    href: "https://youtube.com/@[handle]",
    button: "Watch",
    colorClass: "text-red-600",
  },
  {
    platform: "WhatsApp",
    handle: "+91 99214 98104",
    href: "https://wa.me/919921498104",
    button: "Chat",
    colorClass: "text-green-600",
  },
  {
    platform: "Google Business",
    handle: "Leave us a review",
    href:
      "https://maps.google.com/?q=Shop%20no%20111%2C%20Ganesh%20park%20Jakat%20naka%2C%20near%20bhaji%20mandai%2C%20near%20Katraj%2C%20Santosh%20Nagar%2C%20Katraj%2C%20Pune%2C%20Maharashtra%20411046",
    button: "Review",
    colorClass: "text-sky-600",
  },
] as const;

export const instagramGrid = [
  "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500",
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500",
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500",
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500",
  "https://images.unsplash.com/photo-1588776814546-1ffbb47ff5bf?w=500",
  "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500",
] as const;
