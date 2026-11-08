import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { auth } from "../lib/auth";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function seedOguaaHallData() {
  const catalogue = [
    {
      name: "Computer Science",
      college: "College of Agriculture & Natural Sciences",
      courses: [
        { code: "CSD 101", title: "Introduction to Computer Science", level: 100 },
        { code: "CSD 201", title: "Data Structures and Algorithms", level: 200 },
        { code: "CSD 301", title: "Database Systems", level: 300 },
      ],
    },
    {
      name: "Biology",
      college: "College of Agriculture & Natural Sciences",
      courses: [
        { code: "BIO 101", title: "Introduction to Biology", level: 100 },
        { code: "BIO 201", title: "Cell Biology", level: 200 },
        { code: "BIO 301", title: "Genetics", level: 300 },
      ],
    },
    {
      name: "Accounting",
      college: "School of Business",
      courses: [
        { code: "ACC 101", title: "Introduction to Accounting", level: 100 },
        { code: "ACC 201", title: "Financial Accounting", level: 200 },
        { code: "ACC 301", title: "Management Accounting", level: 300 },
      ],
    },
    {
      name: "Political Science",
      college: "College of Humanities & Legal Studies",
      courses: [
        { code: "PSI 101", title: "Introduction to Political Science", level: 100 },
        { code: "PSI 201", title: "Ghanaian Government and Politics", level: 200 },
        { code: "PSI 301", title: "International Relations", level: 300 },
      ],
    },
    {
      name: "B.Ed. Basic Education",
      college: "College of Education Studies",
      courses: [
        { code: "BED 101", title: "Foundations of Education", level: 100 },
        { code: "BED 201", title: "Educational Psychology", level: 200 },
        { code: "BED 301", title: "Curriculum Studies", level: 300 },
      ],
    },
  ];

  const programs = new Map<string, { id: string }>();
  for (const item of catalogue) {
    const program = await prisma.program.upsert({
      where: { name: item.name },
      update: { college: item.college, active: true },
      create: { name: item.name, college: item.college },
      select: { id: true },
    });
    programs.set(item.name, program);

    for (const course of item.courses) {
      await prisma.course.upsert({
        where: {
          programId_code_level: {
            programId: program.id,
            code: course.code,
            level: course.level,
          },
        },
        update: { title: course.title },
        create: { ...course, programId: program.id },
      });
    }
  }

  const adminEmail = "admin@oguaa.ucc.edu.gh";
  const adminPassword = "OguaaAdmin123!";
  const adminPhone = "0550000000";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
    select: { id: true },
  });

  if (!existingAdmin) {
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Oguaa Hall Academic Team",
      },
    });
  }

  const seedAdmin = await prisma.user.update({
    where: { email: adminEmail },
    data: {
      role: "admin",
      name: "Oguaa Hall Academic Team",
      phone: adminPhone,
    },
    select: { id: true },
  });

  const adminPasswordHash = await hashPassword(adminPassword);
  await prisma.account.upsert({
    where: {
      providerId_accountId: {
        providerId: "credential",
        accountId: seedAdmin.id,
      },
    },
    update: {
      password: adminPasswordHash,
    },
    create: {
      userId: seedAdmin.id,
      providerId: "credential",
      accountId: seedAdmin.id,
      password: adminPasswordHash,
    },
  });

  const computerScience = programs.get("Computer Science");
  const csCourse = computerScience
    ? await prisma.course.findFirst({
        where: { programId: computerScience.id, code: "CSD 101", level: 100 },
      })
    : null;

  if (csCourse) {
    const existingResource = await prisma.resource.findFirst({
      where: { title: "CSD 101 — Introduction to Computer Science" },
    });
    if (!existingResource) {
      await prisma.resource.create({
        data: {
          title: "CSD 101 — Introduction to Computer Science",
          description: "Starter lecture material for first-year Computer Science students.",
          type: "lecture-slide",
          fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          fileName: "csd-101-introduction.pdf",
          fileFormat: "pdf",
          fileSize: 13264,
          academicYear: "2025/2026",
          semester: "First",
          level: 100,
          approved: true,
          approvedAt: new Date(),
          programId: computerScience!.id,
          courseId: csCourse.id,
          uploadedById: seedAdmin.id,
        },
      });
    }
  }

  const announcements = [
    {
      title: "Welcome to the Oguaa Hall student platform",
      content: "Access hall notices, academic resources, events, and student support in one place.",
      category: "notice",
      pinned: true,
    },
    {
      title: "Academic resource centre now open",
      content: "Students can browse approved lecture slides, notes, and past questions by programme and level.",
      category: "opportunity",
      pinned: false,
    },
  ];
  for (const announcement of announcements) {
    const existing = await prisma.announcement.findFirst({
      where: { title: announcement.title },
    });
    if (!existing) {
      await prisma.announcement.create({
        data: {
          ...announcement,
          published: true,
          publishedAt: new Date(),
        },
      });
    }
  }

  const events = [
    {
      title: "Oguaa Hall General Meeting",
      description: "A community meeting for hall affiliates to discuss welfare, academics, and upcoming activities.",
      location: "Oguaa Hall Common Room",
      startsAt: new Date("2026-12-05T15:00:00Z"),
    },
    {
      title: "Academic Resource Drive",
      description: "Students and course representatives are invited to contribute approved academic materials.",
      location: "Oguaa Hall ICT Centre",
      startsAt: new Date("2026-12-12T10:00:00Z"),
    },
  ];
  for (const event of events) {
    const existing = await prisma.event.findFirst({ where: { title: event.title } });
    if (!existing) {
      await prisma.event.create({ data: { ...event, published: true } });
    }
  }

  const gallery = [
    {
      title: "Learning together at Oguaa Hall",
      caption: "Students building a stronger academic community.",
      category: "community",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=85",
    },
    {
      title: "Community conversations",
      caption: "A moment from student engagement and hall discussions.",
      category: "meetings",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=85",
    },
    {
      title: "Campus life and friendship",
      caption: "Celebrating the people and memories that make hall life special.",
      category: "sports-socials",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=85",
    },
    ...Array.from({ length: 16 }, (_, index) => ({
      title: `Matriculate with Kwame Eugene ${index + 1}`,
      caption: "Matriculation photo shorts sponsored by Kwame Eugene.",
      category: "matriculation",
      imageUrl: `/gallery/matriculation-${String(index + 1).padStart(2, "0")}.jpeg`,
    })),
  ];
  for (const image of gallery) {
    const existing = await prisma.galleryImage.findFirst({ where: { title: image.title } });
    if (!existing) {
      await prisma.galleryImage.create({ data: { ...image, approved: true } });
    }
  }

  console.log("Oguaa Hall catalogue and community content seeded.");
}

