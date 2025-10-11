import React from "react";
import { createRoot } from "react-dom/client";
import App from "../App";
import { BrowserRouter } from "react-router-dom";

test("renders App without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});
