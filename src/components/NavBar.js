import { useState } from "react";
import "../styleSheets/NavBar.css";

import { BiSolidLeftArrow } from "react-icons/bi";
import useCategories from "../customHooks/useCategories";

const NavBar = () => {
  const categories = useCategories()


  return (
    <div className="nav-bar">
      <h3>Barra de navegación</h3>
      <ul className="nav-bar-fast-browser">
        <h4>Categorias</h4>
        {
          categories.map((current, index) => (
            <li key={index}>{current.name}</li>
          ))
        }
      </ul>
    </div>
  );
};

export default NavBar;
