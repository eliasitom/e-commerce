import { useEffect, useState } from "react";
import "../styleSheets/SortersModal.css";

import { TbPoint, TbPointFilled } from "react-icons/tb";


const SorterModal = ({
  categoryData,
  currentCategories,
  closeModal,
  saveCategory
}) => {
  //Este estado representa los valores que tienen los ditintos inputs de los sorters
  const [newSorterValues, setNewSorterValues] = useState(); 
  
  //Este estado representa un array de todos los valores agregados para los distintos sorters, y se renderiza junto a los valores previos del sorter
  const [addedValues, setAddedValues] = useState([])

  //Este estado representa los valores seleccionados
  const [selectedValues, setSelectedValues] = useState([])

  //Este estado se usa para verificar si la categoria está activa o no, si esta activa muestra un boton para desactivarla y viceversa
  const [active, setActive] = useState();




  //Guardas los cambios (los cambios solo incluyen: los valores seleccionados para los distintos sorters)
  const saveCategorySettings = () => {
    saveCategory({categoryName: categoryData.name, active, selectedValues})
  }

  // Hacer el fetching de datos. Enviar el nuevo sorterValue a la API 
  const createSorterValue = (sorterName) => {
    //Este bucle obtiene el nuevo valor para un sorter especifico, el sorter se obtiene mediante el parametro sorterName
    let newValue = ""
    for (let i = 0; i < newSorterValues.length; i++) {
      if(newSorterValues[i].sorterName === sorterName && newSorterValues[i].newValue) {
        newValue = newSorterValues[i].newValue
      }
    }
    if(newValue) {
      //Esto agrega el nuevo valor del sorter al estado addedValues para que se renderice junto a los valores previos del sorter
      setAddedValues(prev => [...prev, {sorterName, newValue}])

      const requestBody = {
        categoryName: categoryData.name,
        sorterName,
        newValue,
      };
      try {
        fetch("http://localhost:8000/api/create_category_filter_value", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("El campo que deseas agregar está vacío")
    } 
  };



  //Establecer newSorterValues a un array de objetos con un length igual a categoryData.sorters.length
  //Cada objeto debe tener dos propiedades: { sorterName, newValue }
  //newValue se cambia mediante una funcion handleNewValue
    useEffect(() => {
    const newSorterValues_ = categoryData.sorters.map(current => {
      return {sorterName: current.sorterName, newValue: ""}
    })
    setNewSorterValues(newSorterValues_)
  }, [])

  const handleNewValue = (sorterData, newSorterValue) => {
    const newSorterValues_ = newSorterValues.map(current => {
      if(current.sorterName === sorterData.sorterName) {
        current.newValue = newSorterValue
      }
      return current
    })
    setNewSorterValues(newSorterValues_)
  }

  const handleSelectedValue = (sorterName, sorterValue) => {
    //Esta funcion gestiona los valores seleccionados, al seleccionar un valor haciendo click, se ejecuta esta funcion que
    //agrega el valor al estado selectedValues o lo elimina, dependiendo de si está incluido en el estado o no

    if(selectedValues.filter(e => e.sorterValue === sorterValue).length > 0) {
      const newSelectedValues = selectedValues.filter(e => e.sorterValue !== sorterValue)
      setSelectedValues(newSelectedValues)
    } else {
      setSelectedValues(prev => [...prev, {sorterName, sorterValue}])
    }
  }



  useEffect(() => {
    // Consultar si está categoria forma parte del producto
    // (En el caso de formar parte establecer "active" en true para renderizar el boton correspondiente)
    if (currentCategories.filter(current => current.categoryName === categoryData.name).length > 0) {
      setActive(true);
    } else {
      setActive(false);
    }    
  }, [currentCategories]);

  useEffect(()=> {
  //Obtener valores seleccionados previamente para cada sorter
      currentCategories.map(current => {
      if(current.categoryName === categoryData.name) {
        setSelectedValues(current.selectedValues)
      }
    })
  }, [])

  return (
    <div className="sorter-modal-background" onClick={() => closeModal()}>
      <main className="sorter-modal-main" onClick={(e) => e.stopPropagation()}>
        <section>
          <img src={categoryData.image} />
          <div>
          <h2>{categoryData.name}</h2>
          {active ? (
                      <button
                        className="category-switch-button"
                        onClick={() => setActive(false)}
                      >
                        quitar categoria
                      </button>
                    ) : (
                      <button
                        className="category-switch-button"
                        onClick={() => setActive(true)}
                      >
                        agregar categoria
                      </button>
                    )}

                    <div className="category-save-or-cancel-form">
                      <button onClick={() => closeModal()}>cancelar</button>
                      <button onClick={() => saveCategorySettings()}>guardar</button>
                    </div>
          </div>
        </section>
        <section>
          <p className="sorter-modal-sorters-title">Filtros actuales</p>
          <div>
            {categoryData.sorters.map((current, index) => (
              <div key={index} className="sorter-modal-sorters-container">
                <p className="sorter-name">{current.sorterName}</p>
                <div className="sorter-values-container">
                  {current.sorterValues.map((current_, index_) => (
                    <p key={index_} className="sorter-value" onClick={() => handleSelectedValue(current.sorterName, current_)}>
                      {
                        //Esto comprueba si el valor está seleccionado o no
                        selectedValues.filter(e => e.sorterValue === current_).length > 0 ?
                         <TbPointFilled /> :
                         <TbPoint />
                      }
                      {current_}
                    </p>
                  ))}
                  {
                    addedValues.length > 0 ?
                    addedValues.map((current_, index_) => (
                      <div key={index_}>
                      {
                        current_.sorterName === current.sorterName ?
                        <p className="sorter-value" onClick={() => handleSelectedValue(current_.sorterName, current_.newValue)}>
                        {
                          //Esto comprueba si el valor está seleccionado o no
                        selectedValues.filter(e => e.sorterValue === current_).length > 0 ?
                         <TbPointFilled /> :
                         <TbPoint />
                      }
                        {current_.newValue}
                      </p>
                      : undefined
                      }
                      </div>
                    ))
                    : undefined
                  }
                  <form  
                    onSubmit={(e) => {
                      e.preventDefault();
                      createSorterValue(current.sorterName);
                    }}
                  >
                    <input
                      placeholder="valor del filtro..."
                      onChange={(e) => handleNewValue(current, e.target.value)}
                    />
                    <button className="sorter-form-button">agregar</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SorterModal;
