import mongoose, { type HydratedDocument, type InferSchemaType } from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: String,
      },
    ],

    installCommand: {
      type: String,
    },

    promptConfig: {
      type: String,
    },

    usageExample: {
      type: String,
    },
  },
  { timestamps: true },
);

export type Skill = InferSchemaType<typeof SkillSchema>;
export type SkillDocument = HydratedDocument<Skill>;

export const SkillModel =
  mongoose.models.Skill ?? mongoose.model("Skill", SkillSchema);
