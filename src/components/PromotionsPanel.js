import "../styleSheets/PromotionsPanel.css";

import PromotionItem from "./PromotionIntem";

const PromotionsPanel = () => {
  return (
    <div className="promotions-container">
      <p className="promotions-title">ofertas</p>

      <PromotionItem
        img={require("../img/psd-kit-gamer-02_495x495+fill_ffffff+crop_center.png")}
        title={"Gamer Kit"}
        description={
          "KIT GAMER SPIDER TECLADO + MOUSE GAMER 2000DPI + HEADSET GAMER"
        }
        right={false}
      />

      <PromotionItem
        img={
          "https://f.fcdn.app/imgs/0bdcf3/www.zonatecno.com.uy/zoteuy/a850/webp/catalogo/102486_102486_1/1920-1200/reloj-smartwatch-amazfit-gts-4-rosebud-pink-by-xiaomi-reloj-smartwatch-amazfit-gts-4-rosebud-pink-by-xiaomi.jpg"
        }
        title={"Reloj SmartWatch"}
        description={"Reloj SmartWatch Amazfit GTS 4 Rosebud Pink (by XIAOMI)"}
        right={true}
      />

      <PromotionItem
        img={
          "https://f.fcdn.app/imgs/8f7eae/www.zonatecno.com.uy/zoteuy/e38b/webp/catalogo/100919_100919_1/800x800/parlante-portatil-jbl-flip-6-waterproof-bluetooth-rojo-parlante-portatil-jbl-flip-6-waterproof-bluetooth-rojo.jpg"
        }
        title={"Parlante JBL"}
        description={"Parlante portátil JBL Flip 6 Waterproof Bluetooth Rojo"}
        right={false}
      />
    </div>
  );
};

export default PromotionsPanel;
