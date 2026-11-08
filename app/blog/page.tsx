import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { GoogleOneTap } from "../components/auth/google-one-tap";
import { generateBreadcrumbSchema } from "@/lib/schema-org";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.axiomcraft.dev";

// Generate dynamic metadata based on filters
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; search?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;

  // Build URL with query params
  let url = `${SITE_URL}/blog`;
  const queryParts: string[] = [];
  if (params.category) queryParts.push(`category=${params.category}`);
  if (params.tag) queryParts.push(`tag=${params.tag}`);
  if (params.search) queryParts.push(`search=${params.search}`);
  if (queryParts.length > 0) {
    url += `?${queryParts.join("&")}`;
  }

  // Customize title and description based on filters
  let title = "Blog | Web Dev Tips & Tutorials | AxiomCraft Ghana";
  let description =
    "Stay updated with the latest web development trends, tutorials, and insights from AxiomCraft. Learn about React, Next.js, mobile app development, SEO, and more. Expert tips from a professional freelance developer in Ghana.";

  if (params.category) {
    title = `${params.category.charAt(0).toUpperCase() + params.category.slice(1)} Articles | AxiomCraft Blog`;
    description = `Explore ${params.category} articles and tutorials from AxiomCraft. Expert web development insights from Ghana.`;
  } else if (params.tag) {
    title = `#${params.tag} Posts | AxiomCraft Blog`;
    description = `Browse all posts tagged with ${params.tag}. Web development tips and tutorials from AxiomCraft.`;
  } else if (params.search) {
    title = `Search: ${params.search} | AxiomCraft Blog`;
    description = `Search results for "${params.search}" on AxiomCraft blog.`;
  }

  return {
    title,
    description,
    keywords: [
      "web development blog",
      "coding tutorials",
      "react tutorials",
      "next.js tips",
      "web development ghana",
      "developer blog",
      "programming tutorials",
      "frontend development",
      "full stack development tips",
      "seo tips for websites",
      ...(params.category ? [params.category] : []),
      ...(params.tag ? [params.tag] : []),
    ],
    alternates: {
      canonical: url, // Set canonical to the actual URL with query params
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: `${SITE_URL}/blog-og.jpg`,
          width: 1200,
          height: 630,
          alt: "AxiomCraft Blog - Web Development Tips and Tutorials",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

async function getBlogPosts(options?: {
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
}) {
  interface WhereClause {
    published: boolean;
    category?: { slug: string };
    tags?: { some: { slug: string } };
    OR?: Array<
      | { title: { contains: string; mode: "insensitive" } }
      | { excerpt: { contains: string; mode: "insensitive" } }
    >;
  }

  const where: WhereClause = { published: true };

  if (options?.categorySlug) {
    where.category = { slug: options.categorySlug };
  }
  if (options?.tagSlug) {
    where.tags = { some: { slug: options.tagSlug } };
  }
  if (options?.search) {
    where.OR = [
      { title: { contains: options.search, mode: "insensitive" } },
      { excerpt: { contains: options.search, mode: "insensitive" } },
    ];
  }

  return prisma.blogPost.findMany({
    where,
    include: {
      category: true,
      tags: true,
    },
    orderBy: { publishedAt: "desc" },
  });
}

async function getCategories() {
  return prisma.blogCategory.findMany({
    include: {
      _count: { select: { posts: { where: { published: true } } } },
    },
    orderBy: { name: "asc" },
  });
}

async function getTags() {
  return prisma.blogTag.findMany({
    include: {
      _count: { select: { posts: { where: { published: true } } } },
    },
    orderBy: { name: "asc" },
  });
}

async function getFeaturedPost() {
  return prisma.blogPost.findFirst({
    where: { published: true, featured: true },
    include: { category: true, tags: true },
    orderBy: { publishedAt: "desc" },
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; search?: string }>;
}) {
  const params = await searchParams;

  const [posts, categories, tags, featuredPost] = await Promise.all([
    getBlogPosts({
      categorySlug: params.category,
      tagSlug: params.tag,
      search: params.search,
    }),
    getCategories(),
    getTags(),
    getFeaturedPost(),
  ]);

  const activeCategory = params.category;
  const activeTag = params.tag;
  const searchQuery = params.search;

  // Generate JSON-LD schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-500 mb-3 sm:mb-4">
              Blog
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl">
              Insights, tutorials, and updates on web development, design, and
              technology.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-6 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Search Form */}
              <form action="/blog" method="GET" className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search articles..."
                  defaultValue={searchQuery}
                  className="w-full px-4 py-3 pl-12 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </form>

              {/* Active Filters */}
              {(activeCategory || activeTag || searchQuery) && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">
                    Filters:
                  </span>
                  {activeCategory && (
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm text-foreground hover:bg-muted/80"
                    >
                      Category: {activeCategory}
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
                  )}
                  {activeTag && (
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm text-foreground hover:bg-muted/80"
                    >
                      Tag: {activeTag}
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
                  )}
                  {searchQuery && (
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm text-foreground hover:bg-muted/80"
                    >
                      Search: {searchQuery}
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
                  )}
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    Clear all
                  </Link>
                </div>
              )}

              {/* Featured Post */}
              {featuredPost &&
                !activeCategory &&
                !activeTag &&
                !searchQuery && (
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="block group"
                  >
                    <article className="rounded-xl border border-border overflow-hidden bg-background hover:border-foreground/20 transition-colors">
                      {featuredPost.coverImage && (
                        <div className="aspect-2/1 overflow-hidden">
                          <Image
                            src={featuredPost.coverImage}
                            alt={featuredPost.title}
                            width={800}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                            Featured
                          </span>
                          {featuredPost.category && (
                            <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                              {featuredPost.category.name}
                            </span>
                          )}
                        </div>
                        <h2 className="text-2xl font-bold text-foreground group-hover:text-foreground/80 transition-colors mb-2">
                          {featuredPost.title}
                        </h2>
                        {featuredPost.excerpt && (
                          <p className="text-muted-foreground line-clamp-2 mb-4">
                            {featuredPost.excerpt}
                          </p>
                        )}
                        {featuredPost.publishedAt && (
                          <time className="text-sm text-muted-foreground">
                            {format(
                              new Date(featuredPost.publishedAt),
                              "MMMM d, yyyy",
                            )}
                          </time>
                        )}
                      </div>
                    </article>
                  </Link>
                )}

              {/* Posts Grid */}
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No posts found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? `No posts matching "${searchQuery}"`
                      : "Check back later for new content."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts
                    .filter(
                      (post) =>
                        !featuredPost ||
                        post.id !== featuredPost.id ||
                        activeCategory ||
                        activeTag ||
                        searchQuery,
                    )
                    .map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="block group"
                      >
                        <article className="h-full rounded-xl border border-border overflow-hidden bg-background hover:border-foreground/20 transition-colors">
                          {post.coverImage && (
                            <div className="aspect-video overflow-hidden">
                              <Image
                                src={post.coverImage}
                                alt={post.title}
                                width={400}
                                height={225}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-5">
                            {post.category && (
                              <span className="inline-block px-2 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground mb-3">
                                {post.category.name}
                              </span>
                            )}
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground/80 transition-colors mb-2 line-clamp-2">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {post.excerpt}
                              </p>
                            )}
                            {post.publishedAt && (
                              <time className="text-xs text-muted-foreground">
                                {format(
                                  new Date(post.publishedAt),
                                  "MMM d, yyyy",
                                )}
                              </time>
                            )}
                          </div>
                        </article>
                      </Link>
                    ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Categories */}
              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Categories
                </h3>
                {categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No categories yet
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/blog?category=${category.slug}`}
                          className={`flex items-center justify-between text-sm transition-colors ${
                            activeCategory === category.slug
                              ? "text-foreground font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span>{category.name}</span>
                          <span className="text-xs">
                            ({category._count.posts})
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Tags */}
              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="font-semibold text-foreground mb-4">Tags</h3>
                {tags.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tags yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/blog?tag=${tag.slug}`}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs transition-colors ${
                          activeTag === tag.slug
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                        }`}
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
