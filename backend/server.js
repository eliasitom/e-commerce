const express = require("express");
const app = express();
const PORT = 8000;

require("./database");
const ProductSchema = require("./models/ProductModel");

const cors = require("cors");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop()  //Esto guarda la extensión del archivo
    const filename = file.originalname.replace(/\.[^/.]+$/, "") //Esto elimina la extensión del archivo
    cb(null, filename + "-" + Date.now() + "." + extension); //Esto cambia el nombre del archivo (nombreOriginal + fechaActual + extensión)
  },
});

//Middleware

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: storage });

//Endpoints


// Crear producto
app.post("/api/create_product", upload.array("images"), async (req, res) => {
  try {
    const filenames = req.files.map((file) => file.filename);

    let productDataJSON = req.body.productData;

    const productData = JSON.parse(productDataJSON);
    productData.images = filenames.map(current => `http://localhost:8000/${current}`);

    const newProduct = await ProductSchema(productData);
    await newProduct.save();

    res.status(200).json({ message: "request received" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error has ocurred" });
  }
});

// Obtener productos
app.get("/api/get_products", async (req, res) => {
    try {
        const products = await ProductSchema.find({})
        res.status(200).json(products)
    } catch (error) {
        console.log(error)
        res.status(500).json("internal error has ocurred")
    }
})

// Obtener producto
app.get("/api/get_product/:id", async (req, res) => {
  try {
      const product = await ProductSchema.findOne({_id: req.params.id})
      res.status(200).json(product)
  } catch (error) {
      console.log(error)
      res.status(500).json("internal error has ocurred")
  }
})

// Obtener productos mediante tags 
app.post("/api/get_products_by_tags", async (req, res) => {
  const tags = req.body.productTags
  try {
      const products = await ProductSchema.find({ tags: { $in: tags } })
      res.status(200).json(products)
  } catch (error) {
      console.log(error)
      res.status(500).json("internal error has ocurred")
  }
})




app.listen(PORT, () => {
  console.log(`server on port ${PORT}...`);
});
