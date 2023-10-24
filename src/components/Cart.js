import { useState } from "react";
import "../styleSheets/Cart.css";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { HiBars3 } from "react-icons/hi2";

import NavBar from "./NavBar";
import useScreenSize from "../customHooks/useScreenSize";
import CartItem from "./CartItem";

import { CartContext } from "./context/CartContext";
import { useContext } from "react";

const StepOne = () => {
  const { cartProducts } = useContext( CartContext )

  return (
    <div className="cart-s1-main">
      <button onClick={() => console.log(cartProducts)}>test</button>
      <p className="cart-s1-title">shopping cart</p>
      <section>
        <div className="cart-container">
          {
            cartProducts.map((current, index) => (
              <CartItem key={index} productData={current}/>
            ))
          }
        </div>
        <div className="cart-bill">
          <p className="bill-title">factura</p>
        </div>
      </section>
    </div>
  );
};

const Cart = () => {
  const { width } = useScreenSize();
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState(1);

  const [navEnabled, setNavEnabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
  };

  return (
    <div className="cart-main">
      <div className="nav-svg" onClick={() => setNavEnabled(true)}>
        <HiBars3 />
      </div>
      {navEnabled ? <NavBar close={() => setNavEnabled(false)} /> : undefined}

      {step === 1 ? (
        <StepOne />
      ) : step === 2 ? (
        <form onSubmit={handleSubmit}>
          <CardElement />
          <button>submit</button>
        </form>
      ) : undefined}
    </div>
  );
};

export default Cart;
