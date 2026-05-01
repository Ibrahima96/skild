import { useUser } from "@clerk/tanstack-react-start";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Sparkles, TerminalSquare } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createSkill } from "#/server/skills/create-skill";

type SkillFormValues = {
	title: string;
	description: string;
	tags: string;
	installCommand: string;
	promptConfig: string;
	usageExample: string;
};

export const Route = createFileRoute("/skills/new")({
	component: NewSkillPage,
});

function NewSkillPage() {
	const { isSignedIn } = useUser();
	const navigate = useNavigate();
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SkillFormValues>({
		defaultValues: {
			title: "",
			description: "",
			tags: "",
			installCommand: "",
			promptConfig: "",
			usageExample: "",
		},
	});

	const onSubmit = async (values: SkillFormValues) => {
		setServerError(null);
		const normalizedTags = values.tags
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);

		try {
			const result = await createSkill({
				data: {
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
				params: { id: result.id },
			});
		} catch (error) {
			setServerError(
				error instanceof Error
					? error.message
					: "Erreur pendant la creation du skill.",
			);
		}
	};

	if (!isSignedIn) {
		return (
			<section id="skill-create">
				<div className="create-shell">
					<Link to="/" className="create-back">
						<span>Retour a l'accueil</span>
					</Link>

					<div className="create-layout">
						<div className="create-card">
							<span className="create-badge">
								<Sparkles size={12} />
								Connexion requise
							</span>

							<h1 className="create-title">Publier un skill</h1>
							<p className="create-copy">
								Connecte-toi pour creer une fiche claire, elegante et
								directement utilisable par la communaute.
							</p>

							<div className="create-footer">
								<Link to="/sign-in/$" className="btn-primary">
									Se connecter
									<ArrowRight size={14} />
								</Link>
								<Link to="/" className="btn-secondary">
									Explorer les skills
								</Link>
							</div>
						</div>

						<aside className="create-sidebar">
							<div className="create-panel">
								<h2>Pourquoi se connecter ?</h2>
								<div className="create-list">
									<div className="create-list-item">
										<div className="create-list-dot" />
										<p className="create-list-copy">
											Ton auteur sera ajoute automatiquement depuis Clerk.
										</p>
									</div>
									<div className="create-list-item">
										<div className="create-list-dot" />
										<p className="create-list-copy">
											Tes tags seront convertis en liste propre pour la carte.
										</p>
									</div>
									<div className="create-list-item">
										<div className="create-list-dot" />
										<p className="create-list-copy">
											Tu gardes le controle sur la commande, le prompt et l
											usage.
										</p>
									</div>
								</div>
							</div>

							<div className="create-panel">
								<h2>Publier plus vite</h2>
								<p className="create-list-copy">
									Une fois connecte, tu arrives sur un formulaire epure pense
									pour aller droit au but.
								</p>
							</div>
						</aside>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id="skill-create">
			<div className="create-shell">
				<Link to="/" className="create-back">
					<span>Retour a l'accueil</span>
				</Link>

				<div className="create-layout">
					<div className="create-main">
						<div className="create-hero">
							<div className="create-hero-content">
								<span className="create-badge">
									<Sparkles size={12} />
									Nouveau skill
								</span>

								<h1 className="create-title">
									<span className="text-gradient">Publier</span> un skill qui
									donne envie d'etre utilise
								</h1>
								<p className="create-copy">
									Donne a ta creation une presentation nette, un ton clair et
									tous les details utiles pour que la carte soit percutante des
									la premiere lecture.
								</p>
							</div>

							<div className="create-kpis">
								<div className="create-kpi">
									<p className="create-kpi-label">Auteur</p>
									<p className="create-kpi-value">Ajoute automatiquement</p>
								</div>
								<div className="create-kpi">
									<p className="create-kpi-label">Tags</p>
									<p className="create-kpi-value">Separes par des virgules</p>
								</div>
								<div className="create-kpi">
									<p className="create-kpi-label">Commandes</p>
									<p className="create-kpi-value">
										Optionnelles mais mises en avant
									</p>
								</div>
							</div>
						</div>

						<div className="create-card">
							<form onSubmit={handleSubmit(onSubmit)} className="create-form">
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

								<div className="create-grid">
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
											Separes-les par des virgules. Les espaces sont nettoyes
											automatiquement.
										</p>
										{errors.tags ? (
											<p className="form-message">{errors.tags.message}</p>
										) : null}
									</div>

									<div className="form-item">
										<label htmlFor="installCommand" className="form-label">
											Commande d&apos;installation
										</label>
										<div className="input-affix">
											<TerminalSquare size={16} />
											<input
												id="installCommand"
												className="input-field input-field-mono input-field-affix"
												placeholder="npm install @example/skill"
												{...register("installCommand")}
											/>
										</div>
										<p className="form-description">
											Optionnel, mais tres utile pour accelerer la prise en
											main.
										</p>
									</div>
								</div>

								<div className="create-grid">
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
											Un bon exemple rend le skill beaucoup plus facile a
											adopter.
										</p>
									</div>
								</div>

								{serverError ? (
									<p className="create-error">{serverError}</p>
								) : null}

								<div className="create-footer">
									<button
										type="submit"
										className="btn-primary"
										disabled={isSubmitting}
									>
										{isSubmitting ? "Publication..." : "Publier le skill"}
									</button>
									<Link to="/" className="btn-secondary">
										Annuler
									</Link>
								</div>
							</form>
						</div>
					</div>

					<aside className="create-sidebar">
						<div className="create-panel">
							<h2>Checklist rapide</h2>
							<div className="create-list">
								<div className="create-list-item">
									<div className="create-list-dot" />
									<p className="create-list-copy">
										Un titre specifique, pas trop long, qui raconte l usage
										principal.
									</p>
								</div>
								<div className="create-list-item">
									<div className="create-list-dot" />
									<p className="create-list-copy">
										Une description orientee benefice, avec un ton direct.
									</p>
								</div>
								<div className="create-list-item">
									<div className="create-list-dot" />
									<p className="create-list-copy">
										Une commande claire et un exemple concret pour guider les
										utilisateurs.
									</p>
								</div>
							</div>
						</div>

						<div className="create-panel">
							<h2>Ce qui sera publie</h2>
							<p className="create-list-copy">
								L&apos;auteur sera synchronise depuis ton compte, puis la fiche
								sera redirigee vers sa page detail apres validation.
							</p>
						</div>
					</aside>
				</div>
			</div>
		</section>
	);
}
