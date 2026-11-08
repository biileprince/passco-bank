"use client";

import { useMemo, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { createResource } from "./actions";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

type Program = { id: string; name: string };
type Course = { id: string; code: string; title: string; level: number; programId: string };

export function ResourceForm({ programs, courses }: { programs: Program[]; courses: Course[] }) {
  const [programId, setProgramId] = useState("");
  const [level, setLevel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCourses = useMemo(
    () => courses.filter((course) => course.programId === programId && String(course.level) === level),
    [courses, level, programId],
  );

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setStatus("Select a file to upload.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Uploading file...");
    try {
      const upload = await uploadToCloudinary(file, "oguaa-hall/resources");
      const formData = new FormData(event.currentTarget);
      formData.set("fileUrl", upload.url);
      formData.set("cloudinaryPublicId", upload.publicId);
      formData.set("fileName", file.name);
      formData.set("fileFormat", file.name.split(".").pop() || "file");
      formData.set("fileSize", String(file.size));
      const result = await createResource(formData);
      setStatus(result.success ? "Resource uploaded and queued for approval." : result.error || "Resource could not be saved.");
      if (result.success) {
        event.currentTarget.reset();
        setFile(null);
        setProgramId("");
        setLevel("");
      }
    } catch (error) {
      console.error("Resource upload failed:", error);
      setStatus("Upload failed. Check the file and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-background p-5">
      <div>
        <h2 className="font-semibold">Upload resource</h2>
        <p className="mt-1 text-xs text-muted-foreground">New uploads remain hidden until approved.</p>
      </div>
      <div className="space-y-2"><Label htmlFor="resource-title">Title</Label><Input id="resource-title" name="title" placeholder="Introduction to Biology — Week 1" required /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="resource-type">Type</Label><select id="resource-type" name="type" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="lecture-slide">Lecture slide</option><option value="note">Note</option><option value="past-question">Past question</option></select></div>
        <div className="space-y-2"><Label htmlFor="resource-file">File</Label><Input id="resource-file" type="file" accept=".pdf,.ppt,.pptx,.doc,.docx" required onChange={(event) => setFile(event.target.files?.[0] || null)} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="resource-program">Program</Label><select id="resource-program" name="programId" required value={programId} onChange={(event) => { setProgramId(event.target.value); setLevel(""); }} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">Select program</option>{programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}</select></div>
        <div className="space-y-2"><Label htmlFor="resource-level">Level</Label><select id="resource-level" name="level" required value={level} onChange={(event) => setLevel(event.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">Select level</option>{[100, 200, 300, 400, 500, 600].map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
      </div>
      <div className="space-y-2"><Label htmlFor="resource-course">Course</Label><select id="resource-course" name="courseId" required disabled={!programId || !level} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">Select course</option>{filteredCourses.map((course) => <option key={course.id} value={course.id}>{course.code} — {course.title}</option>)}</select></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="academic-year">Academic year <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id="academic-year" name="academicYear" placeholder="2025/2026" /></div>
        <div className="space-y-2"><Label htmlFor="semester">Semester <span className="font-normal text-muted-foreground">(optional)</span></Label><select id="semester" name="semester" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">Select semester</option><option value="First">First</option><option value="Second">Second</option></select></div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="bg-[rgb(6,119,0)] text-white hover:bg-[rgb(6,95,0)]">{isSubmitting ? "Uploading..." : "Upload resource"}</Button>
      {status && <p className="text-sm text-muted-foreground">{status}</p>}
    </form>
  );
}
