import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
  layout("components/default-layout.jsx", [
    index("features/home/route.jsx"),
    route("mission", "features/mission/route.jsx"),
    route("til", "features/til/route.jsx"),
    route("til/:username/:postNumber", "features/til/til-detail.jsx"),
  ]),
  route("til/new", "features/til/til-new.jsx"),
  route("til/:username/:postNumber/edit", "features/til/til-edit.jsx"),
  route("auth/callback", "features/auth/callback.jsx"),
  route("auth/signout", "features/auth/signout.jsx"),
] satisfies RouteConfig;
