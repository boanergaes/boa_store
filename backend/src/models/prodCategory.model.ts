import { db } from "./db.js";

interface ProdCategory {
    id: number,
    category: string
}

async function getAllCategories(): Promise<ProdCategory[]> {
    try {
        const result = await db.query(`
            SELECT * FROM prod_category;
        `);

        return result.rows;
    }

    catch(err) {
        console.error(`Error: could not fetch product categories.`, err);
        throw(err);
    }
}

async function createCategory(category: string): Promise<ProdCategory> {
    try {
        const result = await db.query(`
            INSERT INTO prod_category (category) VALUES ($1) RETURNING *;
        `, [category]);
        
        return result.rows[0];
    } catch(err) {
        console.error(`Error: could not create category ${category}`, err);
        throw(err);
    }
}

async function deleteCategory(id: number): Promise<ProdCategory> {
    try {
        const result = await db.query(`
            DELETE FROM prod_category WHERE id = $1 RETURNING *;    
        `, [id]);

        return result.rows[0];
    } catch(err) {
        console.error(`Error: could not delete category ${id};`, err);
        throw(err);
    }
}

export type { ProdCategory };
export { getAllCategories, createCategory, deleteCategory };