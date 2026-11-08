"use client";

import { useState } from "react";
import { createEvent } from "./actions";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";

export function EventForm() {
  const [message, setMessage] = useState("");
  return (
    <form action={async (formData) => {
      const result = await createEvent(formData);
      setMessage(result.success ? "Event saved." : result.error || "Could not save event.");
      if (result.success) (document.getElementById("event-form") as HTMLFormElement | null)?.reset();
    }} id="event-form" className="space-y-4 rounded-xl border border-border bg-background p-5">
      <h2 className="font-semibold">Create event</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2"><Label htmlFor="event-title">Title</Label><Input id="event-title" name="title" required /></div>
        <div className="space-y-2"><Label htmlFor="starts-at">Date and time</Label><Input id="starts-at" name="startsAt" type="datetime-local" required /></div>
        <div className="space-y-2"><Label htmlFor="location">Location <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id="location" name="location" /></div>
        <div className="space-y-2 sm:col-span-2"><Label htmlFor="event-description">Description</Label><Textarea id="event-description" name="description" rows={4} required minLength={10} /></div>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" /> Publish now</label>
      <Button type="submit" className="bg-[rgb(6,119,0)] text-white hover:bg-[rgb(6,95,0)]">Save event</Button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </form>
  );
}
