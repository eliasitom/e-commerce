import { useContext, useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import "../../styleSheets/routes/ProductRoute.css";

import ButtonComponent from "../ButtonComponent";
import ProductItem from "../ProductItem";
import { CartContext } from "../context/CartContext";

const ProductRoute = () => {
  const { productId } = useParams();

  const { cartProducts, setCartProducts } = useContext( CartContext )

  const [productData, setProductData] = useState();
  const [recommendedProducts, setRecommendedProducts] = useState()


  // Obtener productData 
  useEffect(() => {
      fetch(`http://localhost:8000/api/get_product/${productId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((res) => {
          setProductData(res);
          console.log(res)
          getRecommendedProducts(res.tags)
        })
        .catch((err) => console.log(err));
  }, [productId]);

  // Luego de obtener productData obtiene recommendedProducts mediante productData.tags
  const getRecommendedProducts = (tags) => {
    fetch("http://localhost:8000/api/get_products_by_tags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({productTags: tags})
    })
    .then(response => response.json())
    .then(res => {
      setRecommendedProducts(res)
    })
    .catch(err => console.log(err))
}


//Agregar al carrito
const pushToCart = () => {
  const newCartProducts = [...cartProducts, productData]
  setCartProducts(newCartProducts)
  console.log(newCartProducts)
}



  if (productData) {
    return (
      <div className="product-page">
        <header>
          <h1>CIRCUIT UY</h1>
        </header>
        <div className="product-page-main-div">
          <section className="product-page-data">
            <div className="product-page-main-data">
              <img src={productData.images[0]} />
              <div>
                <h2>{productData.name}</h2>
                <p className="product-price">USD {productData.price}</p>
                <ButtonComponent child={"Agregar al carrito"} onClick={pushToCart}/>
              </div>
            </div>
            <div>
              <p className="product-description">{productData.description}</p>
            </div>
              <div className="product-characteristics">
                <div className="new-product-characteristic">
                  {productData.characteristics.map((current, index) => (
                    <p key={index}>{current.characteristic}</p>
                  ))}
                </div>
                <div className="new-product-characteristic-value">
                  {productData.characteristics.map((current, index) => (
                    <div key={index}>
                      <p>{current.value}</p>
                    </div>
                  ))}
                </div>
            </div>
          </section>
          <section className="another-products">
            <p className="another-products-title">Otros productos que te podrían interesar</p>
            <div className="another-products-container">
              { recommendedProducts ?
              recommendedProducts.map((current) =>
                current._id !== productData._id ? (
                  <ProductItem productData={current} />
                ) : undefined
              ) : undefined
              }
            </div>
          </section>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <p>Missing product data</p>
      </div>
    );
  }
};

export default ProductRoute;
