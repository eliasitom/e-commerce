import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CartProvider } from "./components/context/CartContext";

import HomeRoute from "./components/routes/HomeRoute";
import Cart from "./components/Cart";
import NewProductRoute from "./components/routes/NewProductRoute";
import EditProductRoute from "./components/routes/EditProductRoute";
import ProductRoute from "./components/routes/ProductRoute";
import CategoryRoute from "./components/routes/CategoryRoute";
import AdminPanel from "./components/admin/AdminPanel";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import EditCategoryRoute from "./components/routes/EditCategoryRoute";
const stripePromise = loadStripe(
  "pk_test_51NKXVtClsAsxOkqgaJKNlARctarfnSQ3aPwmm0cqODRmN5gMOh2mEXf3EoSRORRRPxnWPysd4TX942IipeMVOuTo00W0Xg6qOa"
);

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route
            path="/cart"
            element={
              <Elements stripe={stripePromise}>
                <Cart />
              </Elements>
            }
          />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/new_product" element={<NewProductRoute />} />
          <Route path="/admin/edit_product/:productId" element={<EditProductRoute />} />
          <Route path="/admin/edit_category/:category" element={<EditCategoryRoute />} />
          <Route path="/product/:productId" element={<ProductRoute />} />
          <Route path="/products/:category" element={<CategoryRoute />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
