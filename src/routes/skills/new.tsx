import { useUser } from "@clerk/tanstack-react-start";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
				error instanceof Error ? error.message : "Erreur pendant la creation du skill.",
			);
		}
	};

	if (!isSignedIn) {
		return (
			<section className="space-y-4 py-10">
				<h1 className="text-2xl font-bold">Publier un skill</h1>
				<p>Tu dois etre connecte pour publier un skill.</p>
				<Link to="/sign-in/$" className="btn-primary">
					Se connecter
				</Link>
			</section>
		);
	}

	return (
		<section className="space-y-6 py-8">
			<div className="space-y-2">
				<h1 className="text-2xl font-bold">Publier un skill</h1>
				<p className="text-sm opacity-80">
					Remplis ce formulaire. L&apos;auteur sera ajoute automatiquement depuis ton
					compte Clerk.
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="space-y-1">
					<label htmlFor="title">Titre</label>
					<input
						id="title"
						{...register("title", {
							required: "Le titre est obligatoire",
							minLength: { value: 3, message: "Minimum 3 caracteres" },
						})}
					/>
					{errors.title ? <p className="text-red-500">{errors.title.message}</p> : null}
				</div>

				<div className="space-y-1">
					<label htmlFor="description">Description</label>
					<textarea
						id="description"
						rows={4}
						{...register("description", {
							required: "La description est obligatoire",
							minLength: { value: 10, message: "Minimum 10 caracteres" },
						})}
					/>
					{errors.description ? (
						<p className="text-red-500">{errors.description.message}</p>
					) : null}
				</div>

				<div className="space-y-1">
					<label htmlFor="tags">Tags (separes par des virgules)</label>
					<input
						id="tags"
						placeholder="react, ai, automation"
						{...register("tags", { required: "Ajoute au moins un tag" })}
					/>
					{errors.tags ? <p className="text-red-500">{errors.tags.message}</p> : null}
				</div>

				<div className="space-y-1">
					<label htmlFor="installCommand">Commande d&apos;installation (optionnel)</label>
					<input id="installCommand" {...register("installCommand")} />
				</div>

				<div className="space-y-1">
					<label htmlFor="promptConfig">Configuration prompt (optionnel)</label>
					<textarea id="promptConfig" rows={3} {...register("promptConfig")} />
				</div>

				<div className="space-y-1">
					<label htmlFor="usageExample">Exemple d&apos;usage (optionnel)</label>
					<textarea id="usageExample" rows={3} {...register("usageExample")} />
				</div>

				{serverError ? <p className="text-red-500">{serverError}</p> : null}

				<button type="submit" className="btn-primary" disabled={isSubmitting}>
					{isSubmitting ? "Publication..." : "Publier le skill"}
				</button>
			</form>
		</section>
	);
}
