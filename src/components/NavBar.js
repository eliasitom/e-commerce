import { useState } from "react";
import "../styleSheets/NavBar.css";

import { BiSolidLeftArrow } from "react-icons/bi";

const NavBar = ({ close }) => {
  const [enabled, setEnabled] = useState(true);

  const handleClose = () => {
    setEnabled(false);

    setTimeout(() => {
      close();
    }, 500);
  };

  return (
    <div className={`nav-bar ${enabled ? "enabled" : "disabled"}`}>
      {close ? <BiSolidLeftArrow onClick={handleClose} /> : undefined}

      <div className="nav-bar-fast-browser">
        <a>notebooks y PC's</a>
        <a>teclados</a>
        <a>mouse</a>
        <a>audio</a>
        <a>software</a>
        <a>otros productos</a>
      </div>
    </div>
  );
};

export default NavBar;
