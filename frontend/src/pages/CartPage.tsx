import { ArrowLeft, BadgeCheck, Trash2 } from 'lucide-react'
import { Header } from '../components/Header'
import styles from './CartPage.module.css'
import { useCart } from '../hooks/useCart'
import { useNavigate } from 'react-router-dom'

export function CartPage() {
  const navigate = useNavigate()
  const { cart, cartCount, cartTotal, removeFromCart, clearCart } = useCart()

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

      <section className={styles.cartList}>
        {cart.length === 0 ? (
          <div className={styles.emptyState}>Your cart is empty.</div>
        ) : (
          cart.map((item) => (
            <article className={styles.cartItem} key={item.id}>
              <img src={item.entry_image} alt={item.entry_name} className={styles.cartImage} />
              <div className={styles.cartItemInfo}>
                <h3>{item.entry_name}</h3>
                <p>{item.entry_catagory}</p>
                <strong>${item.entry_price.toFixed(2)}</strong>
              </div>
              <button className={styles.iconButton} type="button" onClick={() => removeFromCart(item.id)}>
                <Trash2 size={15} />
              </button>
            </article>
          ))
        )}
      </section>

      <div className={styles.cartActions}>
        <button className={styles.primaryButton} type="button">
          <BadgeCheck size={16} />
          Checkout
        </button>
        <button className={styles.ghostButton} type="button" onClick={clearCart}>
          Clear
        </button>
      </div>
    </div>
  )
}
