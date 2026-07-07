import express from 'express';
import { productRoute } from './product.route.js';
import { cartRoute } from './cart.route.js';
import { prodCategoryRoute } from './prodCategory.route.js';

export const appRouter = express.Router();

appRouter.use('/products', productRoute);
appRouter.use('/cart', cartRoute);
appRouter.use('/category', prodCategoryRoute);