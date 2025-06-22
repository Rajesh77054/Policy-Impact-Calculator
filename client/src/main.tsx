import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  createRoot(rootElement).render(<App />);
  console.log("App rendered successfully");
} catch (error) {
  console.error("Failed to render app:", error);
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-family: monospace;">
      <h2>Application Failed to Load</h2>
      <p>Error: ${error.message}</p>
      <p>Check the browser console for more details.</p>
    </div>
  `;
}
