import { useState } from "react";
import "../styleSheets/Cart.css";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { HiBars3 } from "react-icons/hi2";

import NavBar from "./NavBar";
import useScreenSize from "../customHooks/useScreenSize";
import CartItem from "./CartItem";

import { ProductsContext } from "./context/ProductsContext";
import { useContext } from "react";

const StepOne = () => {
  const { cartProducts, setCartProducts } = useContext( ProductsContext )

  //Manejar cantidad (suma y resta)
  const handleAmmount = (productId, addition) => {
    const newCartProducts = cartProducts.map(current => {
      if(current._id === productId) {
        //la propiedad ammount de los productos se establece cuando se agrega el producto al carrito desde ProductRoute
        addition ? current.ammount++ : current.ammount--
      }
      return current
    })
    setCartProducts(newCartProducts)
  }

  const removeProduct = (productId) => {
    const newCartProducts = cartProducts.filter(current => current._id !== productId)
    setCartProducts(newCartProducts)
  }

  return (
    <div className="cart-s1-main">
      <section>
        <div className="cart-container">
          { cartProducts.length > 0 ?
            cartProducts.map((current, index) => (
              <CartItem 
              key={index} 
              productData={current} 
              addition={() => handleAmmount(current._id, true)} 
              subtraction={() => {
                if(current.ammount > 1)   handleAmmount(current._id, false);
                else removeProduct(current._id)
              }}/>
            )) : undefined
          }
        </div>
        <div className="cart-bill">
          <p className="bill-title">factura</p>

          { cartProducts.length > 0 ?
            cartProducts.map((current, index) => (
              <div key={index} className="bill-item">
                <p className="bill-item-name">{current.name}</p>
                <p className="bill-item-price">{`x${current.ammount} - USD ${current.price * current.ammount},00`}</p>
              </div>
            )) : undefined
          }
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

      <main>
      <header>
        <h2 className="cart-main-title">Carrito de compras</h2>
        <div>
          <p className={step === 1 ? "current-step" : ""}>PASO 1</p>
          <p className={step === 2 ? "current-step" : ""}>PASO 2</p>
          <p className={step === 3 ? "current-step" : ""}>PASO 3</p>
        </div>
      </header>
      {step === 1 ? (
        <StepOne />
      ) : step === 2 ? (
        <form onSubmit={handleSubmit}>
          <CardElement />
          <button>submit</button>
        </form>
      ) : undefined}
      </main>
    </div>
  );
};

export default Cart;
