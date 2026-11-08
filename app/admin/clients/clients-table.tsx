"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Mail, Search, FolderKanban } from "lucide-react";

type Client = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  image: string | null;
  createdAt: Date;
  projectCount: number;
  totalSpent: number;
  pendingAmount: number;
};

interface ClientsTableProps {
  clients: Client[];
}

export function ClientsTable({ clients: initialClients }: ClientsTableProps) {
  const [clients] = useState(initialClients);
  const [search, setSearch] = useState("");

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      (client.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      (client.company?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchesSearch;
  });

  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Projects
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Total Spent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Pending
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden xl:table-cell">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {client.image ? (
                          <Image
                            src={client.image}
                            alt={client.name || "Client"}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="text-sm font-medium">
                              {(client.name || client.email)
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {client.name || "No name"}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <p className="text-sm">{client.company || "—"}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{client.projectCount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <p className="text-sm font-medium text-green-500">
                        ${client.totalSpent.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <p className="text-sm text-amber-500">
                        ${client.pendingAmount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell">
                      <p className="text-sm text-muted-foreground">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="p-2 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <a
                          href={`mailto:${client.email}`}
                          className="p-2 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No clients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
