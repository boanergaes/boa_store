import express from "express"
import { ProductController } from "../controllers/product.controller.js";

export const productRoute = express.Router();

productRoute.get('', ProductController.getAllProducts);
productRoute.get('/:id', ProductController.getProduct);
productRoute.post('', ProductController.postProduct);
productRoute.delete('/:id', ProductController.deleteProduct);
productRoute.put('/:id', ProductController.putProduct);