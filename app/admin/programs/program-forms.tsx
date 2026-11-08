"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { createCourse, createProgram } from "./actions";

type Program = { id: string; name: string; college: string | null };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending} className="bg-[rgb(6,119,0)] text-white hover:bg-[rgb(6,95,0)]">{pending ? "Saving..." : label}</Button>;
}

export function ProgramForms({ programs }: { programs: Program[] }) {
  const [programMessage, setProgramMessage] = useState("");
  const [courseMessage, setCourseMessage] = useState("");

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <form action={async (formData) => {
        const result = await createProgram(formData);
        setProgramMessage(result.success ? "Program added." : result.error || "Could not add program.");
        if (result.success) (document.querySelector("#program-form") as HTMLFormElement)?.reset();
      }} id="program-form" className="space-y-4 rounded-xl border border-border bg-background p-5">
        <div>
          <h2 className="font-semibold">Add program</h2>
          <p className="mt-1 text-xs text-muted-foreground">Example: Computer Science.</p>
        </div>
        <div className="space-y-2"><Label htmlFor="program-name">Program name</Label><Input id="program-name" name="name" required /></div>
        <div className="space-y-2"><Label htmlFor="college">College or faculty <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id="college" name="college" /></div>
        <SubmitButton label="Add program" />
        {programMessage && <p className="text-sm text-muted-foreground">{programMessage}</p>}
      </form>

      <form action={async (formData) => {
        const result = await createCourse(formData);
        setCourseMessage(result.success ? "Course added." : result.error || "Could not add course.");
        if (result.success) (document.querySelector("#course-form") as HTMLFormElement)?.reset();
      }} id="course-form" className="space-y-4 rounded-xl border border-border bg-background p-5">
        <div>
          <h2 className="font-semibold">Add course</h2>
          <p className="mt-1 text-xs text-muted-foreground">Connect each course to a programme and level.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="code">Course code</Label><Input id="code" name="code" placeholder="BIO 101" required /></div>
          <div className="space-y-2"><Label htmlFor="course-level">Level</Label><select id="course-level" name="level" required className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">{[100, 200, 300, 400, 500, 600].map((level) => <option key={level} value={level}>{level}</option>)}</select></div>
        </div>
        <div className="space-y-2"><Label htmlFor="title">Course title</Label><Input id="title" name="title" placeholder="Introduction to Biology" required /></div>
        <div className="space-y-2"><Label htmlFor="program-id">Program</Label><select id="program-id" name="programId" required className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">Select program</option>{programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}</select></div>
        <SubmitButton label="Add course" />
        {courseMessage && <p className="text-sm text-muted-foreground">{courseMessage}</p>}
      </form>
    </div>
  );
}
