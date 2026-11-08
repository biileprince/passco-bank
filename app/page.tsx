import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, FileQuestion, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/app/components/ui/button";

const priorities = [
  {
    icon: BookOpen,
    title: "Academic access",
    description: "Find lecture slides, notes, and past questions organised by programme, level, and course.",
  },
  {
    icon: Users,
    title: "A connected hall",
    description: "Stay informed about notices, opportunities, and the community life that makes Oguaa home.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible leadership",
    description: "A clear channel for concerns, suggestions, and practical action on issues affecting residents.",
  },
];

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative isolate min-h-[680px] overflow-hidden bg-background">
        <Image src="/kwame-eugene.jpeg" alt="" fill className="pointer-events-none object-cover object-top opacity-[0.06] blur-sm" sizes="100vw" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(6,119,0)]/10 via-background/90 to-[rgb(255,217,0)]/10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[rgb(255,217,0)]/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-24 pt-36 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-32 lg:pt-44">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Kwame Eugene • Oguaa Hall Representative
            </p>
            <h1 className="text-5xl font-bold leading-[0.98] tracking-tight sm:text-7xl">
              A stronger hall starts with               <span className="text-[rgb(6,119,0)]">access.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              An independent student platform created by Kwame Eugene, current Oguaa Hall Representative and aspiring Hall President, to share academic resources and present a practical campaign vision.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/resources">
                <Button size="lg" className="w-full rounded-full bg-[rgb(6,119,0)] px-7 text-white hover:bg-[rgb(6,95,0)] sm:w-auto">
                  Explore resources <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full rounded-full px-7 sm:w-auto">
                  Meet the vision
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[rgb(6,119,0)]/30 bg-[rgb(6,119,0)] p-3 shadow-2xl shadow-[rgb(6,119,0)]/25">
              <Image src="/kwame-eugene.jpeg" alt="Kwame Eugene, Oguaa Hall Representative" fill priority className="object-cover object-top" sizes="(max-width: 1024px) 90vw, 400px" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(6,119,0)]/95 via-[rgb(6,119,0)]/20 to-[rgb(255,217,0)]/10" />
              <div className="relative flex h-full flex-col justify-end p-5 text-white sm:p-7">
                <div className="mb-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[rgb(255,217,0)]/90 p-2 shadow-lg">
                  <Image src="/oguaa-hall-logo.png" alt="Oguaa Hall logo" width={80} height={80} className="h-full w-full object-contain" />
                </div>
                <p className="text-sm uppercase tracking-[0.2em] text-[rgb(255,217,0)]">The campaign</p>
                <h2 className="mt-3 text-3xl font-semibold">Serve. Connect. Advance.</h2>
                <p className="mt-3 text-sm leading-6 text-white/85">
                  Kwame Eugene&apos;s independent campaign and student-resource platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl bg-muted/30 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[rgb(6,119,0)]">The promise</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Practical leadership for everyday student life.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Kwame Eugene&apos;s campaign is designed around the things students need most: useful academic support, timely information, and leadership that listens.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {priorities.map((priority) => {
            const Icon = priority.icon;
            return (
              <article key={priority.title} className="rounded-2xl border border-border bg-background p-7 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgb(255,217,0)]/30 text-[rgb(6,119,0)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{priority.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{priority.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[rgb(6,119,0)]">Built for Oguaa students</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Your next course resource is closer than you think.</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">Browse the library now. Student accounts unlock downloads and resource requests.</p>
          </div>
          <Link href="/resources">
            <Button size="lg" className="rounded-full bg-[rgb(6,119,0)] px-7 text-white hover:bg-[rgb(6,95,0)]">
              View resource library <FileQuestion className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
