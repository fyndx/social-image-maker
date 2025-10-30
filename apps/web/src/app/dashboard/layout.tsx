"use client";

import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex items-center border-b p-4">
          <SidebarTrigger />
        </div>
        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
