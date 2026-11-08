import Link from "next/link";
import { ArrowRight, BookOpen, HeartHandshake, Landmark } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <Image src="/kwame-eugene.jpeg" alt="" fill className="pointer-events-none object-cover object-top opacity-10" sizes="100vw" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(252,217,20,0.22),transparent_38%),linear-gradient(115deg,rgba(6,119,0,0.08),transparent_55%)]" />
      <div className="relative mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[rgb(6,119,0)]">Kwame Eugene for Oguaa Hall President</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">A campaign built around service, access, and progress.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          Kwame Eugene is the current Oguaa Hall Representative and an aspiring Hall President. He is building this independent student platform to share lecture slides, notes, past questions, hall updates, and practical ideas for a stronger student community.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: Landmark, title: "The candidate", description: "Kwame Eugene currently serves as an Oguaa Hall Representative and is seeking the mandate to lead as Hall President." },
            { icon: BookOpen, title: "The platform", description: "A student-led academic library for lecture slides, notes, and past questions across programmes." },
            { icon: HeartHandshake, title: "The vision", description: "Leadership that listens, communicates clearly, and turns student concerns into practical action." },
          ].map(({ icon: FeatureIcon, title, description }) => {
            return (
              <article key={title} className="rounded-2xl border border-border bg-background/90 p-7 backdrop-blur-sm">
                <FeatureIcon className="h-7 w-7 text-[rgb(6,119,0)]" />
                <h2 className="mt-6 text-xl font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-10">
          <Link href="/resources">
            <Button className="rounded-full bg-[rgb(6,119,0)] text-white hover:bg-[rgb(6,95,0)]">
              Visit the resource centre <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
