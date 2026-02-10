import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("mission", "routes/missions.jsx"),
  route("til", "routes/til.jsx"),
  route("til/new", "routes/til-new.jsx"),
  route("til/:username/:postNumber", "routes/til-detail.jsx"),
] satisfies RouteConfig;
