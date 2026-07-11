import { ArrowLeft, BadgeCheck, Trash2 } from 'lucide-react'
import { Header } from '../components/Header'
import { LoadingIndicator } from '../components/LoadingIndicator'
import styles from './CartPage.module.css'
import { useCart } from '../hooks/useCart'
import { useNavigate } from 'react-router-dom'

export function CartPage() {
  const navigate = useNavigate()
  const { cart, cartCount, cartTotal, removeFromCart, clearCart, isLoading, error, refreshData } = useCart()

  return (
    <div className={styles.pageShell}>
      <Header
        title="Boa Store"
        right={
          <button className={styles.backLink} type="button" onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            Back to home
          </button>
        }
      />

      <section className={styles.cartSummary}>
        <div>
          <h2>Cart</h2>
          <p>{cartCount} item{cartCount === 1 ? '' : 's'} in cart</p>
        </div>
        <strong>Total: ${cartTotal.toFixed(2)}</strong>
      </section>

      {isLoading ? <LoadingIndicator message="Loading cart..." /> : null}
      {error ? (
        <p role="alert">
          {error}{' '}
          <button className={styles.ghostButton} type="button" onClick={() => void refreshData()}>
            Retry
          </button>
        </p>
      ) : null}

      {!isLoading && !error ? (
        <section className={styles.cartList}>
          {cart.length === 0 ? (
            <div className={styles.emptyState}>Your cart is empty.</div>
          ) : (
            cart.map((item) => (
              <article className={styles.cartItem} key={item.id}>
                <img src={item.image_path ?? 'https://placehold.co/600x400?text=Product'} alt={item.prod_name} className={styles.cartImage} />
                <div className={styles.cartItemInfo}>
                  <h3>{item.prod_name}</h3>
                  <p>{item.category ?? 'Uncategorized'}</p>
                  <strong>${(Number(item.price) || 0).toFixed(2)}</strong>
                </div>
                <button className={styles.iconButton} type="button" onClick={() => void removeFromCart(item.id)}>
                  <Trash2 size={15} />
                </button>
              </article>
            ))
          )}
        </section>
      ) : null}

      <div className={styles.cartActions}>
        <button className={styles.primaryButton} type="button">
          <BadgeCheck size={16} />
          Checkout
        </button>
        <button className={styles.ghostButton} type="button" onClick={() => void clearCart()}>
          Clear
        </button>
      </div>
    </div>
  )
}
