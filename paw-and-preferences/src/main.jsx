import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Result from "./Result.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/paws-and-preferences">
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  </BrowserRouter>
);
