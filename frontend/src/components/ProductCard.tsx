import { Pencil, Trash2 } from 'lucide-react'
import styles from './ProductCard.module.css'
import type { Product } from '../services/product.services'

type ProductCardProps = {
  product: Product
  onAddToCart: (product: Product) => void
  onEdit: () => void
  onDelete: () => void
}

export function ProductCard({ product, onAddToCart, onEdit, onDelete }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <img src={product.image_path ?? 'https://placehold.co/600x400?text=Product'} alt={product.prod_name} className={styles.image} />
      <div className={styles.details}>
        <h3>{product.prod_name}</h3>
        <p>{product.category ?? 'Uncategorized'}</p>
        <strong>${(Number(product.price) || 0).toFixed(2)}</strong>
      </div>
      <div className={styles.actions}>
        <button className={styles.primaryButton} type="button" onClick={() => onAddToCart(product)}>
          Add to cart
        </button>
        <button className={styles.iconButton} type="button" aria-label={`Edit ${product.prod_name}`} onClick={onEdit}>
          <Pencil size={15} />
        </button>
        <button className={styles.iconButton} type="button" aria-label={`Delete ${product.prod_name}`} onClick={onDelete}>
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  )
}
