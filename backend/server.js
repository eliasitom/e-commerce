const express = require("express");
const app = express();
const PORT = 8000;
const bodyParser = require("body-parser");

require("./database");
const ProductSchema = require("./models/ProductModel");
const AdminSchema = require("./models/AdminModel");

const cors = require("cors");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = "";
    if (req.originalUrl === "/api/send_category") {
      path = "uploads/categories";
    } else {
      path = "uploads/";
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop(); //Esto guarda la extensión del archivo
    const filename = file.originalname.replace(/\.[^/.]+$/, ""); //Esto elimina la extensión del archivo
    cb(null, filename + "-" + Date.now() + "." + extension); //Esto cambia el nombre del archivo (nombreOriginal + fechaActual + extensión)
  },
});
const fs = require("fs");

//Middleware

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

//Esto es para aumentar el tamaño máximo de una solicitud de 100kb a 10mb
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const upload = multer({ storage: storage });

//Endpoints

// crear categoria
app.post("/api/send_category", upload.single("image"), async (req, res) => {
  try {
    let categoryDataJSON = req.body.data;
    const categoryData = JSON.parse(categoryDataJSON);

    //obtener el nombre de la imagen y luego crear la URL
    const filename = req.file.filename;
    const filePath = `http://localhost:8000/categories/${filename}`;

    //Establecer los filtros correctamente
    const newSorters = categoryData.sorters.map((current) => {
      return { sorterName: current, sorterValues: [] };
    });

    //Crear el objeto que se guardará en el documento de mongoose
    const newCategoryData = {
      name: categoryData.name,
      sorters: newSorters,
      image: filePath,
    };

    //Actualizar el documento Admin
    const admin = await AdminSchema.updateOne(
      {},
      { $push: { categories: newCategoryData } }
    );

    res.status(200).json({ message: "request received" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error has ocurred" });
  }
});

// Obtener categorias
app.get("/api/get_categories", async (req, res) => {
  try {
    const admin = await AdminSchema.findOne({});
    res.status(200).json({ categories: admin.categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error has ocurred" });
  }
});

//Obtener una unica categoria
app.get("/api/get_category/:category_name", async (req, res) => {
  try {
    const admin = await AdminSchema.findOne({});
    const category = admin.categories.filter(
      (current) => current.name == req.params.category_name
    );
    res.status(200).json({ category: category[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error has ocurred" });
  }
});

// Agregar un filtro a una categoria
app.post("/api/create_category_filter", async (req, res) => {
  try {
    const { categoryName, sorterName } = req.body;

    await AdminSchema.updateOne(
      {},
      {
        $push: {
          "categories.$[category].sorters": {
            sorterName: sorterName,
            sorterValues: [],
          },
        },
      },
      {
        arrayFilters: [{ "category.name": categoryName }],
        new: true,
      }
    );
    res.status(200).json({ message: "request received" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error has ocurred" });
  }
});

// Eliminar un filtro a una categoria
app.post("/api/remove_category_filter", async (req, res) => {
  try {
    const { categoryName, sorterName_ } = req.body;

    // Eliminar el filtro de la 
    const admin = await AdminSchema.findOneAndUpdate(
      {},
      {
        $pull: {
          "categories.$[category].sorters": {sorterName: sorterName_},
        },
      },
      {
        arrayFilters: [{ "category.name": categoryName }],
        new: true,
      }
    );

    // Eliminar el filtro de los productos que tengan esta categoria
    await ProductSchema.updateMany(
      {"categories.categoryName": categoryName},
      {$pull: {"categories.$.selectedValues": {sorterName: sorterName_}}}
    )
    
    const categoryData = admin.categories.find(elem => elem.name === categoryName)
    res.status(200).json({ message: "request received", categoryData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error has ocurred" });
  }
});


// Agregar un valor a un filtro de una categoria
app.post("/api/create_category_filter_value", async (req, res) => {
  const { categoryName, sorterName, newValue } = req.body;
  try {
    const admin = await AdminSchema.findOneAndUpdate(
      // Unico esquema de admin
      {},
      //Usar ArrayFilters de mongoose para acceder a un valor especifico en un sorter especifico dentro de una categoria especifica
      {
        $push: {
          "categories.$[category].sorters.$[sorter].sorterValues": newValue,
        },
      },
      //Estos son los filtros aplicados:
      {
        arrayFilters: [
          { "category.name": categoryName }, // Obtener la categoria que cumpla con category.name === categoryName
          { "sorter.sorterName": sorterName }, // Obtener el sorter que cumpla con sorter.sorterName = sorterName
        ],
        new: true, //Retornar el nuevo valor
      }
    );
    const categoryData = admin.categories.find(elem => elem.name === categoryName)

    res.status(200).json({ message: "request received", categoryData});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error has ocurred" });
  }
});

// Eliminar un valor de un filtro especifico
app.post("/api/remove_category_filter_value", async (req, res) => {
  const { categoryName, sorterName, sorterValue } = req.body;
  try {
    const admin = await AdminSchema.findOneAndUpdate(
      // Unico esquema de admin
      {},
      //Usar ArrayFilters de mongoose para acceder a un valor especifico en un sorter especifico dentro de una categoria especifica
      {
        $pull: {
          "categories.$[category].sorters.$[sorter].sorterValues": sorterValue,
        },
      },
      {
        //Estos son los filtros aplicados:
        arrayFilters: [
          { "category.name": categoryName }, // Obtener la categoria que cumpla con category.name === categoryName
          { "sorter.sorterName": sorterName }, // Obtener el sorter que cumpla con sorter.sorterName = sorterName
        ],
        new: true, //Retornar el nuevo valor
      }
    );

    // Eliminar el valor del filtro de los productos que tengan esta categoria
    await ProductSchema.updateMany(
      {"categories.categoryName": categoryName},
      {$pull: {"categories.$.selectedValues": {sorterName: sorterName}}}
    )

    const categoryData = admin.categories.find(elem => elem.name === categoryName)

    res.status(200).json({ message: "request received", categoryData });
  } catch (error) {
    console.log(error);
  }
});

// Crear producto
app.post("/api/create_product", upload.array("images"), async (req, res) => {
  try {
    let productDataJSON = req.body.productData;
    const productData = JSON.parse(productDataJSON);

    //Obtener los nombres de las nuevas imagenes para guardarlas en el documento
    const filenames = req.files.map((file) => file.filename);
    //Crear URLs para las imagenes
    productData.images = filenames.map(
      (current) => `http://localhost:8000/${current}`
    );

    const newProduct = await ProductSchema(productData);
    await newProduct.save();

    res.status(200).json({ message: "request received" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error has ocurred" });
  }
});

// Actualizar producto
app.post("/api/update_product", upload.array("newImages"), async (req, res) => {
  try {
    let productDataJSON = req.body.productData;
    let productData = JSON.parse(productDataJSON);

    let deletedImages = req.body.deletedImages;

    const productDoc = await ProductSchema.findOne({ _id: productData._id });

    //Si hay imagenes eliminadas, quitarlas de la carpeta uploads y del documento
    if (deletedImages) {
      //Quitarlas de la carpeta uploads
      // Esto comprueba si las imagenes eliminadas son mas de una
      if (Array.isArray(deletedImages)) {
        for (let i = 0; i < deletedImages.length; i++) {
          const imageToDelete = deletedImages[i].split("/").pop();
          fs.unlinkSync("uploads/" + imageToDelete);
        }
      } else {
        fs.unlinkSync("uploads/" + deletedImages.split("/").pop());
      }

      //Quitarlas del documento
      // Esto comprueba si las imagenes eliminadas son mas de una
      if (Array.isArray(deletedImages)) {
        let filterImages = productDoc.images;
        for (let i = 0; i < deletedImages.length; i++) {
          filterImages = filterImages.filter(
            (current) => current !== deletedImages[i]
          );
        }
        productDoc.images = filterImages;
      } else {
        productDoc.images = productDoc.images.filter(
          (current) => current !== deletedImages
        );
      }
    }
    //Agregar las nuevas imagenes al documento
    const filenames = req.files.map((file) => file.filename);
    const newImagesURL = filenames.map(
      (current) => `http://localhost:8000/${current}`
    );
    productDoc.images = productDoc.images.concat(newImagesURL);

    //Guardar los nuevos datos en el documento (nombre, precio, en oferta, etc...)
    productDoc.name = productData.name;
    productDoc.description = productData.description;
    productDoc.price = productData.price;
    productDoc.tags = productData.tags;
    productDoc.characteristics = productData.characteristics;
    productDoc.onSale = productData.onSale;
    productDoc.bestSeller = productData.bestSeller;
    productDoc.categories = productData.categories;

    productDoc.save();

    res.status(200).json({ message: "request received" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error has ocurred" });
  }
});

// Obtener productos
app.get("/api/get_products", async (req, res) => {
  try {
    let products;
    if (req.query.sorter == "none" && req.query.sorter_value == "none") {
      products = await ProductSchema.find({});
    } else if (req.query.sorter == "categories") {
      const sorter = req.query.sorter;
      const sorterValue = req.query.sorter_value;

      let query = {};
      query[sorter] = { $elemMatch: { categoryName: sorterValue } };
      products = await ProductSchema.find(query);
    }
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error has ocurred" });
  }
});

// Obtener producto
app.get("/api/get_product/:id", async (req, res) => {
  try {
    const product = await ProductSchema.findOne({ _id: req.params.id });
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error has ocurred" });
  }
});

// Obtener productos mediante tags
app.post("/api/get_products_by_tags", async (req, res) => {
  const tags = req.body.productTags;
  try {
    const products = await ProductSchema.find({ tags: { $in: tags } });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error has ocurred" });
  }
});

// Obtener productos en oferta
app.get("/api/get_products_on_sale", async (req, res) => {
  try {
    const products = await ProductSchema.find({ onSale: true });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error has ocurred" });
  }
});

// Obtener productos más vendidos
app.get("/api/get_best_seller_products", async (req, res) => {
  try {
    const products = await ProductSchema.find({ bestSeller: true });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error has ocurred" });
  }
});

app.listen(PORT, () => {
  console.log(`server on port ${PORT}...`);
});
