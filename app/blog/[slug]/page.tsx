import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  generateBlogPostSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema-org";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.axiomcraft.dev";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: {
      category: true,
      tags: true,
    },
  });

  if (post) {
    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
  }

  return post;
}

async function getRelatedPosts(post: {
  id: string;
  categoryId: string | null;
  tags: { id: string }[];
}) {
  return prisma.blogPost.findMany({
    where: {
      published: true,
      id: { not: post.id },
      OR: [
        post.categoryId ? { categoryId: post.categoryId } : {},
        post.tags.length > 0
          ? { tags: { some: { id: { in: post.tags.map((t) => t.id) } } } }
          : {},
      ].filter((obj) => Object.keys(obj).length > 0),
    },
    include: { category: true },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: { category: true },
  });

  if (!post) {
    return { title: "Post Not Found | AxiomCraft" };
  }

  const keywords = [
    post.title.toLowerCase(),
    "web development",
    "axiomcraft blog",
    post.category?.name?.toLowerCase() || "tutorial",
    "ghana developer",
  ];

  return {
    title: `${post.title} | AxiomCraft Blog - Web Development Insights`,
    description:
      post.excerpt ||
      `Read ${post.title} on AxiomCraft Blog. Expert web development tips, tutorials, and insights from a professional freelance developer in Ghana.`,
    keywords,
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description:
        post.excerpt ||
        `Read ${post.title} - Expert web development tips and insights.`,
      images: post.coverImage
        ? [
            {
              url: post.coverImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: ["AxiomCraft"],
      section: post.category?.name || "Web Development",
      url: `${SITE_URL}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || `Read ${post.title} on AxiomCraft Blog`,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post);

  // Calculate read time (average 200 words per minute)
  const wordCount = post.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Generate JSON-LD schemas
  const blogPostSchema = generateBlogPostSchema({
    title: post.title,
    description: post.excerpt || "",
    slug: post.slug,
    datePublished:
      post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    image: post.coverImage || undefined,
    category: post.category?.name || undefined,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
  ]);

  return (
    <main className="min-h-screen bg-background">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 mt-16 sm:mt-20">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            {post.category && (
              <>
                <span>/</span>
                <Link
                  href={`/blog?category=${post.category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {post.category.name}
                </Link>
              </>
            )}
          </nav>

          {/* Category & Tags */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {post.category && (
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="px-3 py-1 rounded-full bg-muted text-sm font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                {post.category.name}
              </Link>
            )}
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tag=${tag.slug}`}
                className="px-2 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground hover:bg-muted transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {format(new Date(post.publishedAt), "MMMM d, yyyy")}
              </time>
            )}
            <span>·</span>
            <span>{readTime} min read</span>
            <span>·</span>
            <span>{post.views.toLocaleString()} views</span>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl -mt-px">
          <div className="aspect-2/1 rounded-xl overflow-hidden border border-border">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
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
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Tags at bottom */}
      {post.tags.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pb-8">
          <div className="flex items-center gap-2 flex-wrap pt-8 border-t border-border">
            <span className="text-sm text-muted-foreground">Tags:</span>
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tag=${tag.slug}`}
                className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="block group"
                >
                  <article className="h-full rounded-xl border border-border overflow-hidden bg-background hover:border-foreground/20 transition-colors">
                    {relatedPost.coverImage && (
                      <div className="aspect-video overflow-hidden">
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      {relatedPost.category && (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground mb-2">
                          {relatedPost.category.name}
                        </span>
                      )}
                      <h3 className="font-semibold text-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.publishedAt && (
                        <time className="text-xs text-muted-foreground mt-2 block">
                          {format(
                            new Date(relatedPost.publishedAt),
                            "MMM d, yyyy"
                          )}
                        </time>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to blog */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pb-12">
        <Link
          href="/blog"
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
          Back to all posts
        </Link>
      </div>
    </main>
  );
}
