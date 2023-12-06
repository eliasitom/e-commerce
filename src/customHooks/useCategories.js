import { useEffect, useState } from "react";

const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/get_categories", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => setCategories(res.categories))
      .catch(err => console.log(err))
  }, []);

  return categories;
};

export default useCategories;
