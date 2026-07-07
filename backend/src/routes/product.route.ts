import express from "express"

export const productRoute = express.Router();

productRoute.get('', (req, res) => { 
    console.log(req.originalUrl, 'Products')
    res.json(req.body)
});