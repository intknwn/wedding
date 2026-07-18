
import { createRoot } from "react-dom/client";
import { NuqsAdapter } from 'nuqs/adapters/react'
  import App from "./app/App.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(<NuqsAdapter><App /></NuqsAdapter>);
