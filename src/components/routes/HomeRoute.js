import { useState } from "react";
import "../../styleSheets/routes/HomeRoute.css";

import Browser from "./components/Browser"
import NavBar from "./components/NavBar"
import PromotionsPanel from "./components/PromotionsPanel"
import TopProduct from "./components/TopProduct"

import { HiBars3 } from "react-icons/hi2"

function HomeRoute() {
  const [navEnabled, setNavEnabled] = useState(false)

  return (
    <div className="App">
      <div className="nav-svg" onClick={() => setNavEnabled(true)}>
          <HiBars3 />
        </div>
      {navEnabled ? <NavBar close={() => setNavEnabled(false)}/> : undefined}
      <div>
        <Browser />
        <hr />
        <div className="top-products">
          <p className="top-products-title">lo más vendido</p>
          <div className="top-products-container">
            <TopProduct
              title={"Notebook Lenovo 15ITL05"}
              description={
                "Notebook Lenovo 15ITL05 i3-1115G4 256GB 8GB 15.6 Touch"
              }
              img={"OIP.jpg"}
              price={589}
            />
            <TopProduct
              title={"Monitor Gamer MSI Optix"}
              description={'Monitor Gamer MSI Optix G273 27" FHD 165Hz G-Sync'}
              img={"monitor0.jpg"}
              price={359}
            />
            <TopProduct
              title={"Torre Gamer Intel Core i5"}
              description={
                "Torre Gamer Intel Core i5-10400 512GB 16GB GTX1630 Win 11"
              }
              img={"PC.jpg"}
              price={1049}
            />
          </div>
        </div>
        <hr />
        <PromotionsPanel />
        <hr />
      </div>
    </div>
  );
}

export default HomeRoute;
