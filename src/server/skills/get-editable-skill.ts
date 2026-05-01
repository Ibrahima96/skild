import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchEditableSkillById } from "./skill-views";

const skillIdSchema = z.object({
	id: z.string().trim().min(1, "Skill id is required"),
});

export const getEditableSkill = createServerFn({ method: "GET" })
	.inputValidator(skillIdSchema)
	.handler(async ({ data }) => {
		const { userId } = await auth();

		if (!userId) {
			throw new Error("Unauthorized");
		}

		return fetchEditableSkillById(data.id, userId);
	});
