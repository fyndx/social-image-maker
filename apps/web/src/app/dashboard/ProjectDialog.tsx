"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { useState, useEffect } from "react";

interface ProjectDialogProps {
	mode: 'add' | 'edit';
	project?: any;
	onClose: () => void;
}

export default function ProjectDialog({ mode, project, onClose }: ProjectDialogProps) {
	const queryClient = useQueryClient();
	const isEditing = mode === 'edit';

	const createMutation = useMutation(
		orpc.projects.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.projects.getAll.queryKey({ input: {} }) });
				setFormData({ name: "", domain: "" });
				onClose();
			},
		}),
	);

	const updateMutation = useMutation(
		orpc.projects.update.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.projects.getAll.queryKey({ input: {} }) });
				onClose();
			},
		}),
	);

	const [formData, setFormData] = useState({ name: "", domain: "" });

	useEffect(() => {
		if (isEditing && project) {
			setFormData({ name: project.name, domain: project.domain });
		} else {
			setFormData({ name: "", domain: "" });
		}
	}, [isEditing, project]);

	const handleSubmit = () => {
		if (isEditing && project) {
			updateMutation.mutate({ id: project.id, name: formData.name || undefined, domain: formData.domain || undefined });
		} else {
			if (formData.name && formData.domain) {
				createMutation.mutate({ name: formData.name, domain: formData.domain });
			}
		}
	};

	return (
		<div>
			<div className="space-y-4">
				<Input
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					placeholder="Project Name"
				/>
				<Input
					value={formData.domain}
					onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
					placeholder="Domain (e.g., https://example.com)"
				/>
				<div className="flex justify-end space-x-2">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
						{isEditing ? (updateMutation.isPending ? "Saving..." : "Save") : (createMutation.isPending ? "Creating..." : "Create")}
					</Button>
				</div>
			</div>
			{createMutation.error && <p className="text-red-500 mt-2">Error creating project: {createMutation.error.message}</p>}
			{updateMutation.error && <p className="text-red-500 mt-2">Error updating project: {updateMutation.error.message}</p>}
		</div>
	);
}
