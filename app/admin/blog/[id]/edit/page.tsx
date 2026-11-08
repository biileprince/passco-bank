import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogCategories, getBlogTags } from "../../actions";
import { BlogPostForm } from "../../blog-post-form";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post, categories, tags] = await Promise.all([
    getBlogPost(id),
    getBlogCategories(),
    getBlogTags(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            className="w-5 h-5"
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
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Blog Post</h1>
          <p className="text-muted-foreground mt-1">
            Update &quot;{post.title}&quot;
          </p>
        </div>
      </div>

      {/* Form */}
      <BlogPostForm post={post} categories={categories} tags={tags} />
    </div>
  );
}
