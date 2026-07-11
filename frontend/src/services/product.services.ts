import { api } from './apiService'

export interface Product {
  id: number
  prod_name: string
  category_id: number | null
  category: string | null
  image_path: string | null
  price: number
}

export interface ProductInput {
  prod_name: string
  category_id: number | null
  image_path: string | null
  price: number
}

type ApiEnvelope<T> = {
  message: string
  body?: T
  prodCount?: number
}

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<ApiEnvelope<Product[]>>('/products')
  const products = response.body ?? []
  return products.map((p) => ({ ...p, price: Number(p.price) }))
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const response = await api.post<ApiEnvelope<Product>>('/products', {
    body: JSON.stringify(input),
  })

  const product = response.body ?? ({} as Product)
  return { ...product, price: Number(product.price) }
}

export async function updateProduct(productId: number, input: ProductInput): Promise<Product> {
  const response = await api.put<ApiEnvelope<Product>>(`/products/${productId}`, {
    body: JSON.stringify(input),
  })

  const product = response.body ?? ({} as Product)
  return { ...product, price: Number(product.price) }
}

export async function deleteProduct(productId: number): Promise<Product | null> {
  const response = await api.delete<ApiEnvelope<Product>>(`/products/${productId}`)
  return response.body ?? null
}
