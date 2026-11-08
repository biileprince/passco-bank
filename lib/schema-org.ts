// Comprehensive JSON-LD Schema Markup for Advanced SEO
// Targets: Freelance Web Developer, App Developer, Ghana, Worldwide

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.axiomcraft.dev";
const BUSINESS_NAME = "Axiom Craft";
const OWNER_NAME = "AxiomCraft";
const BUSINESS_EMAIL = "contact@axiomcraft.dev";
const BUSINESS_PHONE = "+233 XX XXX XXXX"; // Update with actual phone

// Main Organization/Local Business Schema
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: BUSINESS_NAME,
    alternateName: [
      "AxiomCraft",
      "Axiom Craft Ghana",
      "AxiomCraft Web Development",
      "Axiom Craft Web Developer",
      "AxiomCraft Ghana",
      "AxiomCraft Freelance Developer",
    ],
    description:
      "Professional freelance web developer and mobile app developer in Ghana. We build stunning websites, e-commerce stores, mobile apps, and custom web applications for businesses worldwide. Get a modern, fast, and SEO-optimized website today.",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/og-image.jpg`,
    email: BUSINESS_EMAIL,
    telephone: BUSINESS_PHONE,
    founder: {
      "@type": "Person",
      name: OWNER_NAME,
    },
    foundingDate: "2020",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressRegion: "Greater Accra",
      addressCountry: "GH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 5.6037,
      longitude: -0.187,
    },
    areaServed: [
      {
        "@type": "Country",
        name: "Ghana",
      },
      {
        "@type": "Country",
        name: "Nigeria",
      },
      {
        "@type": "Country",
        name: "United States",
      },
      {
        "@type": "Country",
        name: "United Kingdom",
      },
      {
        "@type": "Place",
        name: "Worldwide",
      },
    ],
    serviceType: [
      "Web Development",
      "Mobile App Development",
      "E-Commerce Development",
      "Website Design",
      "Custom Software Development",
      "SEO Services",
      "Web Application Development",
    ],
    priceRange: "$500 - $10000",
    paymentAccepted: ["Cash", "Bank Transfer", "Mobile Money", "PayPal"],
    currenciesAccepted: "USD, GHS, EUR, GBP",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: [
      "https://twitter.com/axiomcraft",
      "https://linkedin.com/company/axiomcraft",
      "https://github.com/axiomcraft",
      "https://facebook.com/axiomcraft",
      "https://instagram.com/axiomcraft",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "50",
      bestRating: "5",
      worstRating: "1",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Development Services",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Website Development",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Business Website Development",
                description:
                  "Professional business websites with modern design, SEO optimization, and mobile responsiveness. Perfect for companies in Ghana and worldwide.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "E-Commerce Website Development",
                description:
                  "Full-featured online stores with secure payment processing, inventory management, and shopping cart functionality.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Landing Page Design",
                description:
                  "High-converting landing pages for marketing campaigns, product launches, and lead generation.",
              },
            },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Mobile App Development",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "iOS App Development",
                description:
                  "Native and cross-platform iOS applications for iPhone and iPad.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Android App Development",
                description:
                  "Native and cross-platform Android applications for smartphones and tablets.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "React Native App Development",
                description:
                  "Cross-platform mobile apps built with React Native for iOS and Android.",
              },
            },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Custom Development",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Web Application Development",
                description:
                  "Custom web applications, SaaS platforms, and enterprise software solutions.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "API Development",
                description:
                  "RESTful APIs, GraphQL APIs, and backend development for web and mobile applications.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Website Maintenance",
                description:
                  "Ongoing website maintenance, updates, security patches, and technical support.",
              },
            },
          ],
        },
      ],
    },
  };
}

// Person Schema for Freelancer
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: OWNER_NAME,
    jobTitle: [
      "Freelance Web Developer",
      "Full Stack Developer",
      "Mobile App Developer",
      "Software Engineer",
    ],
    description:
      "Experienced freelance web developer and app developer based in Ghana. Specializing in Next.js, React, React Native, Node.js, and modern web technologies. Available for projects worldwide.",
    url: SITE_URL,
    image: `${SITE_URL}/profile.jpg`,
    email: BUSINESS_EMAIL,
    telephone: BUSINESS_PHONE,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressCountry: "Ghana",
    },
    nationality: {
      "@type": "Country",
      name: "Ghana",
    },
    knowsAbout: [
      "Web Development",
      "Mobile App Development",
      "React.js",
      "Next.js",
      "React Native",
      "Node.js",
      "TypeScript",
      "JavaScript",
      "Python",
      "PostgreSQL",
      "MongoDB",
      "Firebase",
      "AWS",
      "Vercel",
      "E-Commerce Development",
      "SEO Optimization",
      "UI/UX Design",
      "Responsive Web Design",
      "Progressive Web Apps",
      "REST APIs",
      "GraphQL",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Web Developer",
      description:
        "Develops websites and web applications for businesses and individuals",
      occupationLocation: {
        "@type": "Country",
        name: "Ghana",
      },
      skills: [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "Python",
        "PostgreSQL",
        "MongoDB",
      ],
    },
    worksFor: {
      "@type": "Organization",
      name: BUSINESS_NAME,
    },
    sameAs: [
      "https://linkedin.com/in/axiomcraft",
      "https://github.com/axiomcraft",
      "https://twitter.com/axiomcraft",
    ],
  };
}

// Website Schema
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BUSINESS_NAME,
    alternateName: "AxiomCraft - Freelance Web Developer Ghana",
    description:
      "Professional freelance web development and mobile app development services. Get a stunning website or mobile app built by an experienced developer.",
    url: SITE_URL,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: ["en-US", "en-GB"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// Service Schema for specific services
export function generateServiceSchema(service: {
  name: string;
  description: string;
  price?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.name,
    name: service.name,
    description: service.description,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    ...(service.price && {
      offers: {
        "@type": "Offer",
        price: service.price,
        priceCurrency: "USD",
      },
    }),
    ...(service.image && { image: service.image }),
  };
}

// FAQ Schema
export function generateFAQSchema() {
  const faqs = [
    {
      question: "How much does a website cost in Ghana?",
      answer:
        "Website costs vary based on complexity. Basic websites start from $500-$1000, business websites from $1000-$3000, and e-commerce sites from $2000-$5000. Contact us for a custom quote tailored to your needs.",
    },
    {
      question: "How long does it take to build a website?",
      answer:
        "A simple website takes 1-2 weeks, a business website 2-4 weeks, and complex e-commerce or web applications 4-8 weeks. We prioritize quality while meeting your deadlines.",
    },
    {
      question: "Do you build mobile apps?",
      answer:
        "Yes! We develop mobile apps for iOS and Android using React Native and Flutter. We can also build Progressive Web Apps (PWAs) that work on all devices.",
    },
    {
      question: "Can you help with SEO?",
      answer:
        "Absolutely! All our websites are built with SEO best practices including fast loading speeds, mobile optimization, structured data, meta tags, and clean code. We also offer ongoing SEO services.",
    },
    {
      question: "Do you work with clients outside Ghana?",
      answer:
        "Yes, we work with clients worldwide including the USA, UK, Nigeria, and other countries. We use video calls, email, and project management tools for seamless communication.",
    },
    {
      question: "What technologies do you use?",
      answer:
        "We specialize in modern technologies including React, Next.js, Node.js, TypeScript, Python, PostgreSQL, MongoDB, and cloud platforms like AWS and Vercel.",
    },
    {
      question: "Do you offer website maintenance?",
      answer:
        "Yes, we offer ongoing maintenance packages including updates, security patches, backups, content updates, and technical support to keep your website running smoothly.",
    },
    {
      question: "Can you redesign my existing website?",
      answer:
        "Absolutely! We can redesign and modernize your existing website with a fresh look, better performance, improved SEO, and mobile responsiveness.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Breadcrumb Schema
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Blog Post Schema
export function generateBlogPostSchema(post: {
  title: string;
  description: string;
  slug: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      "@type": "Person",
      name: post.author || OWNER_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    ...(post.image && {
      image: {
        "@type": "ImageObject",
        url: post.image,
      },
    }),
    ...(post.category && {
      articleSection: post.category,
    }),
  };
}

// Portfolio/Project Schema
export function generatePortfolioSchema(project: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  technologies?: string[];
  client?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${SITE_URL}/work/${project.slug}`,
    creator: {
      "@id": `${SITE_URL}/#person`,
    },
    ...(project.image && {
      image: project.image,
    }),
    ...(project.technologies && {
      keywords: project.technologies.join(", "),
    }),
    ...(project.client && {
      accountablePerson: project.client,
    }),
    ...(project.url && {
      mainEntityOfPage: project.url,
    }),
  };
}

