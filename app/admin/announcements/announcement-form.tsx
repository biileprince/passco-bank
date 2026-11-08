"use client";

import { useState } from "react";
import { createAnnouncement } from "./actions";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";

export function AnnouncementForm() {
  const [message, setMessage] = useState("");
  return (
    <form action={async (formData) => {
      const result = await createAnnouncement(formData);
      setMessage(result.success ? "Announcement saved." : result.error || "Could not save announcement.");
      if (result.success) (document.getElementById("announcement-form") as HTMLFormElement | null)?.reset();
    }} id="announcement-form" className="space-y-4 rounded-xl border border-border bg-background p-5">
      <h2 className="font-semibold">Create announcement</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2"><Label htmlFor="announcement-title">Title</Label><Input id="announcement-title" name="title" required /></div>
        <div className="space-y-2"><Label htmlFor="announcement-category">Category</Label><select id="announcement-category" name="category" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="notice">Notice</option><option value="deadline">Deadline</option><option value="meeting">Meeting</option><option value="opportunity">Opportunity</option></select></div>
        <div className="flex items-end gap-4 pb-2 text-sm"><label className="flex items-center gap-2"><input type="checkbox" name="published" /> Publish now</label><label className="flex items-center gap-2"><input type="checkbox" name="pinned" /> Pin notice</label></div>
        <div className="space-y-2 sm:col-span-2"><Label htmlFor="announcement-content">Content</Label><Textarea id="announcement-content" name="content" required minLength={10} rows={5} /></div>
      </div>
      <Button type="submit" className="bg-[rgb(6,119,0)] text-white hover:bg-[rgb(6,95,0)]">Save announcement</Button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </form>
  );
}
