import express from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { entryIdValidator, idValidator } from '../middlewares/validator.js';

export const cartRoute = express.Router();

cartRoute.get('', CartController.getCart);
cartRoute.post('/:entry_id', entryIdValidator, CartController.addToCart);
cartRoute.delete('/:id', idValidator, CartController.deleteItem);