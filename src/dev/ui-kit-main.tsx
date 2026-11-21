import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UiKit } from "./UiKit";
import "@/styles/globals.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Missing #root element");
}

createRoot(rootElement).render(
  <StrictMode>
    <UiKit />
  </StrictMode>,
);
