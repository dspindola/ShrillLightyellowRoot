import { Router } from "packages/router/Route";

export function App(props: { path: string; ssr: boolean }) {
  const { path, ssr } = props;
  return (
    <html lang="en" className="dark">
      <head>
        <title>React App</title>
        <link rel="stylesheet" href="/_static/styles.css" />
      </head>
      <body className="bg-slate-800">
        <Router path={path} ssr={ssr} />
      </body>
    </html>
  );
}
