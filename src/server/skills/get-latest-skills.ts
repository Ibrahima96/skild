import { createServerFn } from "@tanstack/react-start";
import { fetchLatestSkills } from "./skill-views";

export const getLatestSkills = createServerFn({ method: "GET" }).handler(async () => {
	return fetchLatestSkills();
});
