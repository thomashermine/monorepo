import type { Route } from "./+types/api.comments";
import { getComments } from "~/lib/db.server";

export async function loader({ params }: Route.LoaderArgs) {
    const imageId = params.imageId;
    if (!imageId) {
        return Response.json({ error: "Missing imageId" }, { status: 400 });
    }
    const comments = getComments(imageId);
    return Response.json(comments);
}
