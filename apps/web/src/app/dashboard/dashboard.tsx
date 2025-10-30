"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import ProjectList from "./ProjectList";
import ProjectDialog from "./ProjectDialog";

export default function Dashboard({
	customerState,
	session,
}: {
	customerState: ReturnType<typeof authClient.customer.state>;
	session: typeof authClient.$Infer.Session;
}) {
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<'add' | 'edit'>('add');
	const [selectedProject, setSelectedProject] = useState<any>(null);

	const handleAddProject = () => {
		setMode('add');
		setSelectedProject(null);
		setOpen(true);
	};

	const handleEditProject = (project: any) => {
		setMode('edit');
		setSelectedProject(project);
		setOpen(true);
	};

	return (
		<>
			<div className="mb-4">
				<Button onClick={handleAddProject}>Add Project</Button>
			</div>
			<ProjectList onEdit={handleEditProject} />
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{mode === 'edit' ? 'Edit Project' : 'Add New Project'}</DialogTitle>
					</DialogHeader>
					<ProjectDialog mode={mode} project={selectedProject} onClose={() => setOpen(false)} />
				</DialogContent>
			</Dialog>
		</>
	);
}
