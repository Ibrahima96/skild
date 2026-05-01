import { Link } from "@tanstack/react-router";
import {
	ArrowBigUp,
	ArrowUpRight,
	Bookmark,
	Check,
	Copy,
	MessageSquare,
} from "lucide-react";
import { useState } from "react";

const SkillCard = ({
	author,
	id,
	createdAt,
	description,
	tags,
	title,
	installCommand,
	promptConfig,
	usageExample,
}: SkillRecord) => {
	const [copied, setCopied] = useState(false);
	const primaryTag = tags[0] ?? "General";

	const handleCopy = async () => {
		if (!installCommand) {
			return;
		}

		try {
			await navigator.clipboard.writeText(installCommand);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	};
	return (
		<article className="skill-card">
			<Link
				to="/skills/$id"
				params={{ id }}
				tabIndex={-1}
				aria-label={`open ${title}`}
				className="overlay"
			/>

			<div className="chrome">
				<div className="chrome-bar">
					<div className="lights">
						<div className="light red" />
						<div className="light amber" />
						<div className="light green" />
					</div>
					<div className="host">registry.sh</div>
				</div>
			</div>

			<div className="body">
				<div className="meta">
					<div className="author">
						<img
							src={author.imageUrl ?? "/logo512.png"}
							alt={`${author.username} avatar`}
							className="avatar"
						/>
						<div className="author-copy">
							<p>{author.username}</p>
							<p>
								{createdAt
									? new Date(createdAt).toLocaleDateString()
									: "Unknown date"}
							</p>
						</div>
					</div>

					<p className="category">{primaryTag}</p>
				</div>

				<div className="summary">
					<Link to="/skills/$id" params={{ id }} className="title-link">
						<h3>{title}</h3>
					</Link>

					<p>{description}</p>
					{usageExample ? <p>{usageExample}</p> : null}
					{promptConfig ? <p>{promptConfig}</p> : null}
				</div>

				<div className="command">
					<div className="command-copy">
						<span>{">_"}</span>
						<p>{installCommand ?? "No install command"}</p>
					</div>
					<button
						type="button"
						className="copy"
						onClick={handleCopy}
						disabled={!installCommand}
						aria-label="Copy install command"
					>
						{copied ? <Check size={16} /> : <Copy size={16} />}
					</button>
				</div>
				<div className="footer">
					<div className="stats">
						<button type="button" className="upvote" disabled>
							<ArrowBigUp size={16} fill="currentColor" />
							<span>{tags.length}</span>
						</button>

						<div className="comments">
							<MessageSquare size={14} />
							<span>{author.email ? 1 : 0}</span>
						</div>
					</div>

					<div className="actions">
						<Link
							to="/skills/$id"
							params={{ id }}
							className="open"
							title={`Open ${title}`}
						>
							<span>Open</span>
							<ArrowUpRight size={14} />
						</Link>

						<button
							type="button"
							className="save"
							aria-label="Saved state"
							disabled
						>
							<Bookmark size={16} />
						</button>
					</div>
				</div>
			</div>
		</article>
	);
};

export default SkillCard;
