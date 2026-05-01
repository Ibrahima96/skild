import mongoose from "mongoose";
import { connectToDatabase } from "#/server/db";
import { SkillModel, UserModel } from "#/server/models";

export type SkillAggregationResult = {
	_id: mongoose.Types.ObjectId;
	title: string;
	description: string;
	tags: string[];
	installCommand?: string | null;
	promptConfig?: string | null;
	usageExample?: string | null;
	createdAt: Date | null;
	author: {
		clerkId: string;
		email: string;
		name: string | null;
		username: string | null;
		imageUrl: string | null;
	};
};

const authorLookup = UserModel.collection.name;

function normalizeUsername(author: SkillAggregationResult["author"]) {
	return author.username?.trim() || author.email.split("@")[0] || "anonymous";
}

function normalizeFullName(author: SkillAggregationResult["author"]) {
	return (
		author.name?.trim() ||
		author.username?.trim() ||
		author.email.split("@")[0] ||
		"anonymous"
	);
}

export function serializeSkill(skill: SkillAggregationResult): SkillRecord {
	return {
		id: skill._id.toString(),
		title: skill.title,
		description: skill.description,
		tags: skill.tags,
		installCommand: skill.installCommand ?? undefined,
		promptConfig: skill.promptConfig ?? undefined,
		usageExample: skill.usageExample ?? undefined,
		createdAt: skill.createdAt ? skill.createdAt.toISOString() : null,
		author: {
			clerkId: skill.author.clerkId,
			email: skill.author.email,
			fullName: normalizeFullName(skill.author),
			username: normalizeUsername(skill.author),
			imageUrl: skill.author.imageUrl ?? null,
		},
	};
}

async function runSkillQuery(match: Record<string, unknown> = {}) {
	await connectToDatabase();

	const pipeline = [
		{ $match: match },
		{
			$sort: {
				createdAt: -1,
			},
		},
		{
			$lookup: {
				from: authorLookup,
				localField: "author",
				foreignField: "_id",
				as: "author",
			},
		},
		{
			$unwind: "$author",
		},
		{
			$project: {
				_id: 1,
				title: 1,
				description: 1,
				tags: 1,
				installCommand: 1,
				promptConfig: 1,
				usageExample: 1,
				createdAt: 1,
				author: {
					clerkId: "$author.clerkId",
					email: "$author.email",
					name: "$author.name",
					username: "$author.username",
					imageUrl: "$author.imageUrl",
				},
			},
		},
	];

	return SkillModel.aggregate<SkillAggregationResult>(pipeline);
}

export async function fetchLatestSkills() {
	const skills = await runSkillQuery();
	return skills.map(serializeSkill);
}

export async function fetchSkillById(id: string) {
	if (!mongoose.isValidObjectId(id)) {
		return null;
	}

	const [skill] = await runSkillQuery({
		_id: new mongoose.Types.ObjectId(id),
	});

	return skill ? serializeSkill(skill) : null;
}

export async function fetchEditableSkillById(id: string, clerkId: string) {
	if (!clerkId) {
		throw new Error("Unauthorized");
	}

	const skill = await fetchSkillById(id);

	if (!skill) {
		throw new Error("Skill introuvable.");
	}

	if (skill.author.clerkId !== clerkId) {
		throw new Error("Tu dois etre l'auteur de ce skill.");
	}

	return skill;
}
