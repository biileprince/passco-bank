import Link from "next/link";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { FeedbackForm } from "./feedback-form";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[rgb(6,119,0)]">Contact Oguaa Hall</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">Your voice belongs in the conversation.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Reach the hall leadership team with an enquiry, concern, or suggestion. A private complaints and suggestions workflow will be connected here in the next implementation phase.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <a href="mailto:oguaahall@ucc.edu.gh" className="rounded-2xl border border-border bg-background p-7 hover:border-emerald-500">
            <Mail className="h-6 w-6 text-[rgb(6,119,0)]" />
            <h2 className="mt-5 font-semibold">Email</h2>
            <p className="mt-2 text-sm text-muted-foreground">oguaahall@ucc.edu.gh</p>
          </a>
          <a href="tel:+233000000000" className="rounded-2xl border border-border bg-background p-7 hover:border-emerald-500">
            <Phone className="h-6 w-6 text-[rgb(6,119,0)]" />
            <h2 className="mt-5 font-semibold">Hall office</h2>
            <p className="mt-2 text-sm text-muted-foreground">Contact details to be confirmed</p>
          </a>
          <Link href="/login" className="rounded-2xl border border-border bg-background p-7 hover:border-emerald-500">
            <MessageSquare className="h-6 w-6 text-[rgb(6,119,0)]" />
            <h2 className="mt-5 font-semibold">Private feedback</h2>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to submit a concern or suggestion</p>
          </Link>
        </div>
        <FeedbackForm />
      </div>
    </div>
  );
}
