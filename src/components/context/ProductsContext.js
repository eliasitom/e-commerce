import { createContext, useEffect, useState } from "react";

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [productsFound, setProductsFound] = useState([]);

  return (
    <ProductsContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        productsFound,
        setProductsFound,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
