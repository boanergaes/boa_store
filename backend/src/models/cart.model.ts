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

interface NewCartEntry {
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
            JOIN prod_category ON products.category_id = prod_category.id;
        `);
    
        return result.rows;
    } catch(err) {
        console.error(`Error: could not fetch cart items.`, err);
        throw(err);
    }
}

async function addItemToCart(item: NewCartEntry): Promise<CartEntry> {
    try {
        // @TODO: validate prod_id, category_id, ...
        const result = await db.query(`
            INSERT INTO cart (entry_id) VALUES ($1) RETURNING id;
        `, [item.prod_id]);

        return {
            id: result.rows[0].id,
            ...item
        }
    } catch(err) {
        console.error(`Error: could not add item ${item.prod_name} to cart.`, err);
        throw(err);
    }
}

async function deleteCartItem(id: number): Promise<{id: number, entry_id: number}> {
    try {
        // @TODO: validate cart id?
        const result = await db.query(`
            DELETE FROM cart WHERE id = $1 RETURNING *;
        `, [id]);

        return result.rows[0];
    } catch(err) {
        console.error(`Error: could not delete card item ${id}.`, err);
        throw(err);
    }
}

export type { CartEntry, NewCartEntry };
export { getCart, addItemToCart, deleteCartItem };