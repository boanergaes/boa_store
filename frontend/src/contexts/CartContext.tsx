import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { initialCart, mockCategories, mockProducts, type CartItem, type Category, type Product } from '../mockData'

type CartContextValue = {
  products: Product[]
  categories: Category[]
  cart: CartItem[]
  activeCategory: string
  filteredProducts: Product[]
  cartCount: number
  cartTotal: number
  addToCart: (product: Product) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  deleteProduct: (productId: number) => void
  updateProduct: (product: Product) => void
  addProduct: (product: Product) => void
  deleteCategory: (categoryName: string) => void
  addCategory: (name: string) => void
  setActiveCategory: (categoryName: string) => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [cart, setCart] = useState<CartItem[]>(initialCart)
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') {
      return products
    }

    return products.filter((product) => product.prod_catagory === activeCategory)
  }, [activeCategory, products])

  const cartCount = cart.length
  const cartTotal = cart.reduce((sum, item) => sum + item.entry_price, 0)

  const addToCart = (product: Product) => {
    const alreadyAdded = cart.some((item) => item.entry_id === product.id)

    if (alreadyAdded) {
      return
    }

    setCart((current) => [
      ...current,
      {
        id: current.length + 1,
        entry_id: product.id,
        entry_name: product.prod_name,
        entry_catagory: product.prod_catagory,
        entry_price: product.price,
        entry_image: product.prod_img,
      },
    ])
  }

  const removeFromCart = (id: number) => {
    setCart((current) => current.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const deleteProduct = (productId: number) => {
    setProducts((current) => current.filter((product) => product.id !== productId))
    setCart((current) => current.filter((item) => item.entry_id !== productId))
  }

  const updateProduct = (product: Product) => {
    setProducts((current) => current.map((item) => (item.id === product.id ? product : item)))
  }

  const addProduct = (product: Product) => {
    setProducts((current) => [...current, product])
  }

  const deleteCategory = (categoryName: string) => {
    setCategories((current) => current.filter((category) => category.catagory_name !== categoryName))
    setProducts((current) =>
      current.map((product) =>
        product.prod_catagory === categoryName ? { ...product, prod_catagory: 'Uncategorized' } : product,
      ),
    )
    setActiveCategory('All')
  }

  const addCategory = (name: string) => {
    const nextName = name.trim()

    if (!nextName) {
      return
    }

    const exists = categories.some((category) => category.catagory_name === nextName)

    if (exists) {
      return
    }

    setCategories((current) => [...current, { id: current.length + 1, catagory_name: nextName }])
  }

  const value: CartContextValue = {
    products,
    categories,
    cart,
    activeCategory,
    filteredProducts,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    clearCart,
    deleteProduct,
    updateProduct,
    addProduct,
    deleteCategory,
    addCategory,
    setActiveCategory,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}
