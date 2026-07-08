import express from 'express';
import { PordCategoryController } from '../controllers/prodCategory.controller.js';

export const prodCategoryRoute = express.Router();

prodCategoryRoute.get('', PordCategoryController.getAllCategories);
prodCategoryRoute.post('', PordCategoryController.postCategory);
prodCategoryRoute.delete('/:id', PordCategoryController.deleteCategory);