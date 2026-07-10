import { db } from "./db.js";

interface Product {
    id: number,
    prod_name: string,
    category_id: number | null,
    category: string | null,
    image_path: string | null,
    price: number
}

interface NewProduct {
    prod_name: string,
    category_id: number | null,
    image_path: string | null,
    price: number
}

async function getAllProducts(): Promise<Product[]> {
    try {
        const result = await db.query(`
            SELECT products.id, name AS prod_name, category_id, category, image_path, price 
            FROM products LEFT JOIN prod_category
            ON products.category_id = prod_category.id;
        `);

        return result.rows;
    } catch(err) {
        console.error('Error: can not load all products.');
        throw(err);
    }
}

async function getProductWithId(id: number): Promise<Product> {
    try {
        // @TODO: does the product exist?
        const result = await db.query(`
            SELECT products.id, name AS prod_name, category_id, category, image_path, price 
            FROM products LEFT JOIN prod_category
            ON products.category_id = prod_category.id
            WHERE products.id = $1;
        `, [id]);

        return result.rows[0];
    } catch(err) {
        console.error(`Error: can not load product with id ${id}:`);
        throw(err);
    }
}

async function createProduct(product: NewProduct): Promise<Product> {
    try {
        // @CHECK: what if the nullable fields are undefined or null?
        // @TODO: validate product catagory
        const result = await db.query(`
            WITH new_product AS (
                INSERT INTO products (name, image_path, price, category_id)
                SELECT 
                    $1, $2, $3,
                    -- category_id safely becomes null if the category doesn't exist
                    (SELECT id FROM prod_category WHERE id = $4)
                RETURNING *
            )
            SELECT 
                new_product.id, 
                new_product.name AS prod_name, 
                new_product.category_id, 
                prod_category.category, 
                new_product.image_path, 
                new_product.price 
            FROM new_product LEFT JOIN prod_category
            ON new_product.category_id = prod_category.id;
        `, [product.prod_name, product.image_path, product.price, product.category_id]);

        return result.rows[0];
    } catch(err) {
        console.error(`Error: could not create product:`, product);
        throw(err);
    }
}

async function deleteProduct(id: number): Promise<Product> {
    try {
        // @TODO: Delete the image stored also
        // @TODO: does the product exit? will pgsql handle it for me?
        const result = await db.query(`
            DELETE FROM products WHERE id = $1
            RETURNING *;
        `, [id]);
        
        return result.rows[0];
    } catch(err) {
        console.error(`Error: could not delete product id ${id}.`);
        throw(err);
    }
}

async function updateProduct(id: number, newProduct: NewProduct): Promise<Product> {
    try {
        // @TODO: add validation for cata_id, img, ...
        const result = await db.query(`
            WITH updated_product AS (
                UPDATE products SET 
                    name = $1, 
                    category_id = (SELECT id FROM prod_category WHERE id = $2), 
                    image_path = $3, 
                    price = $4  
                WHERE id = $5 
                RETURNING *
            )
            SELECT 
                updated_product.id, 
                updated_product.name AS prod_name, 
                updated_product.category_id, 
                prod_category.category, 
                updated_product.image_path, 
                updated_product.price 
            FROM updated_product LEFT JOIN prod_category
            ON updated_product.category_id = prod_category.id;
        `, [ newProduct.prod_name, newProduct.category_id, newProduct.image_path, newProduct.price, id ]);

        return result.rows[0];
    } catch(err) {
        console.error(`Error: could not edit product id ${id} name to ${newProduct.prod_name}.`);
        throw(err);
    }
}

// export { getAllProducts, getProductWithId, createProduct, deleteProduct, updateProduct };
export type { Product, NewProduct };
export const ProductModel =  { getAllProducts, getProductWithId, createProduct, deleteProduct, updateProduct }