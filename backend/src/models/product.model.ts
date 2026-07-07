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
    category: string | null,
    image_path: string | null,
    price: number
}

// interface UpdatedProduct {
//     id: number,
//     prod_name?: string,
//     category_id?: number,
//     image_path?: string,
//     price?: number
// }

async function getAllProducts(): Promise<Product[]> {
    try {
        const result = await db.query(`
            SELECT products.id, name AS prod_name, category_id, category, image_path, price 
            FROM products JOIN prod_category
            ON products.category_id = prod_category.id;
        `);

        return result.rows;
    } catch(err) {
        console.error('Error: can not load all products:', err);
        throw(err);
    }
}

async function getProductWithId(id: number): Promise<Product> {
    try {
        // @TODO: does the product exist?
        const result = await db.query(`
            SELECT products.id, name AS prod_name, category_id, category, image_path, price 
            FROM products JOIN prod_category
            ON products.category_id = prod_category.id
            WHERE products.id = $1;
        `, [id]);

        return result.rows[0];
    } catch(err) {
        console.error(`Error: can not load product with id ${id}:`, err);
        throw(err);
    }
}

async function createProduct(product: NewProduct): Promise<Product> {
    try {
        // @CHECK: what if the nullable fields are undefined or null?
        // @TODO: validate product catagory
        const result = await db.query(`
            INSERT INTO products
            VALUES (name, category_id, image_path, price)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `, [product.prod_name, product.category_id, product.image_path, product.price]);

        return {
            id: result.rows[0].id,
            ...product
        }
    } catch(err) {
        console.error(`Error: could not create product:`, product, err);
        throw(err);
    }
}

async function deleteProduct(id: number): Promise<{id: number, prod_name: string}> {
    try {
        // @TODO: Delete the image stored also
        // @TODO: does the product exit? will pgsql handle it for me?
        const result = await db.query(`
            DELETE FROM products WHERE id = $1
            RETURNING name as prod_name;
        `, [id]);
        
        return {
            id,
            prod_name: result.rows[0].prod_name
        }
    } catch(err) {
        console.error(`Error: could not delete product id ${id}:`, err);
        throw(err);
    }
}

async function updateProduct(newProduct: Product): Promise<Product> {
    try {
        // @TODO: add validation for cata_id, img, ...
        await db.query(`
            UPDATE products SET name = $1, category_id = $2, image_path = $3, price = $4  WHERE id = $5;
        `, [ newProduct.prod_name, newProduct.category_id, newProduct.image_path, newProduct.price, newProduct.id ]);

        return newProduct;
    } catch(err) {
        console.error(`Error: could not edit product id ${newProduct.id} name to ${newProduct.prod_name}:`, err);
        throw(err);
    }
}

export type { Product, NewProduct };
export { getAllProducts, getProductWithId, createProduct, deleteProduct, updateProduct };