import type { Request, Response } from "express";
import { CartModel, type CartEntry } from "../models/cart.model.js";
import { validationResult } from "express-validator";

async function getCart(_: Request, res: Response): Promise<void> {
    try {
        const result: CartEntry[] = await CartModel.getCart();

        res.status(200).json({
            message: "Fetched cart successfully.",
            cartCount: result.length,
            body: result
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Could not fetch cart, something went wrong in the server. Sorry!'});
    }
}

async function addToCart(req: Request, res: Response): Promise<void> {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            res.status(400).json({
                message: "Validation error occured.",
                errors: errors.array()
            })
            return
        }

        const entry_id = Number(req.params.entry_id);

        const result: CartEntry | undefined = await CartModel.addItemToCart(entry_id);

        res.status(result ? 200 : 404).json({
            message: result ? "Successfully added product to cart." : "A product with this entry id does not exit.",
            body: result
        });
    } catch(err: any) {
        if (err.message === 'DUPLICATE_ENTRY_ID') {
            res.status(409).json({message: 'Product already exists in cart.'});
            return;
        }
        console.error(err);
        res.status(500).json({message: 'Could not add product to cart, something went wrong in the server. Sorry!'});
    }
}

async function deleteItem(req: Request, res: Response) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({
                message: "Validation error occured.",
                errors: errors.array()
            })
            return
        }
        
        const id = Number(req.params.id);

        const result: {id: number, entry_id: number} | undefined = await CartModel.deleteCartItem(id);

        res.status(result ? 200 : 404).json({
            message: result ? 'Successfully deleted cart item.' : 'Could not find cart entry with this id',
            body: result
        })
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Could not delete product from cart, something went wrong in the server. Sorry!'});
    }
}

export const CartController = { getCart, addToCart, deleteItem }