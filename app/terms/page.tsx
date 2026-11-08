import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Scale,
  AlertCircle,
  DollarSign,
  Shield,
  Mail,
} from "lucide-react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.axiomcraft.dev";

export const metadata: Metadata = {
  title: "Terms of Service | AxiomCraft Ghana",
  description:
    "Read the terms and conditions for using AxiomCraft's web development services. Learn about our service agreements, payment terms, and user responsibilities.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "axiomcraft terms",
    "web development terms",
    "service agreement",
  ],
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
  openGraph: {
    title: "Terms of Service | AxiomCraft",
    description:
      "Read the terms and conditions for using AxiomCraft's web development services.",
    url: `${SITE_URL}/terms`,
    type: "website",
  },
};

export default function TermsPage() {
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
            <Scale className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Terms of Service
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
                <FileText className="h-5 w-5 text-emerald-500" />
                Agreement to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to AxiomCraft. By accessing our website at{" "}
                <a href={SITE_URL} className="text-emerald-500 hover:underline">
                  {SITE_URL}
                </a>{" "}
                or using our web development services, you agree to be bound by
                these Terms of Service (&quot;Terms&quot;). If you do not agree
                to these Terms, please do not use our website or services.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                These Terms constitute a legally binding agreement between you
                and AxiomCraft. Please read them carefully.
              </p>
            </section>

            {/* Services */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Services Offered</h2>
              <p className="text-muted-foreground leading-relaxed">
                AxiomCraft provides professional web development services,
                including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>Website design and development</li>
                <li>E-commerce solutions</li>
                <li>Mobile app development (React Native)</li>
                <li>Custom web applications</li>
                <li>Website maintenance and support</li>
                <li>SEO optimization and digital marketing</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Specific service details, deliverables, and timelines will be
                outlined in individual project agreements or contracts.
              </p>
            </section>

            {/* Use of Website */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Use of Website</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                When using our website, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Not use the website for any unlawful purposes</li>
                <li>
                  Not attempt to interfere with the website&apos;s functionality
                </li>
                <li>Not impersonate others or misrepresent your affiliation</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>

            {/* Project Terms */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Project Terms and Payment
              </h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">
                Project Agreements
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Each project will be governed by a separate agreement that
                outlines:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>Project scope and deliverables</li>
                <li>Timeline and milestones</li>
                <li>Payment terms and amounts</li>
                <li>Revision and change request policies</li>
                <li>Intellectual property rights</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Payment Terms</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  A deposit (typically 30-50%) is required before work begins
                </li>
                <li>
                  Payment milestones will be established based on project phases
                </li>
                <li>Final payment is due before project delivery</li>
                <li>Late payments may incur additional fees</li>
                <li>
                  All fees are in USD, GHS, or as agreed in the project contract
                </li>
                <li>
                  Refunds are subject to the terms in your project agreement
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">
                Client Responsibilities
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>Provide timely content, feedback, and approvals</li>
                <li>Ensure you have rights to all materials you provide</li>
                <li>Respond to communications within agreed timeframes</li>
                <li>Make timely payments as specified in the agreement</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Intellectual Property Rights
              </h2>

              <h3 className="text-xl font-semibold mb-3 mt-4">
                Our Intellectual Property
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                All content on this website, including text, graphics, logos,
                code, and software, is the property of AxiomCraft and is
                protected by copyright and intellectual property laws. You may
                not use, reproduce, or distribute our content without explicit
                permission.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">
                Project Deliverables
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Upon full payment:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>
                  You own the final deliverables (website, app, custom code)
                </li>
                <li>
                  AxiomCraft retains rights to reusable components and
                  frameworks
                </li>
                <li>
                  We may showcase your project in our portfolio unless otherwise
                  agreed
                </li>
                <li>
                  Third-party licenses (plugins, libraries) remain with their
                  owners
                </li>
              </ul>
            </section>

            {/* Warranties and Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-emerald-500" />
                Warranties and Disclaimers
              </h2>

              <h3 className="text-xl font-semibold mb-3 mt-4">
                Service Warranty
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>
                  Services will be performed with professional care and skill
                </li>
                <li>
                  Work will substantially conform to agreed specifications
                </li>
                <li>
                  Delivered code will be free from critical defects for a
                  specified warranty period (typically 30-90 days)
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Disclaimers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Except as expressly stated:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>
                  Services are provided &quot;as is&quot; without warranties of
                  any kind
                </li>
                <li>
                  We do not guarantee specific business results or outcomes
                </li>
                <li>
                  We are not responsible for third-party services or platforms
                </li>
                <li>
                  Website performance depends on factors outside our control
                </li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>
                  Our total liability shall not exceed the amount paid for the
                  specific service
                </li>
                <li>
                  We are not liable for indirect, incidental, or consequential
                  damages
                </li>
                <li>
                  We are not liable for losses resulting from delays, errors, or
                  interruptions outside our control
                </li>
                <li>
                  You agree to indemnify us against claims arising from your use
                  of our services
                </li>
              </ul>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Termination of Services
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Either party may terminate a project agreement with written
                notice. In case of termination:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>
                  You will pay for work completed up to the termination date
                </li>
                <li>
                  Deposits may be non-refundable as specified in the agreement
                </li>
                <li>
                  We may retain copies of work for our records and portfolio use
                </li>
                <li>
                  Outstanding invoices remain due regardless of termination
                </li>
              </ul>
            </section>

            {/* Confidentiality */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                Confidentiality
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We respect the confidentiality of your business information. We
                will not disclose confidential information you share with us,
                except:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>With your consent</li>
                <li>To subcontractors bound by confidentiality agreements</li>
                <li>When required by law</li>
                <li>To enforce our rights under these Terms</li>
              </ul>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Dispute Resolution</h2>
              <p className="text-muted-foreground leading-relaxed">
                In the event of a dispute:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>
                  We encourage good-faith negotiation to resolve issues amicably
                </li>
                <li>
                  If negotiation fails, disputes will be resolved through
                  binding arbitration
                </li>
                <li>These Terms are governed by the laws of Ghana</li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes
                will be effective immediately upon posting to this page. Your
                continued use of our services after changes constitutes
                acceptance of the modified Terms. We encourage you to review
                these Terms periodically.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is found to be unenforceable or
                invalid, that provision will be limited or eliminated to the
                minimum extent necessary, and the remaining provisions will
                remain in full force and effect.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-muted/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-500" />
                Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please
                contact us at:
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
