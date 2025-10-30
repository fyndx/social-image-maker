

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex-1">
				<div className="flex items-center p-4 border-b">
					<SidebarTrigger />
				</div>
				<div className="p-4">
					{children}
				</div>
			</main>
		</SidebarProvider>
	);
}
