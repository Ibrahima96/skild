import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchSkillById } from "./skill-views";

const skillIdSchema = z.object({
	id: z.string().trim().min(1, "Skill id is required"),
});

export const getSkill = createServerFn({ method: "GET" })
	.inputValidator(skillIdSchema)
	.handler(async ({ data }) => {
		const skill = await fetchSkillById(data.id);

		if (!skill) {
			throw new Error("Skill introuvable.");
		}

		const { userId } = await auth();

		return {
			skill,
			canEdit: Boolean(userId && skill.author.clerkId === userId),
		};
	});
