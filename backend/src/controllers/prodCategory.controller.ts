import type { Request, Response } from "express";
import { ProdCategoryModel, type ProdCategory } from "../models/prodCategory.model.js";
import { validationResult } from "express-validator";

async function getAllCategories(_: Request, res: Response): Promise<void> {
    try {
        const result: ProdCategory[] = await ProdCategoryModel.getAllCategories();

        res.status(200).json({
            message: "Fetched all product categories successfully.",
            categoryCount: result.length,
            body: result
        })
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Could not fetch product categories, something went wrong in the server. Sorry!'});
    }
}

async function postCategory(req: Request, res: Response): Promise<void> {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({
                message: "Validation error occured.",
                errors: errors.array()
            })
            return
        }

        const result: ProdCategory = await ProdCategoryModel.createCategory(req.body.category!.toLowerCase());

        res.status(201).json({
            message: "Created product category successfully.",
            body: result
        })
    } catch(err: any) {
        if (err.message === "DUPLICATE__CATEGORY") {
            res.status(409).json({message: "Category already exists."});
            return;
        }
        console.error(err);
        res.status(500).json({message: 'Could not create product category, something went wrong in the server. Sorry!'});
    }
}

async function deleteCategory(req: Request, res: Response): Promise<void> {
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
        
        const result: ProdCategory | undefined = await ProdCategoryModel.deleteCategory(id);

        res.status(result ? 200 : 404).json({
            message: result ? 'Deleted product category successfully.' : 'Could not find product category with this id.',
            body: result
        })
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Could not delete product category, something went wrong in the server. Sorry!'});
    }
}

export const PordCategoryController = { getAllCategories, postCategory, deleteCategory }