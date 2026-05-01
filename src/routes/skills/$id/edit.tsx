import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getEditableSkill } from "#/server/skills/get-editable-skill";
import { updateSkill } from "#/server/skills/update-skill";
import { Route as SkillDetailRoute } from "../$id";

type SkillFormValues = {
	title: string;
	description: string;
	tags: string;
	installCommand: string;
	promptConfig: string;
	usageExample: string;
};

export const Route = createFileRoute("/skills/$id/edit")({
	loader: async ({ params }) =>
		getEditableSkill({
			data: {
				id: params.id,
			},
		}),
	component: EditSkillPage,
});

function EditSkillPage() {
	const skill = SkillDetailRoute.useLoaderData().skill;
	const navigate = useNavigate();
	const updateSkillFn = useServerFn(updateSkill);
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SkillFormValues>({
		defaultValues: {
			title: skill.title,
			description: skill.description,
			tags: skill.tags.join(", "),
			installCommand: skill.installCommand ?? "",
			promptConfig: skill.promptConfig ?? "",
			usageExample: skill.usageExample ?? "",
		},
	});

	const onSubmit = async (values: SkillFormValues) => {
		setServerError(null);
		const normalizedTags = values.tags
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);

		try {
			await updateSkillFn({
				data: {
					id: skill.id,
					title: values.title,
					description: values.description,
					tags: normalizedTags,
					installCommand: values.installCommand || null,
					promptConfig: values.promptConfig || null,
					usageExample: values.usageExample || null,
				},
			});

			await navigate({
				to: "/skills/$id",
				params: { id: skill.id },
			});
		} catch (error) {
			setServerError(
				error instanceof Error
					? error.message
					: "Erreur pendant la modification du skill.",
			);
		}
	};

	return (
		<section id="skill-edit">
			<div className="edit-shell">
				<Link
					to="/skills/$id"
					params={{ id: skill.id }}
					className="detail-back"
				>
					<span>Retour au detail</span>
				</Link>

				<div className="edit-layout">
					<div className="edit-main">
						<div className="edit-hero">
							<span className="edit-badge">Edition du skill</span>

							<h1>
								Modifier <span className="text-gradient">{skill.title}</span>
							</h1>
							<p>
								Ajuste le contenu sans changer l'identite du skill. La structure
								est pensee pour etre rapide a relire et facile a maintenir.
							</p>

							<div className="edit-meta">
								<div className="edit-meta-item">
									<span className="edit-meta-label">Auteur</span>
									<span className="edit-meta-value">
										{skill.author.fullName}
									</span>
								</div>
								<div className="edit-meta-item">
									<span className="edit-meta-label">Tags</span>
									<span className="edit-meta-value">
										{skill.tags.length} valeurs
									</span>
								</div>
								<div className="edit-meta-item">
									<span className="edit-meta-label">Statut</span>
									<span className="edit-meta-value">Modifiable</span>
								</div>
							</div>
						</div>

						<div className="edit-card">
							<form onSubmit={handleSubmit(onSubmit)} className="edit-form">
								<div className="form-item">
									<label htmlFor="title" className="form-label">
										Titre
									</label>
									<input
										id="title"
										className="input-field"
										placeholder="Ex: Assistant de recherche ultra-rapide"
										{...register("title", {
											required: "Le titre est obligatoire",
											minLength: { value: 3, message: "Minimum 3 caracteres" },
										})}
									/>
									{errors.title ? (
										<p className="form-message">{errors.title.message}</p>
									) : null}
								</div>

								<div className="form-item">
									<label htmlFor="description" className="form-label">
										Description
									</label>
									<textarea
										id="description"
										rows={5}
										className="input-field input-field-textarea input-field-description"
										placeholder="Decris ce que fait le skill, pour qui il est utile et dans quel contexte il brille."
										{...register("description", {
											required: "La description est obligatoire",
											minLength: {
												value: 10,
												message: "Minimum 10 caracteres",
											},
										})}
									/>
									<p className="form-description">
										Une bonne description aide les autres a comprendre la valeur
										du skill en quelques secondes.
									</p>
									{errors.description ? (
										<p className="form-message">{errors.description.message}</p>
									) : null}
								</div>

								<div className="edit-grid">
									<div className="form-item">
										<label htmlFor="tags" className="form-label">
											Tags
										</label>
										<input
											id="tags"
											className="input-field"
											placeholder="react, ai, automation"
											{...register("tags", {
												required: "Ajoute au moins un tag",
											})}
										/>
										<p className="form-description">
											Separe les tags par des virgules. Les espaces seront
											nettoyes automatiquement.
										</p>
										{errors.tags ? (
											<p className="form-message">{errors.tags.message}</p>
										) : null}
									</div>

									<div className="form-item">
										<label htmlFor="installCommand" className="form-label">
											Commande d&apos;installation
										</label>
										<input
											id="installCommand"
											className="input-field input-field-mono"
											placeholder="npm install @example/skill"
											{...register("installCommand")}
										/>
										<p className="form-description">
											Cette ligne aide les utilisateurs a installer rapidement
											le skill.
										</p>
									</div>
								</div>

								<div className="edit-grid">
									<div className="form-item">
										<label htmlFor="promptConfig" className="form-label">
											Configuration prompt
										</label>
										<textarea
											id="promptConfig"
											rows={4}
											className="input-field input-field-textarea input-field-prompt"
											placeholder="Instructions, contraintes, ton attendu..."
											{...register("promptConfig")}
										/>
										<p className="form-description">
											Garde ici les regles internes ou les consignes de
											comportement.
										</p>
									</div>

									<div className="form-item">
										<label htmlFor="usageExample" className="form-label">
											Exemple d&apos;usage
										</label>
										<textarea
											id="usageExample"
											rows={4}
											className="input-field input-field-textarea input-field-usage"
											placeholder="Montre un exemple concret de demande ou de resultat."
											{...register("usageExample")}
										/>
										<p className="form-description">
											Un bon exemple rend le skill plus facile a adopter.
										</p>
									</div>
								</div>

								{serverError ? (
									<p className="detail-error">{serverError}</p>
								) : null}

								<div className="edit-actions">
									<button
										type="submit"
										className="btn-primary"
										disabled={isSubmitting}
									>
										{isSubmitting ? "Enregistrement..." : "Enregistrer"}
									</button>
									<Link
										to="/skills/$id"
										params={{ id: skill.id }}
										className="btn-secondary"
									>
										Annuler
									</Link>
								</div>
							</form>
						</div>
					</div>

					<aside className="edit-sidebar">
						<div className="edit-panel">
							<h2>Verifier avant de publier</h2>
							<div className="edit-list">
								<div className="edit-list-item">
									<div className="edit-list-dot" />
									<p className="edit-list-copy">
										Titre clair, utile et facile a reconnaitre dans la liste.
									</p>
								</div>
								<div className="edit-list-item">
									<div className="edit-list-dot" />
									<p className="edit-list-copy">
										Description orientee resultat, avec un ton direct.
									</p>
								</div>
								<div className="edit-list-item">
									<div className="edit-list-dot" />
									<p className="edit-list-copy">
										Exemple concret pour que le skill reste simple a adopter.
									</p>
								</div>
							</div>
						</div>

						<div className="edit-panel">
							<h2>Information utile</h2>
							<p className="edit-panel-copy">
								Les modifications seront enregistrees uniquement si tu es
								l'auteur du skill.
							</p>
						</div>
					</aside>
				</div>
			</div>
		</section>
	);
}
