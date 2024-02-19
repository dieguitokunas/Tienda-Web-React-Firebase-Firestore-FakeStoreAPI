import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Index } from "../pages/Index";

export function Browser() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}
