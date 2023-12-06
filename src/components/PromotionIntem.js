import "../styleSheets/PromotionItem.css";

import { useNavigate } from "react-router-dom";

import useScreenSize from "../customHooks/useScreenSize";
import ButtonComponent from "./ButtonComponent";

const PromotionItem = ({ productId, img, name, description, right }) => {
  const navigate = useNavigate();

  const { width } = useScreenSize();

  return (
    <div className="promotion-item">
      {width < 800 || !right ? (
        <img src={img} className="promotion-item-img" />
      ) : undefined}
      <div>
        <h2 className="promotion-item-title">{name}</h2>
        <p className="promotion-item-description">{description}</p>
        <ButtonComponent
          onClick={() => navigate(`/product/${productId}`)}
          child={"ver más"}
          margin={{
            top: "5px",
            right: "0",
            bottom: "0",
            left: width >= 800 ? "20px" : "0",
          }}
        />
      </div>
      {width >= 800 && right ? (
        <img src={img} className="promotion-item-img" />
      ) : undefined}
    </div>
  );
};

export default PromotionItem;
