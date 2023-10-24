import "../../styleSheets/admin/AdminPanel.css";

import { useNavigate } from "react-router-dom";

import useProducts from "../../customHooks/useProducts";
import ProductItem from "../ProductItem";


const AdminPanel = () => {
  const navigate = useNavigate()
  const products = useProducts();

  const createProduct = () => {
    navigate("/admin/new_product")
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Panel de administrador</h2>
        <div>
          <p className="admin-create-product-button" onClick={createProduct}>crear producto</p>
        </div>
      </div>
      <div className="admin-panel-products-container">
        {products.map((current) => (
          <ProductItem productData={current} />
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
