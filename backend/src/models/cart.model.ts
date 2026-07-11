import { db } from "./db.js";

interface CartEntry {
    id: number,
    prod_id: number,
    prod_name: string,
    category_id: number | null,
    category: string | null,
    price: number,
    image_path: string | null
}

async function getCart(): Promise<CartEntry[]> {
    try {
        const result = await db.query(`
            SELECT 
                cart.id as id, 
                cart.entry_id as prod_id, 
                products.name as prod_name, 
                products.category_id, 
                prod_category.category, 
                products.price, 
                products.image_path
            FROM cart JOIN products ON cart.entry_id = products.id
            LEFT JOIN prod_category ON products.category_id = prod_category.id;
        `);
    
        return result.rows;
    } catch(err) {
        console.error(`Error: could not fetch cart items.`);
        throw(err);
    }
}

async function addItemToCart(entry_id: number): Promise<CartEntry | undefined> {
    try {
        const result = await db.query(`
            WITH created_entry AS (
                INSERT INTO cart (entry_id) 
                SELECT id FROM products
                WHERE id = $1 RETURNING *
            )
            SELECT 
                created_entry.id,
                created_entry.entry_id AS prod_id,
                products.name AS prod_name,
                products.price,
                products.image_path,
                products.category_id,
                prod_category.category
            FROM created_entry JOIN products
            ON created_entry.entry_id = products.id
            LEFT JOIN prod_category
            ON products.category_id = prod_category.id;
        `, [entry_id]);


        return result.rows[0];
    } catch(err: any) {
        if (err.code === "23505") { // postgresql's duplicate key constraint violation error code.
            throw Error('DUPLICATE_ENTRY_ID');
        }
        console.error(`Error: could not add item ${entry_id} to cart.`);
        throw(err);
    }
}

async function deleteCartItem(id: number): Promise<{id: number, entry_id: number} | undefined> {
    try {
        // @TODO: validate cart id?
        const result = await db.query(`
            DELETE FROM cart WHERE id = $1 RETURNING *;
        `, [id]);

        return result.rows[0];
    } catch(err) {
        console.error(`Error: could not delete card item ${id}.`);
        throw(err);
    }
}

export type { CartEntry };
export const CartModel = { getCart, addItemToCart, deleteCartItem };