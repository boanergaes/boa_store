import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProducts, type Product } from "../services/product.services";
import {
  getCategories,
  type Category,
} from "../services/prodCategory.services";
import {
  getCartItems,
  addToCart as addToCartService,
  deleteCartItem as deleteCartItemService,
  type CartItem,
} from "../services/cart.services";
import {
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "../services/product.services";
import {
  createCategory as createCategoryService,
  deleteCategory as deleteCategoryService,
} from "../services/prodCategory.services";

type CartContextValue = {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  activeCategory: string;
  filteredProducts: Product[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  deleteCategory: (categoryName: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  setActiveCategory: (categoryName: string) => void;
  refreshData: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "An unknown error occurred";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [fetchedProducts, fetchedCategories, fetchedCart] =
        await Promise.all([getProducts(), getCategories(), getCartItems()]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setCart(fetchedCart);
      setActiveCategory("All");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") {
      return products;
    }
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

  const cartCount = cart.length;
  const cartTotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0,
  );

  const addToCart = async (product: Product) => {
    try {
      setError(null);
      const newItem = await addToCartService(product.id);
      setCart((current) => [...current, newItem]);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      setError(null);
      const deletedItem = await deleteCartItemService(id);
      if (deletedItem) {
        setCart((current) =>
          current.filter((item) => item.id !== deletedItem.id),
        );
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const results = await Promise.all(
        cart.map((item) => deleteCartItemService(item.id)),
      );
      if (results.length > 0) {
        setCart([]);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      setError(null);
      const deletedProduct = await deleteProductService(productId);
      if (deletedProduct) {
        setProducts((current) =>
          current.filter((p) => p.id !== deletedProduct.id),
        );
        setCart((current) =>
          current.filter((item) => item.prod_id !== deletedProduct.id),
        );
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      setError(null);
      const input = {
        prod_name: product.prod_name,
        category_id: product.category_id,
        image_path: product.image_path,
        price: product.price,
      };
      const updatedProduct = await updateProductService(product.id, input);
      if (updatedProduct) {
        setProducts((current) =>
          current.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
        );
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const addProduct = async (product: Product) => {
    try {
      setError(null);
      const input = {
        prod_name: product.prod_name,
        category_id: product.category_id,
        image_path: product.image_path,
        price: product.price,
      };
      const newProduct = await createProductService(input);
      setProducts((current) => [...current, newProduct]);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const deleteCategory = async (categoryName: string) => {
    try {
      setError(null);
      const category = categories.find((c) => c.category === categoryName);
      if (category) {
        const deletedCategory = await deleteCategoryService(category.id);
        if (deletedCategory) {
          setCategories((current) =>
            current.filter((c) => c.id !== deletedCategory.id),
          );
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const addCategory = async (name: string) => {
    try {
      setError(null);
      const newCategory = await createCategoryService(name);
      setCategories((current) => [...current, newCategory]);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const value: CartContextValue = {
    products,
    categories,
    cart,
    activeCategory,
    filteredProducts,
    cartCount,
    cartTotal,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    clearCart,
    deleteProduct,
    updateProduct,
    addProduct,
    deleteCategory,
    addCategory,
    setActiveCategory,
    refreshData,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
