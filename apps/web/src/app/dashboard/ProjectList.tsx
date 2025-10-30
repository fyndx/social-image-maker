"use client";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

export default function ProjectList({ onEdit }: { onEdit: (project: any) => void }) {
	const queryClient = useQueryClient();

	const { data: projects, isLoading, error } = useQuery(orpc.projects.getAll.queryOptions({ input: {} }));

	const deleteMutation = useMutation(
		orpc.projects.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.projects.getAll.queryKey({ input: {} }) });
			},
		}),
	);

	const handleDelete = (id: string) => {
		deleteMutation.mutate({ id });
	};

	return (
		<div>
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
							<div className="flex items-center space-x-4">
								<span>{project.name}</span>
								<span>{project.domain}</span>
								<Button variant="outline" onClick={() => onEdit(project)}>
									Edit
								</Button>
								<Button variant="destructive" onClick={() => handleDelete(project.id)} disabled={deleteMutation.isPending}>
									{deleteMutation.isPending ? "Deleting..." : "Delete"}
								</Button>
							</div>
						</li>
					))}
				</ul>
			)}
			{deleteMutation.error && <p className="text-red-500">Error deleting project: {deleteMutation.error.message}</p>}
		</div>
	);
}
