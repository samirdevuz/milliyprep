"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export interface DashboardUser {
  name: string;
  email?: string;
  phone?: string;
  isAdmin?: boolean;
}

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: DashboardUser;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-50/60">
      <Sidebar open={open} onClose={() => setOpen(false)} user={user} />
      <div className="lg:pl-64">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
