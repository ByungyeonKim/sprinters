import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
  layout("components/default-layout.tsx", [
    index("features/home/route.tsx"),
    route("mission", "features/mission/route.tsx"),
    route("til", "features/til/route.tsx"),
    route("til/:username/:postNumber", "features/til/til-detail.tsx"),
    route("qna", "features/qna/route.tsx"),
    route("qna/:questionId", "features/qna/qna-detail.tsx"),
    route("library", "features/library/route.tsx"),
  ]),
  route("library/sprinter-dictionary", "features/library/sprinter-dictionary.tsx"),
  route("library/:slug/step-content", "features/library/library-step-content.ts"),
  route("library/:slug", "features/library/library-detail.tsx"),
  route("til/new", "features/til/til-new.tsx"),
  route("til/:username/:postNumber/edit", "features/til/til-edit.tsx"),
  route("auth/callback", "features/auth/callback.tsx"),
  route("auth/signout", "features/auth/signout.tsx"),
] satisfies RouteConfig;
