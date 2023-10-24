import "../styleSheets/CartItem.css";

const CartItem = ({productData}) => {
  return (
    <div className="cart-item-main">
      <div className="cart-item">
        <div className="cart-item-data">
          <img src={productData.images[0]}/>
          <p className="cart-item-name">{productData.name}</p>
          <p className="cart-item-price">USD {productData.price}</p>
        </div>
        <div className="cart-item-amount">
          <button>+</button>
          <p className="cart-item-counter">1</p>
          <button>-</button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
