export function createRouter({ dir, origin }: { dir: string; origin: string }) {
  return new Bun.FileSystemRouter({
    dir,
    style: "nextjs",
    origin,
    fileExtensions: [".tsx", ".jsx"],
    assetPrefix: "/",
  });
}
