import express from "express"
import { ProductController } from "../controllers/product.controller.js";
import { idValidator, productValidator } from "../middlewares/validator.js";

export const productRoute = express.Router();

productRoute.get('', ProductController.getAllProducts);
productRoute.get('/:id', idValidator, ProductController.getProduct);
productRoute.post('', productValidator, ProductController.postProduct);
productRoute.delete('/:id', idValidator, ProductController.deleteProduct);
productRoute.put('/:id', idValidator, productValidator, ProductController.putProduct);