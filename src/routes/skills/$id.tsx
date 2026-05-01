import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { deleteSkill } from "#/server/skills/delete-skill";
import { getSkill } from "#/server/skills/get-skill";

export const Route = createFileRoute("/skills/$id")({
	loader: async ({ params }) =>
		getSkill({
			data: {
				id: params.id,
			},
		}),
	component: SkillDetailPage,
});

function SkillDetailPage() {
	const { skill, canEdit } = Route.useLoaderData();
	const navigate = useNavigate();
	const deleteSkillFn = useServerFn(deleteSkill);
	const [serverError, setServerError] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		const confirmed = window.confirm(
			`Supprimer "${skill.title}" ? Cette action est definitive.`,
		);

		if (!confirmed) {
			return;
		}

		setServerError(null);
		setIsDeleting(true);

		try {
			await deleteSkillFn({
				data: {
					id: skill.id,
				},
			});

			await navigate({ to: "/" });
		} catch (error) {
			setServerError(
				error instanceof Error
					? error.message
					: "Erreur pendant la suppression.",
			);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<section id="skill-detail">
			<div className="detail-shell">
				<div className="detail-card">
					<div className="detail-topline">
						<Link to="/" className="detail-back">
							<span>Retour</span>
						</Link>

						{canEdit ? (
							<div className="detail-actions">
								<Link
									to="/skills/$id/edit"
									params={{ id: skill.id }}
									className="btn-secondary"
								>
									Modifier
								</Link>
								<button
									type="button"
									className="btn-primary destructive"
									onClick={handleDelete}
									disabled={isDeleting}
								>
									{isDeleting ? "Suppression..." : "Supprimer"}
								</button>
							</div>
						) : null}
					</div>

					<header className="detail-header">
						<div className="detail-meta">
							<div className="detail-author">
								<img
									src={skill.author.imageUrl ?? "/logo512.png"}
									alt={`${skill.author.fullName} avatar`}
									className="avatar"
								/>
								<div>
									<p className="detail-author-name">{skill.author.fullName}</p>
									<p className="detail-author-subtitle">
										@{skill.author.username} - Cree le{" "}
										{skill.createdAt
											? new Date(skill.createdAt).toLocaleDateString()
											: "unknown"}
									</p>
								</div>
							</div>

							<div className="detail-tags">
								{skill.tags.map((tag) => (
									<span key={tag} className="detail-tag">
										{tag}
									</span>
								))}
							</div>
						</div>

						<div className="detail-copy">
							<h1>{skill.title}</h1>
							<p>{skill.description}</p>
						</div>
					</header>

					<div className="detail-grid">
						<section className="detail-panel">
							<h2>Install command</h2>
							<pre>
								{skill.installCommand ?? "No install command provided."}
							</pre>
						</section>

						<section className="detail-panel">
							<h2>Prompt config</h2>
							<p>{skill.promptConfig ?? "No prompt configuration provided."}</p>
						</section>

						<section className="detail-panel">
							<h2>Usage example</h2>
							<p>{skill.usageExample ?? "No usage example provided."}</p>
						</section>
					</div>

					{serverError ? <p className="detail-error">{serverError}</p> : null}
				</div>

				<Outlet />
			</div>
		</section>
	);
}
