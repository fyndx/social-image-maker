"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { useState } from "react";

export default function Dashboard({
	customerState,
	session,
}: {
	customerState: ReturnType<typeof authClient.customer.state>;
	session: typeof authClient.$Infer.Session;
}) {
	const queryClient = useQueryClient();

	const { data: projects, isLoading, error } = useQuery(orpc.projects.getAll.queryOptions({ input: {} }));

	const createMutation = useMutation(
		orpc.projects.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.projects.getAll.queryKey({ input: {} }) });
				setNewProject({ name: "", domain: "" });
			},
		}),
	);

	const updateMutation = useMutation(
		orpc.projects.update.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.projects.getAll.queryKey({ input: {} }) });
				setEditingId(null);
				setEditProject({ name: "", domain: "" });
			},
		}),
	);

	const deleteMutation = useMutation(
		orpc.projects.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.projects.getAll.queryKey({ input: {} }) });
			},
		}),
	);

	const [newProject, setNewProject] = useState({ name: "", domain: "" });
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editProject, setEditProject] = useState({ name: "", domain: "" });

	const handleCreate = () => {
		if (newProject.name && newProject.domain) {
			createMutation.mutate({ name: newProject.name, domain: newProject.domain });
		}
	};

	const handleEdit = (project: any) => {
		setEditingId(project.id);
		setEditProject({ name: project.name, domain: project.domain });
	};

	const handleUpdate = () => {
		if (editingId && (editProject.name || editProject.domain)) {
			updateMutation.mutate({ id: editingId, name: editProject.name || undefined, domain: editProject.domain || undefined });
		}
	};

	const handleDelete = (id: string) => {
		deleteMutation.mutate({ id });
	};

	return (
		<>

			<div className="mt-8">
				<h2 className="text-xl font-bold mb-4">Projects</h2>
				{isLoading && <p>Loading projects...</p>}
				{error && <p className="text-red-500">Error loading projects: {error.message}</p>}
				{projects && projects.length === 0 && !isLoading && (
					<p>No projects yet. Add one below.</p>
				)}
				{projects && projects.length > 0 && (
					<ul className="space-y-2 mb-4">
						{projects.map((project: any) => (
							<li key={project.id} className="flex items-center justify-between p-4 border rounded">
								{editingId === project.id ? (
									<div className="flex space-x-2">
										<Input
											value={editProject.name}
											onChange={(e) => setEditProject({ ...editProject, name: e.target.value })}
											placeholder="Name"
										/>
										<Input
											value={editProject.domain}
											onChange={(e) => setEditProject({ ...editProject, domain: e.target.value })}
											placeholder="Domain"
										/>
										<Button onClick={handleUpdate} disabled={updateMutation.isPending}>
											{updateMutation.isPending ? "Saving..." : "Save"}
										</Button>
										<Button variant="outline" onClick={() => setEditingId(null)}>
											Cancel
										</Button>
									</div>
								) : (
									<div className="flex items-center space-x-4">
										<span>{project.name}</span>
										<span>{project.domain}</span>
										<Button variant="outline" onClick={() => handleEdit(project)}>
											Edit
										</Button>
										<Button variant="destructive" onClick={() => handleDelete(project.id)} disabled={deleteMutation.isPending}>
											{deleteMutation.isPending ? "Deleting..." : "Delete"}
										</Button>
									</div>
								)}
							</li>
						))}
					</ul>
				)}
				{updateMutation.error && <p className="text-red-500">Error updating project: {updateMutation.error.message}</p>}
				{deleteMutation.error && <p className="text-red-500">Error deleting project: {deleteMutation.error.message}</p>}

				<div className="mt-4">
					<h3 className="text-lg font-semibold mb-2">Add New Project</h3>
					<div className="flex space-x-2">
						<Input
							value={newProject.name}
							onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
							placeholder="Project Name"
						/>
						<Input
							value={newProject.domain}
							onChange={(e) => setNewProject({ ...newProject, domain: e.target.value })}
							placeholder="Domain (e.g., https://example.com)"
						/>
						<Button onClick={handleCreate} disabled={createMutation.isPending}>
							{createMutation.isPending ? "Creating..." : "Create"}
						</Button>
					</div>
					{createMutation.error && <p className="text-red-500 mt-2">Error creating project: {createMutation.error.message}</p>}
				</div>
			</div>
		</>
	);
}
