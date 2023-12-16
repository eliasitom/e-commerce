import "../../styleSheets/routes/EditProductRoute.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ButtonComponent from "../ButtonComponent";
import InputAlert from "../InputAlert";
import ProductItem from "../ProductItem";
import useCategories from "../../customHooks/useCategories";
import SorterModal from "../SortersModal";

const ImageModal = ({ image, closeModal }) => {
  return (
    <div className="image-modal-background">
      <div className="image-modal">
        <img src={image} />
        <button className="new-product-button" onClick={closeModal}>
          cerrar ventana
        </button>
      </div>
    </div>
  );
};

const OnSaleProduct = ({ productData }) => {
  return (
    <div className="on-sale-product">
      <img src={productData.images[0]} />
      <h1>{productData.name}</h1>
    </div>
  );
};

//Item del array de todas las categorias 
const CategoryItem = ({active, categoryData, openModal}) => {
  return (
    <div className={`category-item-main ${active ? "category-item-enabled" : "category-item-disabled"}`} >
      <img src={categoryData.image}/>
        <p>{categoryData.name}</p>
        <button className="category-button" onClick={openModal}>abrir</button>
    </div>
  )
}

const EditProductRoute = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const allCategories = useCategories()

  const [name, setName] = useState("");
  const [nameAlert, setNameAlert] = useState(true);

  const [description, setDescription] = useState("");

  const [price, setPrice] = useState(1);

  const [images, setImages] = useState([]);
  const [imageSelected, setImageSelected] = useState();
  const [imagesAlert, setImagesAlert] = useState(true);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState([]);

  const [categories, setCategories] = useState([])
  const [currentCategory, setCurrentCategory] = useState(false) //Sí es distinto a false, se abre SortersModal

  const [characteristics, setCharacteristics] = useState([]);
  const [characteristic, setCharacteristic] = useState("");
  const [characteristicValue, setCharacteristicValue] = useState("");

  const [onSale, setOnSale] = useState(undefined);
  const [onSaleProducts, setOnSaleProducts] = useState([]);

  const [bestSeller, setBestSeller] = useState(undefined);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);

  const [confirmMode, setConfirmMode] = useState(false) //Confirm mode para eliminar el producto

  // Obtener productData
  useEffect(() => {
    fetch(`http://localhost:8000/api/get_product/${productId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((res) => {
        setName(res.name);
        setDescription(res.description);
        setPrice(res.price);
        setTags(res.tags);
        setCharacteristics(res.characteristics);
        setImages(res.images);
        setOnSale(res.onSale);
        setBestSeller(res.bestSeller);
        setCategories(res.categories);
      })
      .catch((err) => console.log(err));

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
  }, [productId]);

  // Enviar producto actualizado
  const sendChanges = () => {
    const productData = {
      _id: productId,
      name,
      description,
      price,
      tags,
      categories,
      characteristics,
      onSale,
      bestSeller,
    };

    let formData = new FormData();

    //Agregar los datos del producto a formData
    formData.append("productData", JSON.stringify(productData));

    //Agregar las imagenes eliminadas a formData
    deletedImages.forEach((current) => {
      formData.append("deletedImages", current);
    });

    //Agregar las nuevas imagenes a formData
    newImages.forEach((current) => {
      formData.append("newImages", current);
    });

    fetch(`http://localhost:8000/api/update_product`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((res) => {
        navigate("/admin");
      })
      .catch((err) => console.log(err));
  };

  // Timeout para eliminar producto
  const deleteProductTimeout = () => {
    setConfirmMode(true)

    let timer = 3

    setTimeout(() => {
      if(timer === -1) {
        setConfirmMode(false)
      } else timer--
    }, 1000);
  }

  //Eliminar producto
  const deleteProduct = () => {
    fetch(`http://localhost:8000/api/delete_product/${productId}`, {
      method: "DELETE"
    })
    .then(() => {
      navigate("/admin")
    })
    .catch(err => console.log(err))
  }

  // tags

  const submitTag = (e) => {
    e.preventDefault();

    if (currentTag) {
      setTags((prev) => [...prev, currentTag]);
      setCurrentTag("");
    }
  };
  const removeTag = (tag) => {
    const newTags = tags.filter((current) => current !== tag);

    setTags(newTags);
  };

  // categories

  const saveCategory = (data) => {
    const {categoryName, active, selectedValues} = data

    //Cerrar la ventana modal
    setCurrentCategory(false)

    //Si la categoria está activa y no forma parte de las categorias actuales, agregarla
    if(active && categories.filter(e => e.categoryName === categoryName).length === 0) {
      setCategories(prev => [...prev, {categoryName, selectedValues}])
    }
    //En este caso la categoria ya forma parte de las categorias actuales, asi que debe actualizarla 
    else if (active && categories.filter(e => e.categoryName === categoryName).length > 0) {
      let newCategories = categories

      const index = newCategories.findIndex(obj => obj.categoryName === categoryName)

      if(index !== -1) {
        newCategories.splice(index, 1, {categoryName, selectedValues})
      }
    }
    //Si la categoria esta desactivada debe eliminarla de las categorias actuales.
    else if (!active) {
      const newCategories = categories.filter(obj => obj.categoryName !== categoryName)
      setCategories(newCategories)
    }
  }

  // characteristics

  const submitCharacteristic = (e) => {
    e.preventDefault();

    if (characteristic && characteristicValue) {
      setCharacteristics((prev) => [
        ...prev,
        { characteristic, value: characteristicValue },
      ]);
      setCharacteristic("");
      setCharacteristicValue("");
    }
  };
  const removeCharacteristic = (characteristic) => {
    const newCharacteristic = characteristics.filter(
      (current) => current.characteristic !== characteristic.characteristic
    );
    setCharacteristics(newCharacteristic);
  };

  // images
  const submitImage = (image) => {
    if (images.length < 6) {
      setNewImages((prev) => [...prev, image]);
    }
  };
  const removeImage = (image, isNew) => {
    //Comprobar si la imagen a eliminar es nueva (formato JPG o PNG) o si es original (formato URL)
    if (!isNew) {
      //el estado images solo sirve para previsualizar las imagenes del producto en el cliente, el servidor
      //solo tiene en cuenta newImages y deletedImages ya que las imagenes no eliminadas se mantienen.
      const imagesUpdated = images.filter((current) => current !== image);
      setImages(imagesUpdated);
      setImageSelected(null);
      setDeletedImages((prev) => [...prev, image]);
    } else {
      const newImagesUpdated = newImages.filter((current) => current !== image);
      setNewImages(newImagesUpdated);
      setImageSelected(null);
    }
  };

  if (productId) {
    return (
      <div
        className="new-product-page"
        style={imageSelected ? { overflow: "hidden" } : undefined}
      >
        {imageSelected ? (
          <ImageModal
            image={imageSelected}
            closeModal={() => setImageSelected(null)}
          />
        ) : undefined}
        {
          currentCategory ? 
          <SorterModal 
          categoryData={currentCategory} 
          currentCategories={categories} 
          saveCategory={saveCategory}
          closeModal={() => setCurrentCategory(false)}/>
          : undefined
        }
        <header>
          <h2>
            <a onClick={() => navigate("/admin")} style={{ cursor: "pointer" }}>
              Panel de administrador
            </a>{" "}
            / editar producto
          </h2>
        </header>
        
        <aside>
          {
            confirmMode ?
            <button className="edit-product-delete-button" onClick={() => deleteProduct()}>Confirmar</button> :
            <button className="edit-product-delete-button" onClick={() => deleteProductTimeout()}>Eliminar producto</button>
          }
          <button className="new-product-save-button" onClick={sendChanges}>Guardar cambios</button>
        </aside>

        <section className="new-product-form-one">
          <div className="new-product-main-data">
            <h4 className="new-product-subtitle">Información general</h4>
            <div>
              <label>
                Nombre del producto
                <input
                  placeholder="Xiaomi Redmi Note 12"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                {!nameAlert ? (
                  <InputAlert
                    text={"Este campo es obligatorio"}
                    duration={4}
                    endAlert={() => setNameAlert(true)}
                  />
                ) : undefined}
              </label>
              <label>
                Precio del producto
                <input
                  type="number"
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </label>
            </div>
            <label>
              Seleccionar imagenes{" "}
              <input
                type="file"
                onChange={(e) => submitImage(e.target.files[0])}
              />
              {!imagesAlert ? (
                <InputAlert
                  text={"Este campo es obligatorio"}
                  duration={4}
                  endAlert={() => setImagesAlert(true)}
                />
              ) : undefined}
            </label>
            <div className="edit-product-images">
              {images.length > 0
                ? images.map((current, index) => (
                    <div className="edit-product-image" key={index}>
                      <img
                        src={current}
                        style={{ width: "100px", height: "100px" }}
                        alt={current.name}
                        onClick={() => setImageSelected(current)}
                      />
                      <button
                        className="remove-characteristic-button"
                        onClick={() => removeImage(current, false)}
                      >
                        {" "}
                        ×{" "}
                      </button>
                    </div>
                  ))
                : undefined}
              {newImages.length > 0
                ? newImages.map((current, index) => (
                    <div className="edit-product-image" key={index}>
                      <img
                        src={URL.createObjectURL(current)}
                        style={{ width: "100px", height: "100px" }}
                        alt={current.name}
                        onClick={() => setImageSelected(current)}
                      />
                      <button
                        className="remove-characteristic-button"
                        onClick={() => removeImage(current, true)}
                      >
                        {" "}
                        ×{" "}
                      </button>
                    </div>
                  ))
                : undefined}
            </div>
          </div>
        </section>
        <section className="new-product-secondary-data">
          <p>Descripción del producto</p>
          <textarea
            placeholder="Celular Xiaomi Redmi Note 12 128GB 4GB Ice Blue DS"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <h4 className="new-product-subtitle">Información adicional</h4>

          {/* Etiquetas */}

          <form className="new-product-tag-form">
            <label>
              Agregar etiquetas{" "}
              <input
                placeholder="celular, xiaomi..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
              />
              <button onClick={submitTag} className="new-product-button">
                añadir
              </button>
            </label>
          </form>
          <div className="new-product-tags-container">
            {tags.map((current, index) => (
              <div key={index} className="new-product-tag">
                <p>{current}</p>
                <button
                  className="new-product-remove-button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeTag(current);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Categorias */}

          <div className="edit-product-categories">
            <p>Todas las categorias</p>
          <div className="edit-product-categories-container">
          { 
            allCategories.length > 0 ?
            allCategories.map((current, index) => (
             <CategoryItem 
             key={index}
             active={
             categories.filter(elem => elem.categoryName === current.name).length > 0 ? true : false
             }
             categoryData={current} 
             openModal={() => setCurrentCategory(current)}
             />
            ))
            : undefined
          }
          </div>
          </div>

          {/* características */}

          <form className="new-product-characteristics-main">
            <div className="new-product-characteristic-form">
              <p style={{ marginRight: "5px" }}>Agregar características</p>
              <input
                placeholder="almacenamiento"
                onChange={(e) => setCharacteristic(e.target.value)}
                value={characteristic}
              />
              <input
                placeholder="128Gb"
                className="new-product-characteristic-data"
                onChange={(e) => setCharacteristicValue(e.target.value)}
                value={characteristicValue}
                style={{ marginLeft: "5px" }}
              />
              <button
                onClick={submitCharacteristic}
                className="new-product-button"
              >
                añadir
              </button>
            </div>
            <div className="new-product-characteristics-table">
              <div className="new-product-characteristic">
                {characteristics.map((current, index) => (
                  <p key={index}>{current.characteristic}</p>
                ))}
              </div>
              <div className="new-product-characteristic-value">
                {characteristics.map((current, index) => (
                  <div key={index}>
                    <p>{current.value}</p>
                    <button
                      className="remove-characteristic-button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeCharacteristic(current);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </section>
        <section className="edit-product-tertiary-data">
          <h4 className="new-product-subtitle">Posicionamiento del producto</h4>
          <div className="edit-product-on-sale-form">
            <label>
              producto en oferta{" "}
              {
                onSale !== undefined ?
                <input
                type="checkbox"
                defaultChecked={onSale}
                value={onSale}
                onChange={(e) => setOnSale(e.target.checked)}
              /> : undefined
              }
            </label>
            <div>
              <p style={{ color: "rgba(0, 0, 0, 0.3)" }}>actuales ofertas:</p>
              <div className="edit-product-another-products">
                {onSaleProducts.map((current, index) => (
                  <OnSaleProduct key={index} productData={current} />
                ))}
              </div>
            </div>
          </div>
          <div
            style={{ marginTop: "70px" }}
            className="edit-product-best-seller-form"
          >
            <label>
              producto más vendido{" "}
              {
                bestSeller !== undefined ?
                <input
                type="checkbox"
                defaultChecked={bestSeller}
                value={bestSeller}
                onChange={(e) => setBestSeller(e.target.checked)}
              /> : undefined
              }
            </label>
            <div>
              <p style={{ color: "rgba(0, 0, 0, 0.3)" }}>
                actuales productos más vendidos:
              </p>
              <div className="edit-product-another-products">
                {bestSellerProducts.map((current, index) => (
                  <OnSaleProduct key={index} productData={current} />
                ))}
              </div>
            </div>
          </div>
        </section>
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

export default EditProductRoute;
