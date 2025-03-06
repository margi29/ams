import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // ✅ Ensure this matches your App.jsx file

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
