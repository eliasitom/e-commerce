import "../styleSheets/PromotionItem.css"

import useScreenSize from "../customHooks/useScreenSize";
import ButtonComponent from "./ButtonComponent";

const PromotionItem = ({ img, title, description, right }) => {
  const { width } = useScreenSize();

  return (
    <div className="promotion-item">
      {width < 800 || !right ? (
        <img
          src={img}
          className="promotion-item-img"
        />
      ) : undefined}
      <div>
        <h2 className="promotion-item-title">{title}</h2>
        <p className="promotion-item-description">
          {description}
        </p>
        <ButtonComponent child={"show more"} margin={{top: "5px", right: "0", bottom: "0", left: width >= 800 ? "20px" : "0"}}/>
      </div>
      {width >= 800 && right ? (
        <img
          src="https://f.fcdn.app/imgs/0bdcf3/www.zonatecno.com.uy/zoteuy/a850/webp/catalogo/102486_102486_1/1920-1200/reloj-smartwatch-amazfit-gts-4-rosebud-pink-by-xiaomi-reloj-smartwatch-amazfit-gts-4-rosebud-pink-by-xiaomi.jpg"
          className="promotion-item-img"
        />
      ) : undefined}
    </div>
  );
};

export default PromotionItem;
