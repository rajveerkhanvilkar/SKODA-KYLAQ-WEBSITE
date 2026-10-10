export interface VehicleSpecItem {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface SpecCategory {
  id: string;
  title: string;
  items: VehicleSpecItem[];
}

export interface ExteriorFeature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  hotspot: { x: number; y: number };
}

export interface InteriorFeature {
  id: string;
  title: string;
  description: string;
  badge: string;
  image: string;
}

export interface InteractiveFeature {
  id: string;
  category: 'lighting' | 'infotainment' | 'comfort' | 'safety';
  title: string;
  tagline: string;
  description: string;
  specs: string[];
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'exterior' | 'studio' | 'details';
  src: string;
  caption: string;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  secondaryHex: string;
  description: string;
}

export const KYLAQ_DATA = {
  name: "Škoda Kylaq",
  tagline: "MADE TO STAND APART.",
  heroOverlayTexts: [
    { threshold: 0.05, text: "THE DARKNESS.", subtext: "MEETS ITS MATCH." },
    { threshold: 0.45, text: "INTRODUCING", subtext: "ŠKODA KYLAQ" },
    { threshold: 0.82, text: "MADE TO", subtext: "STAND APART." }
  ],
  quickStats: [
    { label: "Max Power", value: "115 PS", unit: "1.0 TSI Turbo Engine" },
    { label: "Max Torque", value: "178 Nm", unit: "@ 1,750 - 4,500 rpm" },
    { label: "Boot Volume", value: "446 L", unit: "Class-Leading Space" },
    { label: "Ground Clearance", value: "189 mm", unit: "Commanding Stance" }
  ],
  designStory: {
    headline: "DESIGNED TO COMMAND ATTENTION.",
    paragraph: "Forged under Škoda’s refined 'Modern Solid' design language, the Kylaq combines muscular compact SUV proportions with razor-sharp geometric lines. From its signature 3D radiator grille to its dark-tinted split LED headlamps, every surface reflects engineering precision crafted for urban agility and uncompromised road stance.",
    quote: "Crafted with European precision, tailored for modern conquerors."
  },
  exteriorFeatures: [
    {
      id: "grille",
      title: "Signature 3D Front Grille",
      subtitle: "MODERN SOLID FACE",
      description: "High-gloss black vertical ribs paired with subtle chrome frame accents deliver an unmistakable road presence.",
      image: "/images/features/front_fascia.png",
      hotspot: { x: 48, y: 52 }
    },
    {
      id: "lighting",
      title: "Split LED Matrix Headlamps",
      subtitle: "LIGHTING SIGNATURE",
      description: "Crisp crystal-cut daytime running lamps sitting atop high-intensity LED projection units engineered for peak night visibility.",
      image: "/images/features/headlight_detail.png",
      hotspot: { x: 38, y: 44 }
    },
    {
      id: "bonnet",
      title: "Sculpted Power Bonnet",
      subtitle: "AERODYNAMIC ARCHITECTURE",
      description: "Dual power domes channel airflow over the windshield while asserting a muscular, confident silhouette.",
      image: "/images/features/cinematic_studio.png",
      hotspot: { x: 55, y: 35 }
    },
    {
      id: "wheels",
      title: "17-Inch Alloy Stance",
      subtitle: "DYNAMIC FOUNDATION",
      description: "Precision-machined dual-tone alloy wheels wrapped in wide-profile rubber, backed by 189 mm ground clearance.",
      image: "/images/features/wheel_detail.png",
      hotspot: { x: 28, y: 72 }
    }
  ] as ExteriorFeature[],
  interiorStory: {
    headline: "YOUR SPACE. YOUR PACE.",
    paragraph: "Step into an elevated dark studio atmosphere where ergonomic luxury meets intuitive technology. Featuring ventilated front seats, a digital cockpit display, and premium touch-points, the Kylaq cabin is engineered to keep driver and passengers in complete harmony.",
    features: [
      {
        id: "infotainment",
        title: "10.1-Inch Touchscreen Infotainment",
        description: "Seamless wireless Apple CarPlay and Android Auto integration with high-contrast glass display.",
        badge: "TECHNOLOGY",
        image: "/images/features/teal_interior.png"
      },
      {
        id: "cockpit",
        title: "Virtual Cockpit Digital Display",
        description: "8-inch customizable instrument cluster offering crisp telemetry, navigation cues, and trip diagnostics.",
        badge: "COCKPIT",
        image: "/images/features/teal_interior.png"
      },
      {
        id: "comfort",
        title: "Ventilated Leatherette Seats",
        description: "Front perforated seats with multi-stage cooling to maintain optimal comfort in all climate conditions.",
        badge: "COMFORT",
        image: "/images/features/teal_interior.png"
      }
    ] as InteriorFeature[]
  },
  interactiveFeatures: [
    {
      id: "f1",
      category: "lighting",
      title: "Crystal-Cut LED Illumination",
      tagline: "PRECISION CUT GLASS",
      description: "Inspired by Bohemian glassmaking heritage, the Kylaq features intricate internal facets inside the DRLs that disperse light with brilliant crystalline warmth.",
      specs: ["Full LED Headlamps", "Signature C-Shape Tail Lamps", "Auto Headlamp Function"],
      image: "/images/features/headlight_detail.png"
    },
    {
      id: "f2",
      category: "infotainment",
      title: "Connected Tech Hub",
      tagline: "ALWAYS IN SYNC",
      description: "Stay connected through MyŠkoda Connect featuring remote vehicle diagnostics, geo-fencing, live location tracking, and smart device alerts.",
      specs: ["Wireless Charging Pad", "6-Speaker Audio System", "Dual USB-C Ports"],
      image: "/images/features/teal_interior.png"
    },
    {
      id: "f3",
      category: "comfort",
      title: "Ergonomic Sanctuary",
      tagline: "CLASS-LEADING ERGONOMICS",
      description: "Generous legroom, 446L luggage capacity expandable via 60:40 split rear seats, and electric sunroof for an open-air experience.",
      specs: ["Electric Sunroof", "Automated Climatronic AC", "Rear AC Vents"],
      image: "/images/features/teal_studio.png"
    },
    {
      id: "f4",
      category: "safety",
      title: "MQB-A0-IN Safety Shield",
      tagline: "UNCOMPROMISING PROTECTION",
      description: "Built on a high-rigidity laser-welded body structure reinforced with hot-formed ultra-high-strength steel for maximum occupant safety.",
      specs: ["6 Airbags Standard", "Electronic Stability Control (ESC)", "Multi-Collision Braking"],
      image: "/images/features/front_fascia.png"
    }
  ] as InteractiveFeature[],
  colorOptions: [
    {
      id: "chartreuse",
      name: "Olive Gold / Chartreuse",
      hex: "#C4D600",
      secondaryHex: "#171B19",
      description: "The signature hero launch color showcasing high-energy metallic chartreuse highlights under studio light."
    },
    {
      id: "carbon",
      name: "Carbon Steel Grey",
      hex: "#383E42",
      secondaryHex: "#0D0F10",
      description: "A deep metallic graphite finish asserting stealth, sophistication, and raw urban power."
    },
    {
      id: "silver",
      name: "Brilliant Silver",
      hex: "#D0D5DD",
      secondaryHex: "#1F2428",
      description: "Pure liquid metallic silver highlighting every sharp sculptured crease along the shoulder line."
    },
    {
      id: "red",
      name: "Tornado Red",
      hex: "#C8102E",
      secondaryHex: "#1A0507",
      description: "Vibrant sporty crimson accentuating the athletic stance and bold front bumper geometry."
    },
    {
      id: "white",
      name: "Candy White",
      hex: "#F8F9FA",
      secondaryHex: "#141718",
      description: "High-gloss crisp architectural white creating intense contrast with the gloss-black grille and roof rails."
    }
  ] as ColorOption[],
  gallery: [
    {
      id: "g1",
      title: "Cinematic Dark Reveal",
      category: "studio",
      src: "/images/features/cinematic_studio.png",
      caption: "Led Daytime Running Lamps slicing through dark obsidian shadow."
    },
    {
      id: "g2",
      title: "Front Grille Profile",
      category: "exterior",
      src: "/images/features/front_fascia.png",
      caption: "Signature 3D vertical radiator grille with metallic Škoda badge."
    },
    {
      id: "g3",
      title: "Split Matrix Lamps",
      category: "details",
      src: "/images/features/headlight_detail.png",
      caption: "High-beam projection units paired with crystalline upper DRL elements."
    },
    {
      id: "g4",
      title: "Teal Cockpit Sanctuary",
      category: "details",
      src: "/images/features/teal_interior.png",
      caption: "Futuristic ambient lighting and digital driver display."
    },
    {
      id: "g5",
      title: "Front Wheel & Stance",
      category: "exterior",
      src: "/images/features/wheel_detail.png",
      caption: "Dual-tone alloy wheels grounded with 189 mm ground clearance."
    },
    {
      id: "g6",
      title: "Teal Mood Profile",
      category: "exterior",
      src: "/images/features/teal_studio.png",
      caption: "Clean roof line accented by functional roof rails and privacy glass."
    }
  ] as GalleryItem[],
  specifications: [
    {
      id: "powertrain",
      title: "Engine & Performance",
      items: [
        { label: "Engine Type", value: "1.0L TSI 3-Cylinder Turbo Petrol", highlight: true },
        { label: "Displacement", value: "999 cc" },
        { label: "Max Power Output", value: "115 PS (85 kW) @ 5,000 - 5,500 rpm", highlight: true },
        { label: "Max Torque", value: "178 Nm @ 1,750 - 4,500 rpm", highlight: true },
        { label: "Transmission Options", value: "6-Speed Manual / 6-Speed Torque Converter AT" },
        { label: "Drive Type", value: "Front Wheel Drive (FWD)" },
        { label: "0-100 km/h Acceleration", value: "10.5 Seconds" },
        { label: "Top Speed", value: "188 km/h" }
      ]
    },
    {
      id: "dimensions",
      title: "Dimensions & Capacity",
      items: [
        { label: "Overall Length", value: "3,995 mm" },
        { label: "Overall Width", value: "1,783 mm" },
        { label: "Overall Height", value: "1,619 mm" },
        { label: "Wheelbase", value: "2,566 mm", highlight: true },
        { label: "Ground Clearance", value: "189 mm", highlight: true },
        { label: "Boot Space Volume", value: "446 Liters (Class Leading)", highlight: true },
        { label: "Fuel Tank Capacity", value: "45 Liters" },
        { label: "Turning Radius", value: "5.05 Meters" }
      ]
    },
    {
      id: "safety",
      title: "Safety & Chassis",
      items: [
        { label: "Platform Architecture", value: "MQB-A0-IN High Rigidity Structure", highlight: true },
        { label: "Standard Airbags", value: "6 Airbags (Front, Side & Curtain)", highlight: true },
        { label: "Electronic Stability", value: "ESC + ABS + EBD + HHC" },
        { label: "Braking System", value: "Front Disc Brakes, Rear Drum Brakes" },
        { label: "Child Seat Anchors", value: "ISOFIX Dual Rear Mounts" },
        { label: "Tire Pressure Monitoring", value: "TPMS Standard" },
        { label: "Collision Mitigation", value: "Multi-Collision Braking System" }
      ]
    },
    {
      id: "convenience",
      title: "Infotainment & Comfort",
      items: [
        { label: "Infotainment Display", value: "10.1-Inch Glass Touchscreen", highlight: true },
        { label: "Instrument Cluster", value: "8-Inch Digital Virtual Cockpit", highlight: true },
        { label: "Smartphone Sync", value: "Wireless Apple CarPlay & Android Auto" },
        { label: "Seat Ventilation", value: "Front Perforated Ventilated Seats" },
        { label: "Sunroof", value: "Electric One-Touch Sunroof" },
        { label: "Climate Control", value: "Climatronic Auto AC with Air Purifier" }
      ]
    }
  ] as SpecCategory[],
  dealerships: [
    { city: "Mumbai", name: "Škoda Auto Experience Centre - Worli" },
    { city: "Delhi NCR", name: "Škoda Flagship Showroom - Vasant Kunj" },
    { city: "Bengaluru", name: "Škoda Studio - Indiranagar" },
    { city: "Pune", name: "Škoda Authorised Gallery - Baner" },
    { city: "Hyderabad", name: "Škoda Flagship - Jubilee Hills" },
    { city: "Chennai", name: "Škoda Studio - Anna Nagar" }
  ]
};
