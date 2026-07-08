import express from 'express';
import { PordCategoryController } from '../controllers/prodCategory.controller.js';
import { idValidator, prodCategoryValidator } from '../middlewares/validator.js';

export const prodCategoryRoute = express.Router();

prodCategoryRoute.get('', PordCategoryController.getAllCategories);
prodCategoryRoute.post('', prodCategoryValidator, PordCategoryController.postCategory);
prodCategoryRoute.delete('/:id', idValidator, PordCategoryController.deleteCategory);