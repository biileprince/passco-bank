import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  generatePortfolioSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema-org";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.axiomcraft.dev";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  return prisma.portfolioProject.findUnique({
    where: { slug, published: true },
  });
}

async function getRelatedProjects(project: {
  id: string;
  category: string | null;
  technologies: string | null;
}) {
  const techArray = project.technologies?.split(",").map((t) => t.trim()) || [];

  return prisma.portfolioProject.findMany({
    where: {
      published: true,
      id: { not: project.id },
      OR: [
        project.category ? { category: project.category } : {},
        ...techArray.map((tech) => ({
          technologies: { contains: tech, mode: "insensitive" as const },
        })),
      ].filter((obj) => Object.keys(obj).length > 0),
    },
    take: 3,
    orderBy: { completedAt: "desc" },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.portfolioProject.findUnique({
    where: { slug, published: true },
  });

  if (!project) {
    return { title: "Project Not Found | AxiomCraft" };
  }

  const technologies =
    project.technologies?.split(",").map((t) => t.trim()) || [];

  return {
    title: `${project.title} | Web Development Case Study | AxiomCraft Portfolio`,
    description:
      project.description ||
      `View the ${project.title} case study. See how AxiomCraft built this ${
        project.category || "web"
      } project using ${
        technologies.slice(0, 3).join(", ") || "modern technologies"
      }.`,
    keywords: [
      project.title.toLowerCase(),
      project.category?.toLowerCase() || "web development",
      ...technologies.map((t) => t.toLowerCase()),
      "case study",
      "portfolio",
      "web project",
    ],
    alternates: {
      canonical: `${SITE_URL}/work/${slug}`,
    },
    openGraph: {
      title: `${project.title} | AxiomCraft Portfolio`,
      description:
        project.description ||
        `View the ${project.title} case study on AxiomCraft`,
      images: project.coverImage
        ? [
            {
              url: project.coverImage,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : undefined,
      type: "article",
      url: `${SITE_URL}/work/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | AxiomCraft Portfolio`,
      description:
        project.description ||
        `View the ${project.title} case study on AxiomCraft`,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(project);

  const technologies =
    project.technologies?.split(",").map((t) => t.trim()) || [];
  let images: string[] = [];

  // Generate JSON-LD schemas
  const portfolioSchema = generatePortfolioSchema({
    title: project.title,
    description: project.description || "",
    slug: project.slug,
    image: project.coverImage || undefined,
    technologies,
    client: project.client || undefined,
    url: project.liveUrl || undefined,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Work", url: `${SITE_URL}/work` },
    { name: project.title, url: `${SITE_URL}/work/${project.slug}` },
  ]);

  if (project.images) {
    try {
      images = JSON.parse(project.images);
    } catch {
      images = project.images.split("\n").filter(Boolean);
    }
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 mt-16 sm:mt-20">
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/work"
                className="hover:text-foreground transition-colors"
              >
                Work
              </Link>
              {project.category && (
                <>
                  <span>/</span>
                  <Link
                    href={`/work?category=${encodeURIComponent(
                      project.category
                    )}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {project.category}
                  </Link>
                </>
              )}
            </nav>

            {/* Category & Status */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {project.category && (
                <span className="px-3 py-1 rounded-full bg-muted text-sm font-medium text-muted-foreground">
                  {project.category}
                </span>
              )}
              {project.featured && (
                <span className="px-3 py-1 rounded-full bg-muted text-sm font-medium text-muted-foreground">
                  Featured
                </span>
              )}
              {project.client && (
                <span className="px-3 py-1 rounded-full bg-muted/50 text-sm text-muted-foreground">
                  Client: {project.client}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {project.title}
            </h1>

            {/* Description */}
            {project.description && (
              <p className="text-xl text-muted-foreground max-w-3xl mb-8">
                {project.description}
              </p>
            )}

            {/* Meta & Links */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {project.completedAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    Completed{" "}
                    {format(new Date(project.completedAt), "MMMM yyyy")}
                  </span>
                </div>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
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
                  View Live Site
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Source Code
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Cover Image */}
        {project.coverImage && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8">
            <div className="rounded-xl overflow-hidden border border-border">
              <Image
                src={project.coverImage}
                alt={project.title}
                width={1200}
                height={675}
                className="w-full aspect-video object-cover"
              />
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {project.content ? (
                <div
                  className="prose prose-lg max-w-none
                  prose-headings:text-foreground prose-headings:font-bold
                  prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-foreground/80
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-em:text-muted-foreground prose-em:italic
                  prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                  prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:text-muted-foreground
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-muted-foreground
                  prose-li:text-muted-foreground prose-li:mb-2
                  prose-img:rounded-lg prose-img:border prose-img:border-border
                  prose-hr:border-border prose-hr:my-8
                  [&_pre_code]:bg-transparent [&_pre_code]:p-0"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Case study coming soon.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Technologies */}
              {technologies.length > 0 && (
                <div className="rounded-xl border border-border bg-background p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <Link
                        key={tech}
                        href={`/work?technology=${encodeURIComponent(tech)}`}
                        className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
                      >
                        {tech}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Details */}
              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Project Details
                </h3>
                <dl className="space-y-3 text-sm">
                  {project.client && (
                    <div>
                      <dt className="text-muted-foreground">Client</dt>
                      <dd className="text-foreground font-medium">
                        {project.client}
                      </dd>
                    </div>
                  )}
                  {project.category && (
                    <div>
                      <dt className="text-muted-foreground">Category</dt>
                      <dd className="text-foreground font-medium">
                        {project.category}
                      </dd>
                    </div>
                  )}
                  {project.completedAt && (
                    <div>
                      <dt className="text-muted-foreground">Completed</dt>
                      <dd className="text-foreground font-medium">
                        {format(new Date(project.completedAt), "MMMM yyyy")}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Quick Links */}
              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-foreground hover:underline"
                    >
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
                      Visit Live Site
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-foreground hover:underline"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      View Source Code
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Gallery */}
        {images.length > 0 && (
          <section className="border-t border-border py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Project Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {images.map((url, i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden border border-border"
                  >
                    <Image
                      src={url}
                      alt={`${project.title} screenshot ${i + 1}`}
                      width={600}
                      height={338}
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="border-t border-border py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Related Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    href={`/work/${relatedProject.slug}`}
                    className="block group"
                  >
                    <article className="h-full rounded-xl border border-border overflow-hidden bg-background hover:border-foreground/20 transition-colors">
                      {relatedProject.coverImage ? (
                        <div className="aspect-video overflow-hidden">
                          <Image
                            src={relatedProject.coverImage}
                            alt={relatedProject.title}
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
                      <div className="p-4">
                        {relatedProject.category && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground mb-2">
                            {relatedProject.category}
                          </span>
                        )}
                        <h3 className="font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
                          {relatedProject.title}
                        </h3>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to work */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pb-12">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to all projects
          </Link>
        </div>
      </main>
    </>
  );
}
