import mongoose, { type HydratedDocument, type InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema(
	{
		clerkId: {
			type: String,
			required: true,
			unique: true,
			index: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			index: true,
			lowercase: true,
			trim: true,
		},
		username: {
			type: String,
			default: null,
			index: true,
			trim: true,
		},
		name: {
			type: String,
			default: null,
			trim: true,
		},
		imageUrl: {
			type: String,
			default: null,
			trim: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;

export const UserModel = mongoose.models.User ?? mongoose.model("User", userSchema);
