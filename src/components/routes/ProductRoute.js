import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";

import "../../styleSheets/routes/ProductRoute.css";

import ButtonComponent from "../ButtonComponent";
import ProductItem from "../ProductItem";
import { CartContext } from "../context/CartContext";
import { CartModal } from "../CartModal";

const ImagesModal = ({ images, closeModal }) => {
  const [current, setCurrent] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();

    if (current < images.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      setCurrent(0);
    }
  };

  const previousImage = (e) => {
    e.stopPropagation();

    if (current > 0) {
      setCurrent((prev) => prev - 1);
    } else {
      setCurrent(images.length - 1);
    }
  };

  const handleCurrent = (e, index) => {
    e.stopPropagation()

    setCurrent(index)
  }

  return (
    <div className="image-modal-main" onClick={closeModal}>
      <section>
        <p onClick={previousImage}>{"<"}</p>
        <img src={images[current]} onClick={(e) => e.stopPropagation()} />
        <p onClick={nextImage}>{">"}</p>
      </section>
      <section>
        {images.map((current, index) => (
          <img src={current} key={index} onClick={e => handleCurrent(e, index)}/>
        ))}
      </section>
    </div>
  );
};

const ProductRoute = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { cartProducts, setCartProducts } = useContext(CartContext);

  const [productData, setProductData] = useState();
  const [recommendedProducts, setRecommendedProducts] = useState();

  const [imageModal, setImageModal] = useState(false);

  // Obtener productData
  useEffect(() => {
    fetch(`http://localhost:8000/api/get_product/${productId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((res) => {
        setProductData(res);
        getRecommendedProducts(res.tags);
      })
      .catch((err) => console.log(err));
  }, [productId]);

  // Luego de obtener productData obtiene recommendedProducts mediante productData.tags
  const getRecommendedProducts = (tags) => {
    fetch("http://localhost:8000/api/get_products_by_tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productTags: tags }),
    })
      .then((response) => response.json())
      .then((res) => {
        setRecommendedProducts(res);
      })
      .catch((err) => console.log(err));
  };

  //Agregar al carrito
  const pushToCart = () => {
    const newCartProducts = [...cartProducts, { ...productData, ammount: 1 }];
    setCartProducts(newCartProducts);
  };

  //Manejar click en producto recomendado
  const handleRecommendedProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (productData) {
    return (
      <div className="product-page">
        <header>
          <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            CIRCUIT UY
          </h1>
        </header>
        {imageModal ? (
          <ImagesModal
            images={productData.images}
            closeModal={() => setImageModal(false)}
          />
        ) : undefined}
        <CartModal />
        <div className="product-page-main-div">
          <section className="product-page-data">
            <div className="product-page-main-data">
              <div className="product-page-images">
                <img
                  src={productData.images[0]}
                  className="product-page-main-image"
                  onClick={() => setImageModal(true)}
                />
                <div className="product-page-images-container">
                  {productData.images.map((current, index) => (
                    <img src={current} key={index} onClick={() => setImageModal(true)}/>
                  ))}
                </div>
              </div>
              <div className="product-header">
                <h2>{productData.name}</h2>
                <p className="product-price">USD {productData.price}</p>
                <ButtonComponent
                  child={"Agregar al carrito"}
                  onClick={pushToCart}
                />
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
            <p className="another-products-title">
              Otros productos que te podrían interesar
            </p>
            <div className="another-products-container">
              {recommendedProducts
                ? recommendedProducts.map((current, index) =>
                    current._id !== productData._id ? (
                      <ProductItem
                        key={index}
                        productData={current}
                        onClick={() => handleRecommendedProduct(current._id)}
                      />
                    ) : undefined
                  )
                : undefined}
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
