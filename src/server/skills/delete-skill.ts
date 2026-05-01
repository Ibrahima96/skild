import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { connectToDatabase } from "#/server/db";
import { SkillModel, UserModel } from "#/server/models";

const deleteSkillSchema = z.object({
	id: z.string().trim().min(1, "Skill id is required"),
});

export const deleteSkill = createServerFn({ method: "POST" })
	.inputValidator(deleteSkillSchema)
	.handler(async ({ data }) => {
		const { userId } = await auth();

		if (!userId) {
			throw new Error("Unauthorized");
		}

		await connectToDatabase();

		const author = await UserModel.findOne({ clerkId: userId }).select("_id");

		if (!author) {
			throw new Error(
				"Utilisateur introuvable en base. Reconnecte-toi pour relancer la synchronisation.",
			);
		}

		const result = await SkillModel.deleteOne({
			_id: data.id,
			author: author._id,
		});

		if (result.deletedCount === 0) {
			throw new Error("Tu ne peux supprimer que tes propres skills.");
		}

		return { ok: true };
	});
