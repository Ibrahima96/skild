import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/skills/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	return <div>{id}</div>;
}
