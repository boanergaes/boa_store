import type { Request, Response } from 'express';
import type { Product, NewProduct } from '../models/product.model.js';
import { ProductModel } from '../models/product.model.js';
import { validationResult } from 'express-validator';

async function getAllProducts(_: Request, res: Response): Promise<void> {
    try {
        const result: Product[] = await ProductModel.getAllProducts();

        res.status(200).json({
            message: 'Fetched All products successfully.',
            prodCount: result.length,   
            body: result
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Could not fetch products, something went wrong in the server. Sorry!'});
    }
}

async function getProduct(req: Request, res: Response) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({
                message: "Validation error occured.",
                errors: errors.array()
            });
            return;
        }

        const id = Number(req.params.id);

        const result: Product | undefined = await ProductModel.getProductWithId(id);

        res.status(result ? 200 : 404).json({
            message: result ? 'Fetched product successfully.' : 'Could not find product with this id.',
            body: result
        })
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Could not fetch product, something went wrong in the server. Sorry!'});
    }
}

async function postProduct(req: Request, res: Response): Promise<void> {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({
                message: "Validation error occured.",
                errors: errors.array()
            });
            return;
        }

        const incoming = req.body;
        const toCreate: NewProduct = {
            prod_name: incoming.prod_name,
            category_id: incoming.category_id ?? null,
            image_path: incoming.image_path ?? null,
            price: incoming.price
        }

        const result: Product = await ProductModel.createProduct(toCreate);

        res.status(201).json({
            message: 'Created product successfully.',
            body: result
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Could not add product, something went wrong in the server. Sorry!'});
    }
}

async function deleteProduct(req: Request, res: Response) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({
                message: "Validation error occured.",
                errors: errors.array()
            });
            return;
        }

        const id = Number(req.params.id);

        const result: Product | undefined = await ProductModel.deleteProduct(id);

        res.status(result ? 200 : 404).json({
            message: result ? 'Deleted product successfully' : 'Could not find product with this id.',
            body: result
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Could not delete, something went wrong in the server. Sorry!'});
    }
}

async function putProduct(req: Request, res: Response) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({
                message: "Validation error occured.",
                errors: errors.array()
            });
            return;
        }

        const id = Number(req.params.id);
        const incoming = req.body;
        const newProduct: NewProduct = {
            prod_name: incoming.prod_name,
            category_id: incoming.category_id ?? null,
            image_path: incoming.image_path ?? null,
            price: incoming.price ?? 0.00
        }

        const result: Product | undefined = await ProductModel.updateProduct(id, newProduct);

        res.status(result ? 200 : 404).json({
            message: result ? 'Updated product successfully.' : 'Could not find a product with this id.',
            body: result
        })
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Could not edit product, something went wrong in the server. Sorry!'});
    }
}

export const ProductController = { getAllProducts, getProduct, postProduct, deleteProduct, putProduct }