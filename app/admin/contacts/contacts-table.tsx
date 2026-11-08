"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Eye, Mail, Trash2, Search, CheckCircle, Clock, X } from "lucide-react";
import { updateContactStatus, deleteContact } from "./actions";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  projectType: string;
  budget: string | null;
  message: string;
  status: string;
  createdAt: Date;
};

interface ContactsTableProps {
  contacts: Contact[];
}

export function ContactsTable({
  contacts: initialContacts,
}: ContactsTableProps) {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter((contact) => {
    const matchesFilter = filter === "all" || contact.status === filter;
    const matchesSearch =
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase()) ||
      contact.projectType.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    const result = await updateContactStatus(id, status);
    if (result.success) {
      setContacts(contacts.map((c) => (c.id === id ? { ...c, status } : c)));
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    const result = await deleteContact(id);
    if (result.success) {
      setContacts(contacts.filter((c) => c.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      New: "bg-green-500/10 text-green-500",
      Read: "bg-blue-500/10 text-blue-500",
      Replied: "bg-purple-500/10 text-purple-500",
    };
    return (
      styles[status as keyof typeof styles] || "bg-muted text-muted-foreground"
    );
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {["all", "New", "Read", "Replied"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`whitespace-nowrap rounded-lg px-3 sm:px-4 py-2 text-sm font-medium transition-colors flex-shrink-0 ${
                filter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-accent"
              }`}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  Project
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Budget
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
                <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xs sm:text-sm font-medium">
                            {contact.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate text-sm">
                            {contact.name}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {contact.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 hidden sm:table-cell">
                      <p className="text-sm">{contact.projectType}</p>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 hidden md:table-cell">
                      <p className="text-sm">
                        {contact.budget || "Not specified"}
                      </p>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                          contact.status
                        )}`}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 hidden lg:table-cell">
                      <p className="text-sm text-muted-foreground">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedContact(contact);
                            if (contact.status === "New") {
                              handleStatusUpdate(contact.id, "Read");
                            }
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(contact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No messages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="w-full max-w-2xl rounded-xl border-2 border-border/50 shadow-2xl"
            style={{
              background: "hsl(var(--background) / 0.98)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-lg font-medium">
                    {selectedContact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedContact.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedContact.email}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedContact(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Project Type
                  </p>
                  <p className="font-medium">{selectedContact.projectType}</p>
                </div>
                {selectedContact.phone && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Phone
                    </p>
                    <p className="font-medium">{selectedContact.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Budget
                  </p>
                  <p className="font-medium">
                    {selectedContact.budget || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Date
                  </p>
                  <p className="font-medium">
                    {new Date(selectedContact.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Status
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                      selectedContact.status
                    )}`}
                  >
                    {selectedContact.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Message
                </p>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border p-4 sm:p-6">
              <div className="flex gap-2">
                {selectedContact.status !== "Replied" && (
                  <Button
                    size="sm"
                    onClick={() =>
                      handleStatusUpdate(selectedContact.id, "Replied")
                    }
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark as Replied
                  </Button>
                )}
                {selectedContact.status === "Replied" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleStatusUpdate(selectedContact.id, "Read")
                    }
                    className="gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Mark as Read
                  </Button>
                )}
              </div>
              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.projectType} - AxiomCraft`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
