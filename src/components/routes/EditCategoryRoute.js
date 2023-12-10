import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import useProducts from "../../customHooks/useProducts";
import { Tooltip } from "react-tooltip";

import "../../styleSheets/routes/EditCategoryRoute.css";

import ProductItem from "../ProductItem";





const SorterItem = ({ sorterData, pullSorter, pullSorterValue, pushSorterValue }) => {

  const [newValue, setNewValue] = useState("");

  const [confirmMode, setConfirmMode] = useState(false);

  const confirmTimeOut = () => {
    let timer = 3;
    setConfirmMode(true);

    const intervalRef = setInterval(() => {
      if (timer === -1) {
        setConfirmMode(false);
        clearInterval(intervalRef);
      } else {
        timer--;
      }
    }, 1000);
  };


  return (
    <div className="sorter-item">
      <Tooltip id="my-tooltip" />
      <div className="sorter-item-header">
        <p
          data-tooltip-id="my-tooltip"
          data-tooltip-content={sorterData.sorterName}
          data-tooltip-place="top"
        >
          {sorterData.sorterName}
        </p>
        {confirmMode ? (
          <button className="sorter-item-confirm" onClick={() => pullSorter(sorterData.sorterName)}>
            confirmar
          </button>
        ) : (
          <button
            className="remove-characteristic-button"
            onClick={() => confirmTimeOut()}
          >
            {" "}
            ×{" "}
          </button>
        )}
      </div>
      <div className="sorter-item-values">
        {sorterData.sorterValues.map((current, index) => (
          <div key={index} className="sorter-item-value">
            <p>{current}</p>
            <button
              className="remove-characteristic-button"
              onClick={() => pullSorterValue(sorterData.sorterName, current)}
            >
              {" "}
              ×{" "}
            </button>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          pushSorterValue(sorterData.sorterName, newValue);
          setNewValue("")
        }}
      >
        <input
          placeholder="apple, rojo, 128 Gb..."
          onChange={(e) => setNewValue(e.target.value)}
          value={newValue}
        />
        <button>agregar</button>
      </form>
    </div>
  );
};

const CreateSorterForm = ({ categoryName, pushSorter_ }) => {
  const [sorterName, setSorterName] = useState("");

  const pushSorter = () => {
    fetch("http://localhost:8000/api/create_category_filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryName, sorterName }),
    })
    .then(() => {
      setSorterName("")
      pushSorter_(sorterName)
    })
    .catch((err) => console.log(err));
  };

  return (
    <div className="sorter-item-creator">
      <p className="sorter-item-name">Crear filtro</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          pushSorter();
        }}
      >
        <label>
          Nombre
          <input
            placeholder="marca, color, almacenamiento..."
            onChange={(e) => setSorterName(e.target.value)}
            value={sorterName}
          />
        </label>
        <button>crear</button>
      </form>
    </div>
  );
};

const EditCategoryRoute = () => {
  const categoryName = useParams().category; //Esto es solo el nombre de la categoria, se obtiene mediante URL params
  const [categoryData, setCategoryData] = useState(); //Datos de la categoria

  const products = useProducts("categories", categoryName)

  const navigate = useNavigate()

  const [confirmDelete, setConfirmDelete] = useState(false);

  


  //Al clickear en eliminar categoria hay un timeOut de 3 segundos que te pide confirmacion
  const confirmTimeOut = () => {
    let timer = 3;
    setConfirmDelete(true);

    const intervalRef = setInterval(() => {
      if (timer === -1) {
        setConfirmDelete(false);
        clearInterval(intervalRef);
      } else {
        timer--;
      }
    }, 1000);
  };

  const deleteCategory = () => {
    fetch(`http://localhost:8000/api/delete_category/${categoryData._id}`, {
      method: "DELETE"
    })
    .then(() => {
      navigate("/admin")
    })
    .catch(err => console.log(err))
  }

  // Obtener categoryData
  useEffect(() => {
    fetch(`http://localhost:8000/api/get_category/${categoryName}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((res) => {
        setCategoryData(res.category);
      })
      .catch((err) => console.log(err));
  }, []);



  const pushSorter = (sorterName) => {
    // JSON.parse(JSON.stringify(object)) es la forma correcta de clonar un objeto y no crear una referencia
    let newCategoryData = JSON.parse(JSON.stringify(categoryData));
    
    newCategoryData.sorters.push({sorterName, sorterValues: []})
    setCategoryData(newCategoryData)
  }
  const pushSorterValue = (sorterName, newValue) => {
    fetch("http://localhost:8000/api/create_category_filter_value", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({categoryName, sorterName, newValue})
    })
    .then(response => response.json())
    .then((res) => {
      console.log(res)
      setCategoryData(res.categoryData)
    })
    .catch((error) => console.log(error));
  }

  const pullSorter = (sorterName) => {
    fetch("http://localhost:8000/api/remove_category_filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({sorterName_: sorterName, categoryName: categoryData.name})
    })
    .then(response => response.json())
    .then((res) => {
      setCategoryData(res.categoryData)
    })
    .catch((error) => console.log(error));
  };
  const pullSorterValue = (sorterName, sorterValue) => {
    fetch("http://localhost:8000/api/remove_category_filter_value", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({categoryName, sorterName, sorterValue})
    })
    .then(response => response.json())
    .then((res) => {
      setCategoryData(res.categoryData)
    })
    .catch((error) => console.log(error));
  }

  if (categoryData) {
    return (
      <main className="edit-category-route-main">
         <header>
          <h2>
            <a onClick={() => navigate("/admin")} style={{ cursor: "pointer" }}>
              Panel de administrador
            </a>{" "}
            / editar categoria
          </h2>
        </header>
        <main style={{display: "flex", flexDirection: "row"}}>
        <section className="edit-category-main-data">
          <img src={categoryData.image} />
          <h2>{categoryData.name}</h2>
          <div className="edit-category-options">
            {
              !confirmDelete ? 
              <button className="edit-category-delete-cat" onClick={() => confirmTimeOut()}>eliminar</button> :
              <button className="edit-category-delete-cat" onClick={() => deleteCategory()}>confirmar</button>
            }
            <button className="edit-category-edit-cat">editar</button>
          </div>
        </section>
        <section className="edit-category-secondary-data">

          {/* Filtros y valores */}
          <div className="edit-category-route-sorters">
            <div className="edit-category-route-sorters-header">
            <h2>Filtros actuales </h2>
            <p>*todos los cambios se guardaran automaticamente</p>
            </div>
            <div className="edit-category-route-sorters-container">
              <CreateSorterForm 
              categoryName={categoryData.name}
              pushSorter_={pushSorter}
              />
              {categoryData.sorters.length > 0
                ? categoryData.sorters.map((current, index) => (
                    <SorterItem
                      sorterData={current}
                      categoryName={categoryName}
                      pushSorterValue={pushSorterValue}
                      pullSorter={pullSorter}
                      pullSorterValue={pullSorterValue}
                      key={index}
                    />
                  ))
                : undefined}
            </div>
          </div>

          {/* Productos */}
          <div className="edit-category-route-products">
            <h2>Productos actuales</h2>
            <div className="edit-category-route-products-container">
              {
                products.map((current, index) => (
                  <ProductItem 
                  key={index}
                  productData={current}
                  onClick={() => navigate(`/admin/edit_product/${current._id}`)}/>
                ))
              }
            </div>
          </div>
        </section>
        </main>
      </main>
    );
  }
};

export default EditCategoryRoute;
