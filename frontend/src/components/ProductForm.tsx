import type { FormEvent } from 'react'
import styles from './ProductForm.module.css'
import type { Category } from '../services/prodCategory.services'
import type { Product } from '../services/product.services'

type ProductFormProps = {
  product?: Product
  categories: Category[]
  onSave: (product: Product) => void
  onClose: () => void
}

export function ProductForm({ product, categories, onSave, onClose }: ProductFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const target = event.currentTarget
    const formData = new FormData(target)
    const prod_name = (formData.get('prod_name') as string).trim()
    const category = (formData.get('category') as string).trim()
    const price = Number(formData.get('price'))

    if (!prod_name || !category || Number.isNaN(price)) {
      return
    }

    onSave({
      id: product?.id ?? 0,
      prod_name,
      category,
      category_id: categories.find((item) => item.category === category)?.id ?? null,
      image_path: product?.image_path ?? null,
      price,
    })
    onClose()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        Name
        <input defaultValue={product?.prod_name ?? ''} name="prod_name" required />
      </label>
      <label>
        Category
        <select defaultValue={product?.category ?? ''} name="category" required>
          <option value="" disabled>
            Select category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.category}>
              {category.category}
            </option>
          ))}
        </select>
      </label>
      <label>
        Price
        <input defaultValue={product?.price ?? ''} name="price" type="number" min="0" step="0.01" required />
      </label>
      <div className={styles.actions}>
        <button type="button" className={styles.ghostButton} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={styles.primaryButton}>
          Save
        </button>
      </div>
    </form>
  )
}
