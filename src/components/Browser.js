import { useState } from "react";
import "../styleSheets/Browser.css";
import { useNavigate } from "react-router-dom";

import { ProductsContext } from "./context/ProductsContext";
import { useContext } from "react";

const Browser = () => {
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();
  const { setProductsFound } = useContext(ProductsContext);

  const search = (e) => {
    e.preventDefault()
    if (keyword) {
      fetch(`http://localhost:8000/api/general_search/${keyword}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((res) => {
          setProductsFound(res.products);
          navigate("/products_found");
        })
        .catch(error => console.log(error))
    }
  };
  return (
    <div className="browser">
      <h1>circuit uy</h1>
      <form onSubmit={search}>
        <input
          placeholder="notebook, keyboard, audio..."
          list="datalist"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
        />
        <datalist id="datalist">
          <option value="celulares" />
          <option value="xbox one" />
          <option value="audio" />
          <option value="iphone 14 pro max" />
        </datalist>
        <button type="submit">buscar</button>
      </form>
    </div>
  );
};

export default Browser;
