import { useState, useEffect } from "react";

import "../styleSheets/ProductsSlider.css";

const ProductsSlider = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    //Obtener categorias:
    fetch("http://localhost:8000/api/get_categories", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((res) => setCategories(res.categories))
      .catch((err) => console.log(err));


  });

  return (
    <div className="products-slider-main">
      
    </div>
  );
};

export default ProductsSlider;
