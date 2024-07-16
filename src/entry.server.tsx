import type { Context } from "elysia";
import { createRouter } from "@/router";
import type { MatchedRoute } from "bun";
import type React from "react";
import { renderToReadableStream, renderToStaticMarkup } from "react-dom/server";
import { Route } from "packages/router/Route";
import { App } from "./main";

export async function handleRequest(context: Context): Promise<Response> {
  try {
    const router = createRouter({
      dir: "src",
      origin: "http://localhost:3000",
    });
    router.reload();
    const route = router.match(context.path);
    if (!route) {
      throw new Error("Route not found");
    }
    const stream = await renderToStream(importRouteModule(route));
    return new Response(stream, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function importRouteModule(route: MatchedRoute) {
  const { filePath } = route;
  const module = await import(filePath);
  return { ...module, path: route.pathname, url: route.src } as {
    Route: () => React.ReactNode;
    ssr: boolean;
    path: string;
  };
}

export async function renderToStream(
  page: ReturnType<typeof importRouteModule>,
) {
  const Page = await page;
  const stream = await renderToReadableStream(
    <App path={Page.path} ssr={Page.ssr} />,
    {
      bootstrapScripts: ["/_dist/client.js"],
      bootstrapModules: ["/_dist/routes/index.js"],
    },
  );
  await stream.allReady;
  return stream;
}

export async function renderToHtml(page: ReturnType<typeof importRouteModule>) {
  const { Route } = await page;
  const html = renderToStaticMarkup(<Route />);
  return html;
}
