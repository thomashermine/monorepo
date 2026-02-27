import type { Route } from "./+types/api.comments-create";
import { createComment } from "~/lib/db.server";

export async function action({ request }: Route.ActionArgs) {
    if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405 });
    }
    const body = await request.json();
    const { imageId, x, y, author, text } = body;

    if (!imageId || x == null || y == null || !author || !text) {
        return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const comment = createComment({ imageId, x, y, author, text });
    return Response.json(comment, { status: 201 });
}
