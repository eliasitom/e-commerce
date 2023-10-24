import "../styleSheets/TopProduct.css";

const TopProduct = ({ img, title, description, price }) => {
  return (
    <div className="top-product">
      <img src={require(`../img/${img}`)} className="top-product-img" />
      <h2 className="top-product-title">{title}</h2>
      <p className="top-product-description">{description}</p>
      <p className="top-product-price">{"USD " + price}</p>
    </div>
  );
};

export default TopProduct;
