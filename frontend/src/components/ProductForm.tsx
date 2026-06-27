import type { FormEvent } from 'react'
import styles from './ProductForm.module.css'
import type { Product, Category } from '../mockData'

type ProductFormProps = {
  product?: Product
  categories: Category[]
  onSave: (product: Omit<Product, 'prod_img' | 'prod_img_id'> & { prod_img: string; prod_img_id: number }) => void
  onClose: () => void
}

export function ProductForm({ product, categories, onSave, onClose }: ProductFormProps) {
  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()
    const target = event.currentTarget
    const formData = new FormData(target)
    const prod_name = (formData.get('prod_name') as string).trim()
    const prod_catagory = (formData.get('prod_catagory') as string).trim()
    const price = Number(formData.get('price'))

    if (!prod_name || !prod_catagory || Number.isNaN(price)) {
      return
    }

    onSave({
      ...product,
      prod_name,
      prod_catagory,
      price,
      prod_img: product?.prod_img ?? 'https://via.placeholder.com/420x280.png?text=Product',
      prod_img_id: product?.prod_img_id ?? Date.now(),
      prod_catagory_id:
        categories.find((category) => category.catagory_name === prod_catagory)?.id ?? categories.length + 1,
    } as Omit<Product, 'prod_img' | 'prod_img_id'> & { prod_img: string; prod_img_id: number })
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
        <select defaultValue={product?.prod_catagory ?? ''} name="prod_catagory" required>
          <option value="" disabled>
            Select category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.catagory_name}>
              {category.catagory_name}
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
