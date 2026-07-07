import express from 'express';

export const cartRoute = express.Router();

cartRoute.get('', (req, res) => {
    console.log(req.originalUrl, 'Cart')
    res.json(req.body)
});