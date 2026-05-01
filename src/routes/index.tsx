import { createFileRoute, Link } from "@tanstack/react-router";
import { Terminal } from "lucide-react";
import SkillCard from "#/components/SkillCard";
import { getLatestSkills } from "#/server/skills/get-latest-skills";

export const Route = createFileRoute("/")({
	loader: () => getLatestSkills(),
	component: App,
});

function App() {
	const skills = Route.useLoaderData();

	return (
		<div id="home">
			<section className="hero">
				<div className="copy">
					<h1>
						Le registre de <br />
						<span className="text-gradient">l'intelligence agentique</span>
					</h1>
					<p>
						Un registre haute performance pour les compétences d'agents
						procéduraux. Découvrez, publiez et exploitez des capacités
						réutilisables depuis un espace de travail piloté par routes.
					</p>
				</div>

				<div className="actions">
					<Link
						to="/"
						className="btn-primary"
					>
						<Terminal size={18} />
						<span>Parcourir le registre</span>
					</Link>
					<Link to="/skills/new" className="btn-secondary">
						Publier un skill
					</Link>
				</div>
			</section>

			<section className="latest">
				<div className="space-y-2">
					<h2>
						Compétences <span className="text-gradient">récentes</span>
					</h2>
					<p>
						Les dernières compétences chargées depuis la base de données, triées
						par date de création décroissante.
					</p>
				</div>

				<div>
					{skills.length > 0 ? (
						<div className="skills-grid">
							{skills.map((skill) => (
								<SkillCard key={skill.id} {...skill} />
							))}
						</div>
					) : (
						<p>Aucune compétence n'a encore été créée.</p>
					)}
				</div>
			</section>
		</div>
	);
}
