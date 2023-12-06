import { useEffect, useState } from "react";
import "../styleSheets/PromotionsPanel.css";

import PromotionItem from "./PromotionIntem";

const PromotionsPanel = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    // Obtener productos en oferta
    try {
      fetch(`http://localhost:8000/api/get_products_on_sale`, {
        method: "GET",
        headers: { "Content-Type": "appliaction/json" },
      })
        .then((response) => response.json())
        .then((res) => {
          setProducts(res);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, [])


  return (
    <div className="promotions-container">
      <p className="promotions-title">ofertas</p>

      {
        products.map((current, index) => (
          <PromotionItem
          key={index}
          productId={current._id} 
          img={current.images[0]}
          name={current.name}
          description={current.description}
          right={index % 2 === 0 ? false : true}/>
        ))
      }
    </div>
  );
};

export default PromotionsPanel;