// Local Business Schema for Ghana-specific SEO
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: `${BUSINESS_NAME} - Web Developer in Ghana`,
    description:
      "Best freelance web developer in Ghana. We build professional websites, e-commerce stores, and mobile apps for businesses in Accra, Kumasi, and across Ghana.",
    url: SITE_URL,
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Accra",
      addressLocality: "Accra",
      addressRegion: "Greater Accra",
      postalCode: "00233",
      addressCountry: "GH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 5.6037,
      longitude: -0.187,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "$$",
    areaServed: [
      { "@type": "City", name: "Accra" },
      { "@type": "City", name: "Kumasi" },
      { "@type": "City", name: "Tema" },
      { "@type": "City", name: "Takoradi" },
      { "@type": "City", name: "Cape Coast" },
      { "@type": "Country", name: "Ghana" },
    ],
  };
}

// How-To Schema for services
export function generateHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Get a Website Built",
    description:
      "Step-by-step guide to getting your professional website built by AxiomCraft",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Contact Us",
        text: "Fill out our contact form or send us an email with your project requirements.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Discovery Call",
        text: "We schedule a free consultation to understand your goals and requirements.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Proposal & Quote",
        text: "We provide a detailed proposal with timeline and pricing for your project.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Design & Development",
        text: "We design and develop your website with regular updates and feedback sessions.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Launch",
        text: "After your approval, we launch your website and provide training and support.",
      },
    ],
  };
}

