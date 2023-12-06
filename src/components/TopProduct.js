import "../styleSheets/TopProduct.css";

const TopProduct = ({ img, title, price, onClick }) => {
  return (
    <div className="top-product" onClick={onClick}>
      <img src={img} className="top-product-img" />
      <h2 className="top-product-title">{title}</h2>
      <p className="top-product-price">{"USD " + price}</p>
    </div>
  );
};

export default TopProduct;
