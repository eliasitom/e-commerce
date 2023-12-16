import ProductItem from "../ProductItem";
import { ProductsContext } from "../context/ProductsContext";
import { useContext } from "react";

const ProductsFoundRoute = () => {
  const { productsFound } = useContext(ProductsContext);

  return (
    <div>
      {productsFound.length > 0
        ? productsFound.map((current, index) => (
            <ProductItem productData={current} key={index} />
          ))
        : undefined}
    </div>
  );
};

export default ProductsFoundRoute;
