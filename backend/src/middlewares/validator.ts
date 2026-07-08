import { body, param } from "express-validator";

export const idValidator = param('id')
    .isInt()
    .withMessage('Id parameter should be integer.')
    .notEmpty()
    .withMessage('Id paramenter must be given.');
        


export const productValidator = [
    body('prod_name')
        .notEmpty()
        .withMessage('Must provide a product name.'),
    
    body('category_id').default(null),

    body('image_path').default(null),

    body('price')
        .default(0)
]

export const prodCategoryValidator = body('category')
    .notEmpty()
    .withMessage('Must provide category name.');