import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("features/home/route.jsx"),
  route("mission", "features/mission/route.jsx"),
  route("til", "features/til/route.jsx"),
  route("til/new", "features/til/til-new.jsx"),
  route("til/:username/:postNumber", "features/til/til-detail.jsx"),
  route("auth/callback", "features/auth/callback.jsx"),
  route("auth/signout", "features/auth/signout.jsx"),
] satisfies RouteConfig;
