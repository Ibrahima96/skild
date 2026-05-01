interface SkillRecord {
  id: string;
  title: string;
  description: string;
  tags: string[];
  installCommand?: string;
  promptConfig?: string;
  usageExample?: string;
  createdAt: string | null;
  author: {
    clerkId: string;
    email: string;
    username: string;
    imageUrl?: string | null;
  };
}
