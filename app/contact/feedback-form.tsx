"use client";

import { useState } from "react";
import { submitComplaint } from "@/app/actions/complaints";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";

export function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form action={async (formData) => {
      setIsSubmitting(true);
      const result = await submitComplaint(formData);
      setMessage(result.success ? "Your feedback was submitted privately." : result.error || "Submission failed.");
      setIsSubmitting(false);
    }} className="mt-10 rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold">Private feedback</h2>
      <p className="mt-2 text-sm text-muted-foreground">Submit a concern or suggestion to hall leadership.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="feedback-type">Type</Label><select id="feedback-type" name="type" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="complaint">Complaint</option><option value="suggestion">Suggestion</option></select></div>
        <div className="space-y-2"><Label htmlFor="feedback-subject">Subject</Label><Input id="feedback-subject" name="subject" required placeholder="What is this about?" /></div>
        <div className="space-y-2 sm:col-span-2"><Label htmlFor="feedback-details">Details</Label><Textarea id="feedback-details" name="details" required minLength={10} rows={5} placeholder="Share the details..." /></div>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" name="anonymous" /> Submit anonymously</label>
      <Button type="submit" disabled={isSubmitting} className="mt-6 bg-[rgb(6,119,0)] text-white hover:bg-[rgb(6,95,0)]">{isSubmitting ? "Submitting..." : "Submit feedback"}</Button>
      {message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}
    </form>
  );
}
