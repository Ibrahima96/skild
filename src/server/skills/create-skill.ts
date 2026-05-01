import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { connectToDatabase } from "#/server/db";
import { SkillModel, UserModel } from "#/server/models";

const createSkillSchema = z.object({
	title: z.string().trim().min(3, "Le titre doit contenir au moins 3 caracteres"),
	description: z
		.string()
		.trim()
		.min(10, "La description doit contenir au moins 10 caracteres"),
	tags: z
		.array(z.string().trim().min(1))
		.min(1, "Ajoute au moins un tag")
		.max(10, "Maximum 10 tags"),
	installCommand: z.string().trim().max(200).nullable().optional(),
	promptConfig: z.string().trim().max(2000).nullable().optional(),
	usageExample: z.string().trim().max(2000).nullable().optional(),
});

export const createSkill = createServerFn({ method: "POST" })
	.inputValidator(createSkillSchema)
	.handler(async ({ data }) => {
		const { userId } = await auth();

		if (!userId) {
			throw new Error("Unauthorized");
		}

		await connectToDatabase();

		const author = await UserModel.findOne({ clerkId: userId });
		if (!author) {
			throw new Error(
				"Utilisateur introuvable en base. Reconnecte-toi pour relancer la synchronisation.",
			);
		}

		const createdSkill = await SkillModel.create({
			author: author._id,
			title: data.title,
			description: data.description,
			tags: data.tags,
			installCommand: data.installCommand ?? null,
			promptConfig: data.promptConfig ?? null,
			usageExample: data.usageExample ?? null,
		});

		return { id: createdSkill._id.toString() };
	});
