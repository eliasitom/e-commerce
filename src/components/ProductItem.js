import "../styleSheets/ProductItem.css";

const ProductItem = ({ productData, onClick }) => {
  return (
    <div className="product-item" onClick={onClick}>
      <img src={productData.images[0]} />
      <h2>{productData.name}</h2>
      <p className="product-item-price">USD {productData.price}</p>
    </div>
  );
};

export default ProductItem;
