import express from 'express';

export const prodCategoryRoute = express.Router();

prodCategoryRoute.get('', (req, res) => {
    console.log(req.originalUrl, 'Product Category')
    res.json(req.body)
});