import "../styleSheets/ProductItem.css";

import { useNavigate } from 'react-router-dom';

const ProductItem = ({ productData }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/product/${productData._id}`);
  }

  return (
    <div className="product-item" onClick={handleClick}>
      <img src={productData.images[0]} />
      <h2>{productData.name}</h2>
      <p className="product-item-price">USD {productData.price}</p>
    </div>
  );
};

export default ProductItem;
