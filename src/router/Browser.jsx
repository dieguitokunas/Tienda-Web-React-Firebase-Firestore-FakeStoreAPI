import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Index } from "../pages/Index";
import { Products } from "../pages/Products";
import { Cart } from "../pages/Cart";

export function Browser() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/Cart" element={<Cart/>}/>
      </Routes>
    </BrowserRouter>
  );
}
