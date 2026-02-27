import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("api/comments/:imageId", "routes/api.comments.ts"),
    route("api/comments", "routes/api.comments-create.ts"),
] satisfies RouteConfig;
