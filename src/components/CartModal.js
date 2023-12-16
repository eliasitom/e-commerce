import { useNavigate } from "react-router-dom";
import "../styleSheets/CartModal.css"

import ButtonComponent from "./ButtonComponent";
import { ProductsContext } from "./context/ProductsContext";
import { useContext, useState } from "react";

import {BsCart} from "react-icons/bs"

const CartModal = () => {
  const { cartProducts } = useContext(ProductsContext);
  const navigate = useNavigate()

  const [expanded, setExpanded] = useState(false)

  if(expanded) {
    return (
      <div className="expanded-cart-modal">
        <p className="cart-modal-title">Tu carrito:</p>
        <button className="close-cart-modal" onClick={() => setExpanded(false)}>×</button>
        <div className="cart-modal-products">
          {cartProducts.map((current, index) => (
            <div className="cart-modal-product" key={index}>
              <img src={current.images[0]} alt={current.images[0].name} />
              <h2>{current.name}</h2>
            </div>
          ))}
        </div>
        <div className="cart-modal-button">
        <ButtonComponent child="Finalizar compra" onClick={() => navigate("/cart")}/>
        </div>
      </div>
    )
  } else {
    return (
      <div className="unexpanded-cart-modal" onClick={() => setExpanded(true)}>
        <BsCart />
      </div>
    )
  }
};

export default CartModal
