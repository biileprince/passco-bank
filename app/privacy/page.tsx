import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Eye, Lock, Users, Mail } from "lucide-react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.axiomcraft.dev";

export const metadata: Metadata = {
  title: "Privacy Policy | AxiomCraft Ghana",
  description:
    "Learn how AxiomCraft collects, uses, and protects your personal information. Our privacy policy explains our commitment to your data security and privacy.",
  keywords: [
    "privacy policy",
    "data protection",
    "axiomcraft privacy",
    "web developer privacy",
    "data security",
  ],
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy | AxiomCraft",
    description:
      "Learn how AxiomCraft protects your personal information and respects your privacy.",
    url: `${SITE_URL}/privacy`,
    type: "website",
  },
};

export default function PrivacyPage() {
  const lastUpdated = "January 16, 2026";

  return (
    <main className="relative min-h-screen bg-background">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container relative z-10 mx-auto max-w-4xl px-4 pt-28 pb-16 sm:pt-32 sm:pb-24 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="rounded-2xl border border-border bg-background/50 backdrop-blur-sm p-6 sm:p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At AxiomCraft, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website{" "}
                <a href={SITE_URL} className="text-emerald-500 hover:underline">
                  {SITE_URL}
                </a>
                , use our services, or communicate with us.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Please read this privacy policy carefully. If you do not agree
                with the terms of this privacy policy, please do not access the
                site or use our services.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-emerald-500" />
                Information We Collect
              </h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">
                Personal Information
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We may collect personal information that you voluntarily provide
                to us when you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>Fill out contact forms or inquiry forms</li>
                <li>Register for an account on our client portal</li>
                <li>Subscribe to our newsletter or updates</li>
                <li>Communicate with us via email or phone</li>
                <li>Request a quote for our services</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                This information may include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-2">
                <li>Name and contact information (email, phone number)</li>
                <li>Company name and business information</li>
                <li>Project details and requirements</li>
                <li>
                  Payment information (processed securely through third-party
                  payment processors)
                </li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">
                Automatically Collected Information
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                When you visit our website, we may automatically collect certain
                information about your device and browsing actions, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>IP address and browser type</li>
                <li>Operating system and device information</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website and exit pages</li>
                <li>
                  Analytics data (using Google Analytics or similar services)
                </li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-500" />
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>
                  To respond to your inquiries and provide customer support
                </li>
                <li>To process and deliver the services you request</li>
                <li>To send you project updates and important notifications</li>
                <li>To improve our website and services</li>
                <li>To personalize your experience on our website</li>
                <li>To send marketing communications (with your consent)</li>
                <li>To comply with legal obligations</li>
                <li>To protect against fraud and unauthorized access</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-emerald-500" />
                Information Sharing and Disclosure
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information in the following
                circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>
                  <strong>Service Providers:</strong> We may share information
                  with trusted third-party service providers who assist us in
                  operating our website and providing our services (e.g.,
                  hosting, email services, payment processing).
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your
                  information if required by law or to protect our rights,
                  property, or safety.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger,
                  acquisition, or sale of assets, your information may be
                  transferred to the acquiring entity.
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may share your
                  information with your explicit consent.
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security
                measures to protect your personal information from unauthorized
                access, disclosure, alteration, or destruction. However, no
                method of transmission over the internet or electronic storage
                is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to enhance your
                browsing experience, analyze website traffic, and understand
                user behavior. You can control cookie preferences through your
                browser settings. Note that disabling cookies may affect the
                functionality of our website.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website may contain links to third-party websites. We are
                not responsible for the privacy practices or content of these
                external sites. We encourage you to review the privacy policies
                of any third-party sites you visit.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Your Privacy Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>Access the personal information we hold about you</li>
                <li>
                  Request correction of inaccurate or incomplete information
                </li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to or restrict certain processing of your data</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise any of these rights, please contact us using the
                information provided below.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Children&apos;s Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not directed to individuals under the age of
                18. We do not knowingly collect personal information from
                children. If you believe we have inadvertently collected
                information from a child, please contact us immediately.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Changes to This Privacy Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements. We will notify
                you of any material changes by posting the updated policy on
                this page with a new &quot;Last Updated&quot; date. We encourage
                you to review this policy periodically.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-muted/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-500" />
                Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions or concerns about this Privacy Policy
                or our privacy practices, please contact us at:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:biileprinceyennuyar5@gmail.com"
                    className="text-emerald-500 hover:underline"
                  >
                    biileprinceyennuyar5@gmail.com
                  </a>
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  <a
                    href="tel:+233555902675"
                    className="text-emerald-500 hover:underline"
                  >
                    0555 902 675
                  </a>
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href={SITE_URL}
                    className="text-emerald-500 hover:underline"
                  >
                    {SITE_URL}
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
