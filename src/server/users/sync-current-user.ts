import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { connectToDatabase } from "#/server/db";
import { UserModel } from "#/server/models";

const syncUserSchema = z.object({
	clerkId: z.string().trim().min(1, "clerkId est requis"),
	email: z.string().trim().email("Email invalide"),
	username: z.string().trim().min(1).max(50).nullable().optional(),
	name: z.string().trim().min(1).max(100).nullable().optional(),
	imageUrl: z.string().trim().url("imageUrl doit etre une URL valide").nullable().optional(),
});

export const syncCurrentUserToDb = createServerFn({ method: "POST" })
	.inputValidator(syncUserSchema)
	.handler(async ({ data }) => { 
		await connectToDatabase();

		await UserModel.findOneAndUpdate(
			{ clerkId: data.clerkId },
			{
				clerkId: data.clerkId,
				email: data.email,
				username: data.username ?? null,
				name: data.name ?? null,
				imageUrl: data.imageUrl ?? null,
			},
			{
				upsert: true,
				returnDocument: "after",
				setDefaultsOnInsert: true,
			},
		);

		return { ok: true };
	});
