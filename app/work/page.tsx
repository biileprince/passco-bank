import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { GoogleOneTap } from "../components/auth/google-one-tap";
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema-org";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.axiomcraft.dev";

export const metadata: Metadata = {
  title: "Portfolio | Web Projects by AxiomCraft | Ghana Developer",
  description:
    "Explore our portfolio of successful web development and mobile app projects. See case studies of websites, e-commerce stores, and web applications we've built for clients in Ghana and worldwide. Quality work that speaks for itself!",
  keywords: [
    "web development portfolio",
    "website examples ghana",
    "web developer projects",
    "e-commerce website examples",
    "mobile app portfolio",
    "web application case studies",
    "best websites ghana",
    "professional website examples",
    "successful web projects",
  ],
  alternates: {
    canonical: `${SITE_URL}/work`,
  },
  openGraph: {
    title: "Our Work & Portfolio | Web Development Projects by AxiomCraft",
    description:
      "Explore our portfolio of successful web development and mobile app projects. See case studies of websites we've built for clients worldwide.",
    url: `${SITE_URL}/work`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/portfolio-og.jpg`,
        width: 1200,
        height: 630,
        alt: "AxiomCraft Portfolio - Web Development Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work & Portfolio | AxiomCraft",
    description:
      "Explore our portfolio of successful web development and mobile app projects.",
  },
};

async function getProjects(options?: {
  category?: string;
  technology?: string;
}) {
  interface WhereClause {
    published: boolean;
    category?: string;
    technologies?: { contains: string; mode: "insensitive" };
  }

  const where: WhereClause = { published: true };

  if (options?.category) {
    where.category = options.category;
  }
  if (options?.technology) {
    where.technologies = { contains: options.technology, mode: "insensitive" };
  }

  return prisma.portfolioProject.findMany({
    where,
    orderBy: [
      { featured: "desc" },
      { completedAt: "desc" },
      { createdAt: "desc" },
    ],
  });
}

async function getCategories() {
  const projects = await prisma.portfolioProject.findMany({
    where: { published: true, category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });
  return projects.map((p) => p.category).filter(Boolean) as string[];
}

async function getTechnologies() {
  const projects = await prisma.portfolioProject.findMany({
    where: { published: true, technologies: { not: null } },
    select: { technologies: true },
  });

  const techSet = new Set<string>();
  projects.forEach((p) => {
    if (p.technologies) {
      p.technologies.split(",").forEach((t) => techSet.add(t.trim()));
    }
  });

  return Array.from(techSet).sort();
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; technology?: string }>;
}) {
  const params = await searchParams;

  const [projects, categories, technologies] = await Promise.all([
    getProjects({
      category: params.category,
      technology: params.technology,
    }),
    getCategories(),
    getTechnologies(),
  ]);

  const activeCategory = params.category;
  const activeTechnology = params.technology;
  const featuredProjects = projects.filter((p) => p.featured);
  const regularProjects = projects.filter((p) => !p.featured);

  // Generate JSON-LD schemas
  const organizationSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Work", url: `${SITE_URL}/work` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Google One Tap for non-authenticated users */}
      <GoogleOneTap />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-12 sm:py-20 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-500 mb-3 sm:mb-4">
              Our Work
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl">
              A selection of projects we&apos;ve built for clients across
              various industries. Each project is crafted with attention to
              detail and performance.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-6 sm:py-12">
          {/* Filters */}
          <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground mr-2">
                  Category:
                </span>
                <Link
                  href="/work"
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    !activeCategory
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  All
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/work?category=${encodeURIComponent(category)}`}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      activeCategory === category
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}

            {/* Technology Filter */}
            {technologies.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground mr-2">
                  Technology:
                </span>
                <Link
                  href={
                    activeCategory
                      ? `/work?category=${activeCategory}`
                      : "/work"
                  }
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    !activeTechnology
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  All
                </Link>
                {technologies.slice(0, 8).map((tech) => (
                  <Link
                    key={tech}
                    href={`/work?technology=${encodeURIComponent(tech)}${
                      activeCategory ? `&category=${activeCategory}` : ""
                    }`}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      activeTechnology === tech
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {tech}
                  </Link>
                ))}
              </div>
            )}

            {/* Active Filters */}
            {(activeCategory || activeTechnology) && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {activeCategory && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs text-foreground">
                    {activeCategory}
                    <Link
                      href={
                        activeTechnology
                          ? `/work?technology=${activeTechnology}`
                          : "/work"
                      }
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Link>
                  </span>
                )}
                {activeTechnology && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs text-foreground">
                    {activeTechnology}
                    <Link
                      href={
                        activeCategory
                          ? `/work?category=${activeCategory}`
                          : "/work"
                      }
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Link>
                  </span>
                )}
                <Link
                  href="/work"
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Clear all
                </Link>
              </div>
            )}
          </div>

          {/* Projects */}
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-foreground mb-2">
                No projects found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Projects */}
              {featuredProjects.length > 0 &&
                !activeCategory &&
                !activeTechnology && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-foreground">
                      Featured Projects
                    </h2>
                    <div className="grid grid-cols-1 gap-8">
                      {featuredProjects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/work/${project.slug}`}
                          className="block group"
                        >
                          <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-xl border border-border overflow-hidden bg-background hover:border-foreground/20 transition-colors">
                            {project.coverImage ? (
                              <div className="aspect-video lg:aspect-auto lg:h-full overflow-hidden">
                                <Image
                                  src={project.coverImage}
                                  alt={project.title}
                                  width={600}
                                  height={338}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            ) : (
                              <div className="aspect-video lg:aspect-auto lg:h-full bg-muted flex items-center justify-center">
                                <span className="text-muted-foreground">
                                  No image
                                </span>
                              </div>
                            )}
                            <div className="p-6 lg:py-8 flex flex-col justify-center">
                              <div className="flex items-center gap-2 mb-3">
                                {project.category && (
                                  <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                    {project.category}
                                  </span>
                                )}
                                <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                  Featured
                                </span>
                              </div>
                              <h3 className="text-2xl font-bold text-foreground group-hover:text-foreground/80 transition-colors mb-3">
                                {project.title}
                              </h3>
                              {project.description && (
                                <p className="text-muted-foreground mb-4 line-clamp-3">
                                  {project.description}
                                </p>
                              )}
                              {project.technologies && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {project.technologies
                                    .split(",")
                                    .slice(0, 5)
                                    .map((tech) => (
                                      <span
                                        key={tech}
                                        className="px-2 py-0.5 rounded bg-muted/50 text-xs text-muted-foreground"
                                      >
                                        {tech.trim()}
                                      </span>
                                    ))}
                                </div>
                              )}
                              <div className="flex items-center gap-4 mt-auto">
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:gap-3 transition-all">
                                  View Case Study
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                  </svg>
                                </span>
                                {project.liveUrl && (
                                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                    Live
                                  </span>
                                )}
                              </div>
                            </div>
                          </article>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              {/* All Projects Grid */}
              <div className="space-y-6">
                {featuredProjects.length > 0 &&
                  !activeCategory &&
                  !activeTechnology && (
                    <h2 className="text-2xl font-bold text-foreground">
                      All Projects
                    </h2>
                  )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(activeCategory || activeTechnology
                    ? projects
                    : regularProjects
                  ).map((project) => (
                    <Link
                      key={project.id}
                      href={`/work/${project.slug}`}
                      className="block group"
                    >
                      <article className="h-full rounded-xl border border-border overflow-hidden bg-background hover:border-foreground/20 transition-colors">
                        {project.coverImage ? (
                          <div className="aspect-video overflow-hidden">
                            <Image
                              src={project.coverImage}
                              alt={project.title}
                              width={400}
                              height={225}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">
                              No image
                            </span>
                          </div>
                        )}
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            {project.category && (
                              <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                {project.category}
                              </span>
                            )}
                            {project.featured && (
                              <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                Featured
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground/80 transition-colors mb-2">
                            {project.title}
                          </h3>
                          {project.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {project.description}
                            </p>
                          )}
                          {project.technologies && (
                            <div className="flex flex-wrap gap-1">
                              {project.technologies
                                .split(",")
                                .slice(0, 3)
                                .map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-2 py-0.5 rounded bg-muted/50 text-xs text-muted-foreground"
                                  >
                                    {tech.trim()}
                                  </span>
                                ))}
                              {project.technologies.split(",").length > 3 && (
                                <span className="px-2 py-0.5 text-xs text-muted-foreground">
                                  +{project.technologies.split(",").length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
