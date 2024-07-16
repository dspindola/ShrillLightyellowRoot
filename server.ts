import { handleRequest } from "@/entry.server";
import { createRouter } from "@/router";
import { staticPlugin } from "@elysiajs/static";
import { file } from "bun";
import { Elysia } from "elysia";

await Bun.build({
  entrypoints: ["./src/entry.client.tsx"],
  outdir: "./dist",
  target: "browser",
  format: "esm",
  define: {
    "import.meta.env.SSR": "false",
  },
  loader: {
    ".tsx": "tsx",
  },
  naming: "client.js",
  sourcemap: "linked",
});

const routes = new Elysia()
  .decorate(
    "router",
    createRouter({ dir: "./src", origin: "http://localhost:3000/" }),
  )
  .onBeforeHandle((handler) => {
    handler.path = `/routes${handler.path}`;
  })
  .get("*", handleRequest, {
    async beforeHandle(context) {
      const route = context.router.match(context.path);
      if (route) {
        const path = new URL(
          Bun.pathToFileURL(route.filePath).pathname.replace(
            process.cwd() + "/src/",
            context.router.origin,
          ),
        );
        await Bun.build({
          entrypoints: [route.filePath],
          outdir: "./dist",
          target: "browser",
          format: "esm",
          naming: `.${path.pathname.replace(/\.tsx$/, ".js")}`,
          define: {
            "import.meta.env.SSR": "false",
            "process.env": JSON.stringify(process.env),
          },
        });
      }
    },
  });

const assets = new Elysia().use(
  staticPlugin({
    prefix: "/_static",
    assets: "./public",
  }),
);

const app = new Elysia()
  .use(assets)
  .use(routes)
  .get("/_static/styles.css", async () => {
    await Bun.$`bun tailwindcss --input ./src/styles.css --output ./public/styles.css`;
    return new Response(file("./public/styles.css"), {
      headers: {
        "Content-Type": "text/css",
      },
    });
  })
  .get("/_dist/client.js", async () => {
    return file("./dist/client.js");
  })
  .listen(
    {
      port: 3000,
      hostname: "localhost",
    },
    ({ url }) => {
      console.log(`Server is running on ${url.origin}`);
    },
  );
