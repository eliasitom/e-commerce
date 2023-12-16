import "../../styleSheets/routes/NewProductRoute.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCategories from "../../customHooks/useCategories";

import InputAlert from "../InputAlert";
import SortersModal from "../SortersModal"


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

const OnSaleProduct = ({ productData }) => {
  return (
    <div className="on-sale-product">
      <img src={productData.images[0]} />
      <h1>{productData.name}</h1>
    </div>
  );
};

const ImageModal = ({ image, submitName, closeModal, deleteImage }) => {
  const [imageName, setImageName] = useState();
  const [formValidate, setFormValidate] = useState(true);

  const handleName = (e) => {
    e.preventDefault();

    if (imageName) {
      submitName(image, imageName);
    } else {
      setFormValidate(false);
    }
  };

  useEffect(() => {
    const newImageName = image.name.split(".").shift();
    setImageName(newImageName);
  }, []);

  return (
    <div className="image-modal-background">
      <div className="image-modal">
        <img
          src={URL.createObjectURL(image)}
          alt={imageName}
          onClick={() => console.log(image)}
        />
        <form onSubmit={handleName}>
          <input
            placeholder="texto alternativo de la imagen..."
            onChange={(e) => setImageName(e.target.value)}
            value={imageName}
          />
          <button className="new-product-button">confirmar</button>
          {!formValidate ? (
            <InputAlert
              text={"Este campo es obligatorio"}
              duration={4}
              endAlert={() => setFormValidate(true)}
            />
          ) : undefined}
        </form>
        <p>
          Los motores de búsqueda como Google, Firefox, Safari, entre otros,
          utilizan el texto alternativo (alt) para mejorar la accesibilidad del
          sitio web. Si se proporciona un valor para el atributo alt, los
          motores de búsqueda pueden mostrar la imagen en los resultados de
          búsqueda relevantes. Además, si se utiliza una palabra clave
          relevante, puede ayudar a mejorar el posicionamiento del sitio web en
          los resultados de búsqueda. Por lo tanto, es importante que la
          descripción sea relevante y concisa, pero lo suficientemente detallada
          como para transmitir el significado de la imagen.
        </p>
        <div className="image-modal-options">
          <button className="new-product-button" onClick={deleteImage}>
            eliminar imagen
          </button>
          <button className="new-product-button" onClick={closeModal}>
            cerrar ventana
          </button>
        </div>
      </div>
    </div>
  );
};

const NewProductRoute = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nameAlert, setNameAlert] = useState(true);

  const [description, setDescription] = useState("");

  const [price, setPrice] = useState(1);

  const [imageSelected, setImageSelected] = useState(null);
  const [images, setImages] = useState([]);
  const [imagesAlert, setImagesAlert] = useState(true);

  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState([]);

  const [characteristics, setCharacteristics] = useState([]);
  const [characteristic, setCharacteristic] = useState("");
  const [characteristicValue, setCharacteristicValue] = useState("");

  const allCategories = useCategories()
  const [currentCategory, setCurrentCategory] = useState(""); // Al ser distinto a undefined se abre la ventana modal 
  const [categories, setCategories] = useState([]);

  const [onSale, setOnSale] = useState(false)
  const [onSaleProducts, setOnSaleProducts] = useState([])

  const [bestSeller, setBestSeller] = useState(false)
  const [bestSellerProducts, setBestSellerProducts] = useState([])

  const [confirmMode, setConfirmMode] = useState(false) //Confirmar la cancelacion del producto

  // hacer el fetching de datos
  const createProduct = () => {
    //Name, images y categories son campos obligatorios (price no es un campo obligatorio porque tiene un valor por defecto de 1)
    if (name && images.length > 0) {
      const productData = {
        name,
        description,
        price,
        tags,
        categories,
        characteristics,
        onSale,
        bestSeller
      };

      //Crear el formData e insertar los datos (productData)
      let formData = new FormData();
      formData.append("productData", JSON.stringify(productData));

      //Insertar las imagenes al formData
      images.forEach((current) => {
        formData.append("images", current);
      });

      //Hacer la solicitud a la API
      fetch("http://localhost:8000/api/create_product", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((res) => {
          navigate("/admin");
        })
        .catch((err) => console.log(err));
    } else if (!name) {
      setNameAlert(false);
    } else if (!images.length > 0) {
      setImagesAlert(false);
    }
  };

  // Timeout para confirmar cancelacion
  const confirmTimeout = () => {
    setConfirmMode(true)

    let timer = 3

    setTimeout(() => {
      if(timer === -1) setConfirmMode(false)
      else timer--
    }, 1000);
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

  const handleCategories = (newCategory) => {
      let newCategories = categories.filter(elem => elem.categoryName !== newCategory.categoryName)
      if(newCategory.active) {
        newCategories = [...newCategories, newCategory]
      }
      setCategories(newCategories)

    setCurrentCategory(undefined)
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
      setImages((prev) => [...prev, image]);
    }
  };
  const removeImage = (image) => {
    const newImages = images.filter((current) => current !== image);
    setImages(newImages);
    setImageSelected(null);
  };
  const handleImageName = (image, imageName) => {
    const newImages = images.map((current) => {
      if (current === image) {
        console.log(image.name);
        console.log(imageName);

        //Obtener la extension de la imagen
        const extension = current.name.split(".").pop();
        //Establecer el nuevo nombre de la imagen y agregarle la extension al final
        current = new File([current], `${imageName + "." + extension}`, {
          type: current.type,
        });

        console.log(current.name);
      }
      return current;
    });
    setImageSelected(null);
    setImages(newImages);
  };

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
    <div
      className="new-product-page"
      style={imageSelected ? { overflow: "hidden" } : undefined}
    >
      {imageSelected ? (
        <ImageModal
          image={imageSelected}
          deleteImage={() => removeImage(imageSelected)}
          closeModal={() => setImageSelected(null)}
          submitName={(image, imageName) => handleImageName(image, imageName)}
        />
      ) : undefined}
      {
        currentCategory ?
        <SortersModal
        categoryData={currentCategory}
        currentCategories={categories}
        saveCategory={handleCategories}
        closeModal={() => setCurrentCategory(undefined)}
        />
        : undefined
      }
      <header>
        <h2>
          <a onClick={() => navigate("/admin")} style={{ cursor: "pointer" }}>
            Panel de administrador
          </a>{" "}
          / crear producto
        </h2>
      </header>

      <aside>
        {
          !confirmMode ?
          <button className="edit-product-delete-button" onClick={confirmTimeout}>Cancelar</button> :
          <button className="edit-product-delete-button" onClick={() => navigate("/admin")}>Confirmar</button>
        }
        <button className="new-product-save-button" onClick={createProduct}>Crear producto</button>
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
          <div className="new-product-images">
            {images.length > 0
              ? images.map((current) => (
                  <div className="new-product-image">
                    <img
                      src={URL.createObjectURL(current)}
                      style={{ width: "100px", height: "100px" }}
                      alt={current.name}
                      onClick={() => setImageSelected(current)}
                    />
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
            <div className="new-product-tag" key={index}>
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
              <input
                type="checkbox"
                value={onSale}
                onChange={(e) => setOnSale(e.target.checked)}
              />
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
              <input
                type="checkbox"
                value={bestSeller}
                onChange={(e) => setBestSeller(e.target.checked)}
              />
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
};

export default NewProductRoute;
