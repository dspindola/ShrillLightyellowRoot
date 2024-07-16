import { importRouteModule } from "@/entry.server";
import { createRouter } from "@/router";
import type { MatchedRoute } from "bun";
import React from "react";

export function Route({
  platform,
  path,
}: {
  platform: "server" | "client";
  path: string;
}) {
  if (platform === "server") {
    return (
      <React.Suspense fallback={null}>
        <meta name="platform" content="server" />
        <meta name="path" content={path} />
        <ServerRoute path={path} />
      </React.Suspense>
    );
  }

  return (
    <React.Suspense fallback={null}>
      <meta name="platform" content="client" />
      <meta name="path" content={path} />
      <ClientRoute path={path} />
    </React.Suspense>
  );
}

export async function ServerRoute({ path }: { path: string }) {
  console.log("ServerRoute", path);
  const router = createRouter({
    dir: "src",
    origin: "http://localhost:3000",
  });
  const Page = router.match(path) as MatchedRoute;
  const { Route } = await importRouteModule(Page);

  return (
    <React.Suspense fallback={null}>
      <Route />
    </React.Suspense>
  );
}

export function ClientRoute({ path }: { path: string }) {
  console.log("ClientRoute", path);
  const Component = React.lazy(() => import(path));
  return (
    <React.Suspense fallback={null}>
      <Component />
    </React.Suspense>
  );
}

export function Router({ ssr, path }: { ssr: boolean; path: string }) {
  return <Route platform={ssr ? "server" : "client"} path={path} />;
}