async function main() {
  console.log("🌱 Seeding database...");
  await seedOguaaHallData();

  // Create blog categories
  const webDevCategory = await prisma.blogCategory.upsert({
    where: { slug: "web-development" },
    update: {},
    create: {
      name: "Web Development",
      slug: "web-development",
      description:
        "Articles about modern web development practices and technologies",
    },
  });

  const tutorialsCategory = await prisma.blogCategory.upsert({
    where: { slug: "tutorials" },
    update: {},
    create: {
      name: "Tutorials",
      slug: "tutorials",
      description: "Step-by-step guides and how-to articles",
    },
  });

  const designCategory = await prisma.blogCategory.upsert({
    where: { slug: "design" },
    update: {},
    create: {
      name: "Design",
      slug: "design",
      description: "UI/UX design tips and best practices",
    },
  });

  // Create blog tags
  const nextjsTag = await prisma.blogTag.upsert({
    where: { slug: "nextjs" },
    update: {},
    create: {
      name: "Next.js",
      slug: "nextjs",
    },
  });

  const reactTag = await prisma.blogTag.upsert({
    where: { slug: "react" },
    update: {},
    create: {
      name: "React",
      slug: "react",
    },
  });

  const tailwindTag = await prisma.blogTag.upsert({
    where: { slug: "tailwind" },
    update: {},
    create: {
      name: "Tailwind CSS",
      slug: "tailwind",
    },
  });

  const typescriptTag = await prisma.blogTag.upsert({
    where: { slug: "typescript" },
    update: {},
    create: {
      name: "TypeScript",
      slug: "typescript",
    },
  });

  // Create blog posts
  const post1 = await prisma.blogPost.upsert({
    where: { slug: "getting-started-with-nextjs-16" },
    update: {},
    create: {
      title: "Getting Started with Next.js 16",
      slug: "getting-started-with-nextjs-16",
      excerpt:
        "Learn how to build modern web applications with the latest version of Next.js. This comprehensive guide covers everything from setup to deployment.",
      content: `<h2>Introduction to Next.js 16</h2>
<p>Next.js 16 brings exciting new features and improvements that make building web applications faster and more enjoyable. In this tutorial, we'll explore the key features and build a simple application.</p>

<h3>Key Features</h3>
<ul>
  <li>Improved caching mechanisms</li>
  <li>Enhanced performance with Turbopack</li>
  <li>Better TypeScript support</li>
  <li>New Server Actions capabilities</li>
</ul>

<h3>Getting Started</h3>
<p>First, create a new Next.js project using the following command:</p>
<pre><code>npx create-next-app@latest my-app</code></pre>

<p>This will set up a new Next.js 16 project with all the latest features and optimizations.</p>

<h3>Project Structure</h3>
<p>Next.js 16 uses the App Router by default, which provides a more intuitive file-based routing system. Here's what your project structure will look like:</p>

<ul>
  <li><code>app/</code> - Your application routes and components</li>
  <li><code>public/</code> - Static assets</li>
  <li><code>components/</code> - Reusable React components</li>
</ul>

<h3>Conclusion</h3>
<p>Next.js 16 is a powerful framework for building modern web applications. With its improved performance and developer experience, it's never been easier to create fast, scalable websites.</p>`,
      coverImage:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      published: true,
      featured: true,
      categoryId: webDevCategory.id,
      publishedAt: new Date("2024-12-15"),
      tags: {
        connect: [
          { id: nextjsTag.id },
          { id: reactTag.id },
          { id: typescriptTag.id },
        ],
      },
    },
  });

  const post2 = await prisma.blogPost.upsert({
    where: { slug: "tailwind-css-best-practices" },
    update: {},
    create: {
      title: "Tailwind CSS Best Practices for 2025",
      slug: "tailwind-css-best-practices",
      excerpt:
        "Discover the best practices for using Tailwind CSS in your projects. Learn how to write maintainable, scalable styles that your team will love.",
      content: `<h2>Why Tailwind CSS?</h2>
<p>Tailwind CSS has revolutionized how we write CSS by providing utility-first classes that make styling faster and more consistent.</p>

<h3>Best Practices</h3>
<ol>
  <li><strong>Use the @apply directive sparingly</strong> - Keep your HTML semantic but don't overuse @apply</li>
  <li><strong>Organize with components</strong> - Extract repeated patterns into components</li>
  <li><strong>Customize your theme</strong> - Extend Tailwind's default theme to match your brand</li>
  <li><strong>Use plugins</strong> - Leverage Tailwind plugins for additional functionality</li>
</ol>

<h3>Example: Button Component</h3>
<pre><code>const Button = ({ children, variant = 'primary' }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  };
  
  return (
    &lt;button className={\`\${baseStyles} \${variants[variant]}\`}&gt;
      {children}
    &lt;/button&gt;
  );
};</code></pre>

<h3>Performance Tips</h3>
<p>To keep your CSS bundle size small:</p>
<ul>
  <li>Remove unused styles with PurgeCSS (built into Tailwind)</li>
  <li>Use Just-in-Time mode for faster builds</li>
  <li>Minimize custom CSS where possible</li>
</ul>`,
      coverImage:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
      published: true,
      featured: false,
      categoryId: designCategory.id,
      publishedAt: new Date("2024-12-10"),
      tags: {
        connect: [{ id: tailwindTag.id }, { id: reactTag.id }],
      },
    },
  });

  const post3 = await prisma.blogPost.upsert({
    where: { slug: "building-accessible-web-apps" },
    update: {},
    create: {
      title: "Building Accessible Web Applications",
      slug: "building-accessible-web-apps",
      excerpt:
        "Accessibility is not optional. Learn how to build web applications that everyone can use, regardless of their abilities.",
      content: `<h2>The Importance of Accessibility</h2>
<p>Web accessibility ensures that people with disabilities can use your website. It's not just the right thing to do—it's also required by law in many jurisdictions.</p>

<h3>Core Principles (POUR)</h3>
<ul>
  <li><strong>Perceivable</strong> - Users can perceive the information</li>
  <li><strong>Operable</strong> - Users can operate the interface</li>
  <li><strong>Understandable</strong> - Users can understand the content</li>
  <li><strong>Robust</strong> - Content works across technologies</li>
</ul>

<h3>Practical Tips</h3>
<ol>
  <li>Use semantic HTML elements</li>
  <li>Provide text alternatives for images</li>
  <li>Ensure keyboard navigation works</li>
  <li>Use ARIA attributes correctly</li>
  <li>Test with screen readers</li>
</ol>

<h3>Example: Accessible Form</h3>
<pre><code>&lt;form&gt;
  &lt;label htmlFor="email"&gt;Email Address&lt;/label&gt;
  &lt;input 
    id="email"
    type="email"
    aria-describedby="email-help"
    required
  /&gt;
  &lt;span id="email-help" className="text-sm"&gt;
    We'll never share your email
  &lt;/span&gt;
&lt;/form&gt;</code></pre>

<p>Making your website accessible benefits everyone and improves the overall user experience.</p>`,
      coverImage:
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80",
      published: true,
      featured: false,
      categoryId: tutorialsCategory.id,
      publishedAt: new Date("2024-12-08"),
      tags: {
        connect: [{ id: reactTag.id }],
      },
    },
  });

  console.log("✅ Created blog posts:", { post1, post2, post3 });

  // Create portfolio projects
  const project1 = await prisma.portfolioProject.upsert({
    where: { slug: "ecommerce-fashion-store" },
    update: {},
    create: {
      title: "Modern Fashion E-Commerce Platform",
      slug: "ecommerce-fashion-store",
      description:
        "A full-featured online fashion store with product management, shopping cart, secure checkout, and real-time inventory tracking.",
      content: `<h2>Project Overview</h2>
<p>Built a comprehensive e-commerce platform for a fashion retailer looking to expand their online presence. The platform handles thousands of products and processes hundreds of orders daily.</p>

<h3>Key Features</h3>
<ul>
  <li>Product catalog with advanced filtering and search</li>
  <li>Shopping cart with real-time inventory updates</li>
  <li>Secure payment processing with Stripe</li>
  <li>Order management system</li>
  <li>Customer account dashboard</li>
  <li>Admin panel for inventory management</li>
</ul>

<h3>Technical Highlights</h3>
<p>The platform was built using Next.js 16 for optimal performance and SEO. We implemented server-side rendering for product pages to ensure fast load times and excellent search engine visibility.</p>

<h3>Results</h3>
<ul>
  <li>40% increase in online sales in the first quarter</li>
  <li>Page load times under 2 seconds</li>
  <li>98% customer satisfaction rating</li>
  <li>Mobile conversion rate improved by 35%</li>
</ul>`,
      coverImage:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
      ]),
      category: "E-Commerce",
      technologies:
        "Next.js, React, TypeScript, Stripe, PostgreSQL, Tailwind CSS",
      client: "FashionHub Retail",
      liveUrl: "https://example.com",
      featured: true,
      published: true,
      completedAt: new Date("2024-11-15"),
    },
  });

  const project2 = await prisma.portfolioProject.upsert({
    where: { slug: "corporate-consulting-website" },
    update: {},
    create: {
      title: "Professional Consulting Firm Website",
      slug: "corporate-consulting-website",
      description:
        "A sleek, professional website for a business consulting firm featuring service pages, team profiles, case studies, and a client portal.",
      content: `<h2>The Challenge</h2>
<p>Our client, a leading consulting firm, needed a modern website that reflected their expertise and professionalism while being easy to update and maintain.</p>

<h3>Solution</h3>
<p>We designed and developed a custom website with a focus on clarity, professionalism, and user experience. The site features:</p>
<ul>
  <li>Service showcase with detailed descriptions</li>
  <li>Team member profiles and bios</li>
  <li>Case study library with filtering</li>
  <li>Blog for thought leadership content</li>
  <li>Contact forms with CRM integration</li>
  <li>Client portal for document sharing</li>
</ul>

<h3>Design Approach</h3>
<p>We used a clean, minimalist design that puts content first. The color palette conveys trust and professionalism while maintaining visual interest.</p>

<h3>Performance</h3>
<p>The website achieves perfect scores in Google Lighthouse for performance, accessibility, and SEO. All pages load in under 1.5 seconds.</p>`,
      coverImage:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
      ]),
      category: "Corporate",
      technologies: "Next.js, TypeScript, Prisma, PostgreSQL, Tailwind CSS",
      client: "Strategic Solutions Inc",
      liveUrl: "https://example.com",
      featured: true,
      published: true,
      completedAt: new Date("2024-10-20"),
    },
  });

  const project3 = await prisma.portfolioProject.upsert({
    where: { slug: "university-student-portal" },
    update: {},
    create: {
      title: "University Student Association Portal",
      slug: "university-student-portal",
      description:
        "A comprehensive web platform for a university student organization with event management, member directory, news updates, and photo galleries.",
      content: `<h2>Project Background</h2>
<p>The university's student association needed a centralized platform to manage their growing community and events. The old website was outdated and difficult to maintain.</p>

<h3>Features Delivered</h3>
<ul>
  <li>Event calendar with RSVP functionality</li>
  <li>Member directory with profiles</li>
  <li>News and announcements system</li>
  <li>Photo gallery with event albums</li>
  <li>Document library for resources</li>
  <li>Email notification system</li>
</ul>

<h3>User Experience</h3>
<p>We designed the portal to be intuitive and mobile-friendly, ensuring students can access information on any device. The admin panel makes it easy for committee members to update content without technical knowledge.</p>

<h3>Impact</h3>
<ul>
  <li>50% increase in event attendance</li>
  <li>300+ active members registered</li>
  <li>Reduced administrative workload by 60%</li>
  <li>Improved communication with members</li>
</ul>`,
      coverImage:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
      ]),
      category: "Community",
      technologies: "React, Node.js, MongoDB, Express, Tailwind CSS",
      client: "University Student Association",
      featured: false,
      published: true,
      completedAt: new Date("2024-09-10"),
    },
  });

  const project4 = await prisma.portfolioProject.upsert({
    where: { slug: "booking-appointment-system" },
    update: {},
    create: {
      title: "Online Booking & Appointment System",
      slug: "booking-appointment-system",
      description:
        "Custom web application for appointment scheduling with calendar integration, automated reminders, and payment processing for a healthcare clinic.",
      content: `<h2>The Need</h2>
<p>A busy healthcare clinic was overwhelmed with phone bookings and needed a modern solution to streamline their appointment scheduling process.</p>

<h3>System Features</h3>
<ul>
  <li>Real-time availability calendar</li>
  <li>Online booking for patients</li>
  <li>Automated email and SMS reminders</li>
  <li>Payment processing for deposits</li>
  <li>Staff schedule management</li>
  <li>Patient history tracking</li>
</ul>

<h3>Integration</h3>
<p>We integrated the booking system with the clinic's existing practice management software, ensuring seamless data flow and reducing duplicate data entry.</p>

<h3>Results</h3>
<p>After implementing the system:</p>
<ul>
  <li>Phone call volume reduced by 70%</li>
  <li>No-show rate decreased by 45%</li>
  <li>Staff can focus on patient care instead of scheduling</li>
  <li>Patient satisfaction scores improved</li>
</ul>`,
      coverImage:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      ]),
      category: "Web App",
      technologies: "Next.js, PostgreSQL, Stripe, Twilio, Google Calendar API",
      client: "HealthFirst Clinic",
      liveUrl: "https://example.com",
      featured: false,
      published: true,
      completedAt: new Date("2024-08-25"),
    },
  });

  console.log("✅ Created portfolio projects:", {
    project1,
    project2,
    project3,
    project4,
  });

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
