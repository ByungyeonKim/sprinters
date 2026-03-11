import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
  layout("components/default-layout.jsx", [
    index("features/home/route.jsx"),
    route("mission", "features/mission/route.jsx"),
    route("til", "features/til/route.jsx"),
    route("til/:username/:postNumber", "features/til/til-detail.jsx"),
    route("qna", "features/qna/route.jsx"),
    route("qna/:questionId", "features/qna/qna-detail.jsx"),
    route("library", "features/library/route.jsx"),
  ]),
  route("library/sprinter-dictionary", "features/library/sprinter-dictionary.jsx"),
  route("library/:slug/step-content", "features/library/library-step-content.js"),
  route("library/:slug", "features/library/library-detail.jsx"),
  route("til/new", "features/til/til-new.jsx"),
  route("til/:username/:postNumber/edit", "features/til/til-edit.jsx"),
  route("auth/callback", "features/auth/callback.jsx"),
  route("auth/signout", "features/auth/signout.jsx"),
] satisfies RouteConfig;