// Review Schema
export function generateReviewSchema(
  reviews: {
    author: string;
    rating: number;
    review: string;
    date: string;
  }[],
) {
  return reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
    },
    reviewBody: review.review,
    datePublished: review.date,
    itemReviewed: {
      "@id": `${SITE_URL}/#organization`,
    },
  }));
}

// Combined Schema for Homepage
export function generateHomePageSchema() {
  return [
    generateOrganizationSchema(),
    generatePersonSchema(),
    generateWebsiteSchema(),
    generateLocalBusinessSchema(),
    generateFAQSchema(),
    generateHowToSchema(),
  ];
}

// SEO Keywords and Meta Data
export const SEO_KEYWORDS = {
  primary: [
    "axiom craft",
    "axiomcraft",
    "axiom craft ghana",
    "axiom craft web developer",
    "freelance web developer",
    "web developer ghana",
    "freelance developer",
    "hire web developer",
    "website developer",
    "mobile app developer",
    "app developer ghana",
  ],
  secondary: [
    "i need a website",
    "need a website",
    "i need a website developer",
    "i need someone to build my website",
    "looking for web developer",
    "build my website",
    "create my website",
    "make me a website",
    "build my website",
    "create a website",
    "website for my business",
    "e-commerce website",
    "online store development",
    "custom website design",
    "professional web developer",
    "best web developer ghana",
    "affordable web developer",
  ],
  services: [
    "website design",
    "website development",
    "mobile app development",
    "e-commerce development",
    "wordpress development",
    "react developer",
    "next.js developer",
    "full stack developer",
    "frontend developer",
    "backend developer",
  ],
  location: [
    "web developer accra",
    "web developer kumasi",
    "website developer ghana",
    "app developer accra",
    "freelancer ghana",
    "developer in ghana",
    "web development ghana",
    "software developer ghana",
  ],
  intent: [
    "need a website",
    "need a mobile app",
    "get a website",
    "want a website",
    "looking for web developer",
    "hire freelancer",
    "website quote",
    "website cost ghana",
  ],
  longTail: [
    "how much does a website cost in ghana",
    "best freelance web developer in ghana",
    "affordable website developer accra",
    "professional website design ghana",
    "e-commerce website developer ghana",
    "mobile app developer accra ghana",
    "react native developer ghana",
    "next.js developer for hire",
    "custom web application development",
    "small business website ghana",
  ],
  brand: [
    "axiomcraft",
    "axiomcraft web development",
    "axiomcraft ghana",
    "axiomcraft developer",
    "axiomcraft.dev",
    "axiom craft",
    "axiom craft web developer",
  ],
};

// Generate all keywords as a flat array
export function getAllKeywords(): string[] {
  return [
    ...SEO_KEYWORDS.primary,
    ...SEO_KEYWORDS.secondary,
    ...SEO_KEYWORDS.services,
    ...SEO_KEYWORDS.location,
    ...SEO_KEYWORDS.intent,
    ...SEO_KEYWORDS.longTail,
    ...SEO_KEYWORDS.brand,
  ];
}
