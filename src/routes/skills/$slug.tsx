import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/skills/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  
  const { slug } = Route.useParams();
  return <div> {slug}</div>;
}
