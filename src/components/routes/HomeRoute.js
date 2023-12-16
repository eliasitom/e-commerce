import "../../styleSheets/routes/HomeRoute.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Browser from "../Browser"
import NavBar from "../NavBar"
import PromotionsPanel from "../PromotionsPanel"
import TopProduct from "../TopProduct"
import ProductsSlider from "../ProductsSlider";
import CartModal from "../CartModal"

import useCategories from "../../customHooks/useCategories";
import Category from "../Category";

function HomeRoute() {
  const navigate = useNavigate()

  const [onSaleProducts, setOnSaleProducts] = useState([])
  const [bestSellerProducts, setBestSellerProducts] = useState([])

  const categories = useCategories()
  
  useEffect(() => {
        // Obtener productos en oferta
        try {
          fetch(`http://localhost:8000/api/get_products_on_sale`, {
            method: "GET",
            headers: { "Content-Type": "appliaction/json" },
          })
            .then((response) => response.json())
            .then((res) => {
              setOnSaleProducts(res);
            })
            .catch((err) => console.log(err));
        } catch (error) {
          console.log(error);
        }
    
        // Obtener productos más vendidos
        try {
          fetch(`http://localhost:8000/api/get_best_seller_products`, {
            method: "GET",
            headers: { "Content-Type": "appliaction/json" },
          })
            .then((response) => response.json())
            .then((res) => {
              setBestSellerProducts(res);
            })
            .catch((err) => console.log(err));
        } catch (error) {
          console.log(error);
        }
  }, [])


  return (
    <div className="App">
      <NavBar />
      <div>
        <Browser />
        <CartModal />
        <hr />
        <div className="top-products">
          <p className="top-products-title">lo más vendido</p>
          <div className="top-products-container">
            {
              bestSellerProducts.map((current, index) => (
                <TopProduct key={index} title={current.name} img={current.images[0]} price={current.price} onClick={() => navigate(`/product/${current._id}`)}/>
              ))
            }
          </div>
        </div>
        <hr />
        <PromotionsPanel />
        <hr />
        <div className="home-categories-container">
          {
            categories.length > 0 ?
            categories.map((current, index) => (
              <Category key={index} name={current.name} image={current.image} onClick={() => navigate(`/products/${current.name}`)}/>
            )) : undefined
          }
        </div>
      </div> 
    </div>
  );
}

export default HomeRoute;
