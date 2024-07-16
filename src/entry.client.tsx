import { hydrateRoot } from "react-dom/client";
import { App } from "./main";

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <App path={location.pathname} ssr={false} />,
);
