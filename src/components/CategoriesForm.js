import "../styleSheets/CategoriesForm.css"

import { useEffect, useState } from "react";
import ButtonComponent from "./ButtonComponent";

const CategoriesForm = () => {
  const [categories, setCategories] = useState();

  const [name, setName] = useState("");
  const [image, setImage] = useState();
  const [currentSorter, setCurrentSorter] = useState("");
  const [sorters, setSorters] = useState([]);

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

  // Enviar categoria
  const sendCategory = (e) => {
    e.preventDefault()

    if(name && image) {
      let formData = new FormData()
      formData.append("data", JSON.stringify({name, sorters}))
      formData.append("image", image)
  
      fetch("http://localhost:8000/api/send_category", {
        method: "POST",
        body: formData
      })
        .then((response) => response.json())
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } else {
      alert("Es necesario agregar un nombre y una imagen.")
    }
  }

  /* SORTERS */

  const submitSorter = (e) => {
    e.preventDefault()

    if(currentSorter) {
      setSorters(prev => [...prev, currentSorter])
    setCurrentSorter("")
    } else {
      alert("¡No te olvides de crear un filtro!")
    }
  }
  const removeSorter = (sorter) => {
    const newSorters = sorters.filter(current => current !== sorter)
    setSorters(newSorters)
  }

  return (
    <div className="categories-form-main">
      <form>
        <p className="categories-form-title">Crear nueva categoria</p>
        <label>
          Nombre
          <input
            placeholder="Celulares, laptops, audio..."
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          Portada{" "}
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </label>
        {
            image ? 
            <img src={URL.createObjectURL(image)}/>
            : undefined
          }
        <div style={{width: "100%", marginTop: "15px"}}>
          <label>
            Agregar filto{" "}
            <input
              placeholder="Marca, color, bluetooth..."
              onChange={(e) => setCurrentSorter(e.target.value)}
              value={currentSorter}
            />{" "}
            <button className="categories-form-button" onClick={submitSorter}>agregar</button>
          </label>
          <div className="sorters-container">
          {sorters.length > 0
            ? sorters.map((current, index) => (
                <div key={index} className="category-sorter">
                  <p>{current}</p>
                  <button onClick={() => removeSorter(current)}>×</button>
                </div>
              ))
            : undefined}
          </div>
        </div>
        <ButtonComponent child={"Agregar"} margin={{top: "15px"}} onClick={e => sendCategory(e)}/>
      </form>
    </div>
  );
};

export default CategoriesForm;
