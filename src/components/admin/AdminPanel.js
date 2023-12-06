import "../../styleSheets/admin/AdminPanel.css";

import { useNavigate } from "react-router-dom";

import useProducts from "../../customHooks/useProducts";
import ProductItem from "../ProductItem";
import CategoriesForm from "../CategoriesForm";
import useCategories from "../../customHooks/useCategories";
import Category from "../Category";

const AdminPanel = () => {
  const navigate = useNavigate();
  const products = useProducts("none", "none");
  const categories = useCategories();

  const createProduct = () => {
    navigate("/admin/new_product");
  };

  const editProduct = (productId) => {
    navigate(`/admin/edit_product/${productId}`);
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Panel de administrador</h2>
        <div>
          <p className="admin-create-product-button" onClick={createProduct}>
            crear producto
          </p>
        </div>
      </div>
      <div className="admin-panel-categories-main">
        <h2>Categorias</h2>
        <div className="admin-panel-categories">
          <CategoriesForm />
          <div className="admin-panel-categories-container">
            { categories.length > 0 ?
              categories.map((current, index) => (
                <Category 
                key={index} 
                name={current.name} 
                image={current.image}
                onClick={() => navigate(`/admin/edit_category/${current.name}`)}
                />
              )) : undefined
            }
          </div>
        </div>
      </div>
      <div className="admin-panel-products-container">
        {products.length > 0 ? 
        products.map((current, index) => (
          <ProductItem
            key={index}
            productData={current}
            onClick={() => editProduct(current._id)}
          />
        )) : undefined
        }
      </div>
    </div>
  );
};

export default AdminPanel;
