import "../../styleSheets/routes/CategoryRoute.css";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import useProducts from "../../customHooks/useProducts";
import ProductItem from "../ProductItem";

import {
  BsArrowUpCircle,
  BsArrowUpCircleFill,
  BsArrowDownCircle,
  BsArrowDownCircleFill,
} from "react-icons/bs";

const CategoryRoute = () => {
  const categoryName = useParams().category; //Esto es solo el nombre de la categoria, se obtiene mediante URL params
  const [categoryData, setCategoryData] = useState(); //Datos de la categoria

  const navigate = useNavigate();

  const products = useProducts("categories", categoryName); //Array de todos los productos
  const [filteredProducts, setFilteredProducts] = useState([]); //Estos son los productos que pasaron los filtros seleccionados

  const [currentSorters, setCurrentSorters] = useState([]); //filtros actuales
  const [sorterByPrice, setSorterByPrice] = useState(""); //"" = no filtros // "higherPrice" = mayor a menor// "lowerPrice" = menor a mayor

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

  const handleSorter = (sorterName_, sorterValue_) => {
    //Si el sorter clickeado forma parte currentSorters
    if (
      currentSorters.filter(
        (current) =>
          current.sorterName === sorterName_ &&
          current.sorterValue === sorterValue_
      ).length > 0
    ) {
      const newCurrentSorters = currentSorters.filter((current) => {
        //En el caso de que el filtro sea igual debe consultar si el valor es distinto para retornarlo
        if (
          current.sorterName === sorterName_ &&
          current.sorterValue !== sorterValue_
        )
          return current;
        //En el caso de que el filtro sea distinto retornarlo directamente
        else if (current.sorterName !== sorterName_) return current;
      });
      setCurrentSorters(newCurrentSorters);
    } else {
      //Eliminar de currentSorters todos los filtros que coincidan con sorterName_ (ej: sorterName_ == "color")
      let newCurrentSorters = currentSorters.filter(
        (current) => current.sorterName !== sorterName_
      );

      //Agregar el nuevo filtro a newCurrentSorters
      newCurrentSorters = [
        ...newCurrentSorters,
        { sorterName: sorterName_, sorterValue: sorterValue_ },
      ];

      setCurrentSorters(newCurrentSorters);
    }
  };

  // Actualizar filteredProducts cuando currentSorters es modificado
  useEffect(() => {
    const newFilteredProducts = products.filter((currentProduct) => {
      // 1º Obtener el indice de la categoria actual
      const currentCategoryIndex = currentProduct.categories.findIndex(
        (element) => {
          return element.categoryName === categoryData.name;
        }
      );

      // 2º Crear un array con los filtros aprobados y desaprobados
      const approvedFilters = currentSorters.map((currentSorter) => {
        return currentProduct.categories[
          currentCategoryIndex
        ].selectedValues.some((elem) => {
          return (
            elem.sorterName === currentSorter.sorterName &&
            elem.sorterValue === currentSorter.sorterValue
          );
        });
      });

      // 3º Si todos los filtros fueron aprobados retornar el producto
      if (approvedFilters.every((elem) => elem === true)) return currentProduct;
    });

    // 4º Actualizar el estado filteredProducts
    setFilteredProducts(newFilteredProducts);
  }, [currentSorters]);

  // Gestionar ordenamiento de productos mediante el precio (mayor a menor o viceversa)
  const handleSorterByPrice = (sorter) => {
    // En el caso de que no hayan filtros seleccionados (marca, color, almacenamiento...)
    if (currentSorters.length === 0) {
      if (sorter === sorterByPrice) {
        //En el caso de que se elimine el filtro por ordenamiento de precio
        setSorterByPrice("");
        setFilteredProducts([]);
      } else if (sorter === "lowerPrice") {
        //En el caso de que se ordene de menor a mayor
        setSorterByPrice("lowerPrice");
        const sorteredProducts = [...products].sort((a, b) => {
          return a.price - b.price;
        });
        setFilteredProducts(sorteredProducts);
      } else {
        //En el caso de que se ordene de mayor a menor
        setSorterByPrice("higherPrice");
        const sorteredProducts = [...products].sort((a, b) => {
          return b.price - a.price;
        });
        setFilteredProducts(sorteredProducts);
      }
    }
    // En el caso de que hayan filtros seleccionados (marca, color, almacenamiento...)
    else {
      if (sorter === sorterByPrice) {
        //En el caso de que se elimine el filtro por ordenamiento de precio
        setSorterByPrice("");
        setFilteredProducts([]);
      } else if (sorter === "lowerPrice") {
        //En el caso de que se ordene de menor a mayor
        setSorterByPrice("lowerPrice");
        const sorteredProducts = [...filteredProducts].sort((a, b) => {
          return a.price - b.price;
        });
        setFilteredProducts(sorteredProducts);
      } else {
        //En el caso de que se ordene de mayor a menor
        setSorterByPrice("higherPrice");
        const sorteredProducts = [...filteredProducts].sort((a, b) => {
          return b.price - a.price;
        });
        setFilteredProducts(sorteredProducts);
      }
    }
  };




  return (
    <div className="category-route-main">
      <header>
        <h2 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          CIRCUIT UY
        </h2>
      </header>
      <main>
        <aside className="category-route-filter-panel">
            <p className="category-route-filter-title">Aplicar filtros</p>
            <div className="category-route-price-filter">
              <p>Precio</p>
              <div className="category-route-price-filter-one">
                {sorterByPrice === "lowerPrice" ? (
                  <BsArrowDownCircleFill
                    onClick={() => handleSorterByPrice("lowerPrice")}
                  />
                ) : (
                  <BsArrowDownCircle
                    onClick={() => handleSorterByPrice("lowerPrice")}
                  />
                )}
                {sorterByPrice === "higherPrice" ? (
                  <BsArrowUpCircleFill
                    onClick={() => handleSorterByPrice("higherPrice")}
                  />
                ) : (
                  <BsArrowUpCircle
                    onClick={() => handleSorterByPrice("higherPrice")}
                  />
                )}
              </div>             
              <div className="category-route-sorters-container">
                {categoryData
                  ? categoryData.sorters.map((current, index) => (
                      <div key={index}>
                        <p>{current.sorterName}</p>
                        <ul>
                          {current.sorterValues.map((element, index) => (
                            <li
                              key={index}
                              onClick={
                                () =>
                                  handleSorter(
                                    current.sorterName,
                                    element
                                  ) /* Enviamos sorterName y sorterValue actual */
                              }
                              className={
                                currentSorters.filter(
                                  (e) =>
                                    e.sorterName === current.sorterName &&
                                    e.sorterValue === element
                                ).length > 0
                                  ? "sorter-active"
                                  : "sorter-not-active"
                              }
                            >
                              {element}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  : undefined}
              </div>
            </div>
        </aside>
        <section>
          <article className="category-route-browser">
            <input placeholder="xiaomi redmi note 7..." />
            <button>buscar</button>
          </article>
          <h2>{categoryData ? categoryData.name : undefined}</h2>
          <article className="category-route-products-container">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((current, index) => (
                <ProductItem
                  productData={current}
                  key={index}
                  onClick={() => navigate(`/product/${current._id}`)}
                />
              ))
            ) : currentSorters.length > 0 && filteredProducts.length === 0 ? (
              <h2 className="category-route-no-products-alert">
                No se han encontrado productos para los filtros seleccionados
              </h2>
            ) : products.length > 0 ? (
              products.map((current, index) => (
                <ProductItem
                  productData={current}
                  key={index}
                  onClick={() => navigate(`/product/${current._id}`)}
                />
              ))
            ) : undefined}
          </article>
        </section>
      </main>
    </div>
  );
};

export default CategoryRoute;
