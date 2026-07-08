import express from 'express';
import { CartController } from '../controllers/cart.controller.js';

export const cartRoute = express.Router();

cartRoute.get('', CartController.getCart);
cartRoute.post('/:entry_id', CartController.addToCart);
cartRoute.delete('/:id', CartController.deleteItem);