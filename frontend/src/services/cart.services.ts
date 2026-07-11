import { api } from './apiService'

export interface CartItem {
  id: number
  prod_id: number
  prod_name: string
  category_id: number | null
  category: string | null
  price: number
  image_path: string | null
}

type ApiEnvelope<T> = {
  message: string
  body?: T
  cartCount?: number
}

export async function getCartItems(): Promise<CartItem[]> {
  const response = await api.get<ApiEnvelope<CartItem[]>>('/cart')
  const items = response.body ?? []
  return items.map((item) => ({ ...item, price: Number(item.price) }))
}

export async function addToCart(productId: number): Promise<CartItem> {
  const response = await api.post<ApiEnvelope<CartItem>>(`/cart/${productId}`, {
    body: JSON.stringify({}),
  })

  const item = response.body ?? ({} as CartItem)
  return { ...item, price: Number(item.price) }
}

export async function deleteCartItem(cartItemId: number): Promise<CartItem | null> {
  const response = await api.delete<ApiEnvelope<CartItem>>(`/cart/${cartItemId}`)
  return response.body ?? null
}
