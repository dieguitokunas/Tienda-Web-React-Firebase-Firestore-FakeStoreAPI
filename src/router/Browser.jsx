import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Index } from "../pages/Index";
import { Products } from "../pages/Products";

export function Browser() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/Products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}
