import { useMemo, useState } from 'react'
import { CirclePlus, Plus, ShoppingCart } from 'lucide-react'
import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { Modal } from '../components/Modal'
import { ProductForm } from '../components/ProductForm'
import { LoadingIndicator } from '../components/LoadingIndicator'
import styles from './HomePage.module.css'
import { useCart } from '../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../services/product.services'

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
    isLoading,
    error,
    refreshData,
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
      void updateProduct(product)
      return
    }

    void addProduct(product)
  }

  const handleAddCategory = (name: string) => {
    void addCategory(name)
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
              className={`${styles.filterTag} ${activeCategory === category.category ? styles.active : ''}`}
            >
              <button type="button" className={styles.filterLabel} onClick={() => setActiveCategory(category.category)}>
                {category.category}
              </button>
              <button
                type="button"
                className={styles.filterRemove}
                onClick={() => void deleteCategory(category.category)}
                aria-label={`Delete ${category.category}`}
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

      {isLoading ? <LoadingIndicator message="Loading inventory..." /> : null}
      {error ? (
        <p role="alert">
          {error}{' '}
          <button className={styles.ghostButton} type="button" onClick={() => void refreshData()}>
            Retry
          </button>
        </p>
      ) : null}

      {!isLoading && !error ? (
        <section className={styles.productGrid}>
          {filteredProducts.length === 0 ? <p>No products available right now.</p> : null}
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={() => void addToCart(product)} onEdit={() => openEditProduct(product)} onDelete={() => void deleteProduct(product.id)} />
          ))}
        </section>
      ) : null}

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
