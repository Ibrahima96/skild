export const dummySkills: SkillRecord[] = [
	{
		id: "skill-001",
		title: "Write Code",
		description:
			"Generate clean TypeScript snippets and scaffold common app patterns.",
		tags: ["typescript", "react", "boilerplate"],
		installCommand: "npx skild add write-code",
		promptConfig:
			"Focus on concise TypeScript examples and reusable app scaffolding.",
		usageExample:
			"Use this skill when you need a feature stub, component skeleton, or helper function.",
		createdAt: "2026-04-14T09:30:00.000Z",
		author: {
			clerkId: "user_2a1b3c4d",
			email: "dev1@example.com",
			fullName: "Dev One",
			username: "dev1",
			imageUrl: null,
		},
	},
	{
		id: "skill-002",
		title: "Refactor Safely",
		description:
			"Improve structure while preserving behavior with focused, low-risk edits.",
		tags: ["refactor", "maintainability", "clean-code"],
		installCommand: "npx skild add refactor-safely",
		promptConfig:
			"Prefer small, behavior-preserving changes with clear before-and-after reasoning.",
		usageExample:
			"Use this skill when code works but the structure is getting hard to maintain.",
		createdAt: "2026-04-14T09:45:00.000Z",
		author: {
			clerkId: "user_5e6f7g8h",
			email: "dev2@example.com",
			fullName: "Dev Two",
			username: "dev2",
			imageUrl: null,
		},
	},
	{
		id: "skill-003",
		title: "Test Coverage Boost",
		description:
			"Create unit and integration test cases for edge paths and regressions.",
		tags: ["vitest", "testing-library", "coverage"],
		installCommand: "npx skild add test-coverage-boost",
		promptConfig:
			"Target missing assertions, edge cases, and high-risk branches first.",
		usageExample:
			"Use this skill to expand test coverage around a bug fix or new branch.",
		createdAt: "2026-04-14T10:00:00.000Z",
		author: {
			clerkId: "user_9i0j1k2l",
			email: "dev3@example.com",
			fullName: "Dev Three",
			username: "dev3",
			imageUrl: null,
		},
	},
	{
		id: "skill-004",
		title: "API Contract Builder",
		description:
			"Draft typed request and response contracts for REST endpoints.",
		tags: ["api", "zod", "contracts"],
		installCommand: "npx skild add api-contract-builder",
		promptConfig:
			"Define clear request/response shapes and keep error responses consistent.",
		usageExample:
			"Use this skill when introducing a new route or tightening endpoint types.",
		createdAt: "2026-04-14T10:15:00.000Z",
		author: {
			clerkId: "user_3m4n5o6p",
			email: "dev4@example.com",
			fullName: "Dev Four",
			username: "dev4",
			imageUrl: null,
		},
	},
	{
		id: "skill-005",
		title: "Performance Tuner",
		description:
			"Identify render bottlenecks and optimize expensive client-side work.",
		tags: ["profiling", "memoization", "web-vitals"],
		installCommand: "npx skild add performance-tuner",
		promptConfig:
			"Measure first, then optimize the slowest path with the simplest fix.",
		usageExample:
			"Use this skill when a screen feels sluggish or a component rerenders too often.",
		createdAt: "2026-04-14T10:30:00.000Z",
		author: {
			clerkId: "user_7q8r9s0t",
			email: "dev5@example.com",
			fullName: "Dev Five",
			username: "dev5",
			imageUrl: null,
		},
	},
];
