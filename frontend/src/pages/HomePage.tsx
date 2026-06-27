import { useMemo, useState } from 'react'
import { CirclePlus, Plus, ShoppingCart } from 'lucide-react'
import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { Modal } from '../components/Modal'
import { ProductForm } from '../components/ProductForm'
import styles from './HomePage.module.css'
import { useCart } from '../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../mockData'

export function HomePage() {
  const navigate = useNavigate()
  const {
    filteredProducts,
    categories,
    activeCategory,
    cartCount,
    addToCart,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteCategory,
    setActiveCategory,
    addCategory,
  } = useCart()
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined)

  const productToEdit = useMemo(() => selectedProduct, [selectedProduct])

  const openCreateProduct = () => {
    setSelectedProduct(undefined)
    setIsProductModalOpen(true)
  }

  const openEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const closeProductModal = () => {
    setSelectedProduct(undefined)
    setIsProductModalOpen(false)
  }

  const handleSaveProduct = (product: Product) => {
    if (product.id) {
      updateProduct(product)
      return
    }

    addProduct({
      ...product,
      id: Date.now(),
      prod_img_id: Date.now(),
    })
  }

  const handleAddCategory = (name: string) => {
    addCategory(name)
    setIsCategoryModalOpen(false)
  }

  return (
    <div className={styles.pageShell}>
      <Header
        title="Boa Store"
        subtitle="Inventory overview"
        right={
          <>
            <button className={styles.ghostButton} type="button" onClick={openCreateProduct}>
              <CirclePlus size={16} />
              Post
            </button>
            <button className={styles.cartButton} type="button" onClick={() => navigate('/cart')}>
              <ShoppingCart size={18} />
              <span className={styles.cartBadge}>{cartCount}</span>
            </button>
          </>
        }
      />

      <section className={styles.filterSection}>
        <div className={styles.filterTags}>
          <button
            className={`${styles.filterTag} ${activeCategory === 'All' ? styles.active : ''}`}
            type="button"
            onClick={() => setActiveCategory('All')}
          >
            All
          </button>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`${styles.filterTag} ${activeCategory === category.catagory_name ? styles.active : ''}`}
            >
              <button type="button" className={styles.filterLabel} onClick={() => setActiveCategory(category.catagory_name)}>
                {category.catagory_name}
              </button>
              <button
                type="button"
                className={styles.filterRemove}
                onClick={() => deleteCategory(category.catagory_name)}
                aria-label={`Delete ${category.catagory_name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button className={styles.ghostButton} type="button" onClick={() => setIsCategoryModalOpen(true)}>
          <Plus size={16} />
          Add category
        </button>
      </section>

      <section className={styles.productGrid}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} onEdit={() => openEditProduct(product)} onDelete={() => deleteProduct(product.id)} />
        ))}
      </section>

      {isProductModalOpen ? (
        <Modal title={productToEdit ? 'Edit product' : 'Add product'} onClose={closeProductModal}>
          <ProductForm
            product={productToEdit}
            categories={categories}
            onSave={handleSaveProduct}
            onClose={closeProductModal}
          />
        </Modal>
      ) : null}

      {isCategoryModalOpen ? (
        <Modal title="Add category" onClose={() => setIsCategoryModalOpen(false)}>
          <form
            className={styles.categoryForm}
            onSubmit={(event) => {
              event.preventDefault()
              const formData = new FormData(event.currentTarget)
              const categoryName = (formData.get('category_name') as string).trim()
              if (categoryName) {
                handleAddCategory(categoryName)
              }
            }}
          >
            <label>
              Category name
              <input name="category_name" required />
            </label>
            <div className={styles.actions}>
              <button type="button" className={styles.ghostButton} onClick={() => setIsCategoryModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className={styles.primaryButton}>
                Save
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
