import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";
import Cart from "./components/Cart";
import AdminPanel from "./components/admin/AdminPanel";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ProductRoute from "./components/routes/ProductRoute";
import NewProductRoute from "./components/routes/NewProductRoute";
import { CartProvider } from "./components/context/CartContext";
const stripePromise = loadStripe(
  "pk_test_51NKXVtClsAsxOkqgaJKNlARctarfnSQ3aPwmm0cqODRmN5gMOh2mEXf3EoSRORRRPxnWPysd4TX942IipeMVOuTo00W0Xg6qOa"
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <h1>error 404</h1>,
  },
  {
    path: "/cart",
    element: (
      <CartProvider>
        <Elements stripe={stripePromise}>
          <Cart />
        </Elements>
      </CartProvider>
    ),
  },
  {
    path: "/admin",
    element: <AdminPanel />,
  },
  {
    path: "/admin/new_product",
    element: <NewProductRoute />,
  },
  {
    path: "/product/:productId",
    element: 
    <CartProvider>
        <ProductRoute />
    </CartProvider>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
