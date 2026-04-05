
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner";
import "./index.css";
import "./styles/components.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
    <Toaster richColors position="top-right" />
  </BrowserRouter>
);
