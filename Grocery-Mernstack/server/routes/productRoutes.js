const express = require("express");
const productRouter = express.Router();
const upload = require("../configs/multer");
const authSeller = require("../middlewares/authSeller");
const { addProduct, productList, productById, changeStock } = require("../controllers/productController");

productRouter.post("/add",upload.array("images",4),authSeller,addProduct);
productRouter.get('/list',productList)
productRouter.get("/id",productById)
productRouter.post("/stock",authSeller,changeStock)

module.exports = productRouter