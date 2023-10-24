import "../../styleSheets/admin/NewProductPanel.css";

import { useState } from "react";

import ButtonComponent from "../ButtonComponent";

const NewProductPanel = ({ closeModal }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState(1);

  const [currentTag, setCurrentTag] = useState("");
  const [productTags, setProductTags] = useState([]);

  const [characteristic, setCharacteristic] = useState("");
  const [characteristicValue, setCharacteristicValue] = useState("");
  const [productCharacteristics, setProductCharacteristics] = useState([]);

  const [productImages, setProductImages] = useState([]);

  const createProduct = () => {
    if (productName && productDescription && productPrice) {
      const productData = {
        name: productName,
        description: productDescription,
        price: productPrice,
        tags: productTags,
        characteristics: productCharacteristics,
      };

      let formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      productImages.forEach((image) => {
        formData.append("images", image);
      });

      fetch("http://localhost:8000/api/create_product", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  };

  // tags

  const submitTag = (e) => {
    e.preventDefault();

    if (currentTag) {
      setProductTags((prev) => [...prev, currentTag]);
      setCurrentTag("");
    }
  };
  const removeTag = (tag) => {
    const newProductTags = productTags.filter((current) => current !== tag);

    setProductTags(newProductTags);
  };

  // characteristics

  const submitCharacteristic = (e) => {
    e.preventDefault();

    if (characteristic && characteristicValue) {
      setProductCharacteristics((prev) => [
        ...prev,
        { characteristic, value: characteristicValue },
      ]);
      setCharacteristic("");
      setCharacteristicValue("");
    }
  };
  const removeCharacteristic = (characteristic) => {
    const newCharacteristic = productCharacteristics.filter(
      (current) => current.characteristic !== characteristic.characteristic
    );
    setProductCharacteristics(newCharacteristic);
  };

  // images
  const submitImage = (image) => {
    setProductImages((prev) => [...prev, image]);
  };
  const removeImage = (image) => {
    const newImages = productImages.filter((current) => current !== image);
    setProductImages(newImages);
  };

  return (
    <div className="new-product-panel-background">
      <div className="new-product-panel">
        <p className="new-product-title">Crear nuevo producto:</p>
        <form className="new-product-general-data">
          <p className="new-product-subtitle">Descripción general</p>
          <label>
            nombre del producto
            <input
              placeholder="iphone 14"
              className="new-product-name"
              onChange={(e) => setProductName(e.target.value)}
              value={productName}
            />
          </label>
          <label>
            descripción del producto
            <input
              placeholder="uno de los celulares más nuevos, con un procesador A13 Bionic..."
              className="new-product-description"
              onChange={(e) => setProductDescription(e.target.value)}
              value={productDescription}
            />
          </label>
          <label>
            precio del producto
            <input
              placeholder="USD 499"
              className="new-product-price"
              type="number"
              min={1}
              onChange={(e) => setProductPrice(e.target.value)}
              value={productPrice}
            />
          </label>
        </form>
        <form className="new-product-tags-form">
          <p className="new-product-subtitle">Etiquetas</p>
          <div style={{ display: "flex" }}>
            <input
              placeholder="celulares, iphone, apple..."
              maxLength={18}
              onChange={(e) => setCurrentTag(e.target.value)}
              value={currentTag}
            />
            <button onClick={submitTag} className="new-product-button">
              añadir
            </button>
          </div>
          <div className="new-product-tags-container">
            {productTags.map((current) => (
              <div className="new-product-tag">
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
        </form>
        <form className="new-product-characteristics">
          <p className="new-product-subtitle">Características del producto</p>
          <div
            style={{ display: "flex" }}
            className="new-product-characteristic-form"
          >
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
              {productCharacteristics.map((current, index) => (
                <p key={index}>{current.characteristic}</p>
              ))}
            </div>
            <div className="new-product-characteristic-value">
              {productCharacteristics.map((current, index) => (
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
          <div>
            <p className="new-product-subtitle">Imagenes</p>
            <input
              type="file"
              onChange={(e) => submitImage(e.target.files[0])}
            />
            <div className="new-product-images">
              {productImages.length > 0
                ? productImages.map((current) => (
                    <div className="new-product-image">
                      <img
                        src={URL.createObjectURL(current)}
                        style={{ width: "100px", height: "100px" }}
                      />
                      <button
                        className="remove-characteristic-button"
                        onClick={() => removeImage(current)}
                      >
                        ×
                      </button>
                    </div>
                  ))
                : undefined}
            </div>
          </div>
        </form>
        <ButtonComponent
          child={"cancelar"}
          margin={{ top: "40px", right: "15px", bottom: "0", left: "0" }}
          onClick={closeModal}
        />
        <ButtonComponent
          child={"crear nuevo producto"}
          margin={{ top: "40px", right: "0", bottom: "0", left: "0" }}
          onClick={(e) => {
            createProduct()
            closeModal()
          }}
        />
      </div>
    </div>
  );
};

export default NewProductPanel;
