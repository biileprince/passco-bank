"use client";

import { useState } from "react";
import { submitResourceRequest } from "@/app/actions/resource-requests";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";

export function ResourceRequestForm({ type }: { type: "lecture-slide" | "past-question" | "note" }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      action={async (formData) => {
        setIsSubmitting(true);
        const result = await submitResourceRequest(formData);
        setMessage(result.success ? "Your request was submitted to the academic team." : result.error || "Request failed.");
        setIsSubmitting(false);
      }}
      id="resource-request-form"
      className="mt-10 rounded-2xl border border-[rgb(6,119,0)]/20 bg-[rgb(255,217,0)]/10 p-6 sm:p-8"
    >
      <input type="hidden" name="type" value={type} />
      <h2 className="text-xl font-semibold">Request a missing resource</h2>
      <p className="mt-2 text-sm text-muted-foreground">Tell the hall academic team what you need. You must be signed in to submit a request.</p>
      <div className="mt-6 grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="resource-request-title">Course or resource title</Label>
          <Input id="resource-request-title" name="title" required minLength={3} placeholder="BIO 101 — First semester past questions" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resource-request-details">Details</Label>
          <Textarea id="resource-request-details" name="details" required minLength={10} rows={4} placeholder="Include the course code, level, semester, and year if known." />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="mt-5 bg-[rgb(6,119,0)] text-white hover:bg-[rgb(6,95,0)]">
        {isSubmitting ? "Submitting..." : "Submit request"}
      </Button>
      {message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}
    </form>
  );
}
