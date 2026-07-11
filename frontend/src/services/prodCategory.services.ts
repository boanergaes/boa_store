import { api } from './apiService'

export interface Category {
  id: number
  category: string
}

type ApiEnvelope<T> = {
  message: string
  body?: T
  categoryCount?: number
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<ApiEnvelope<Category[]>>('/category')
  return response.body ?? []
}

export async function createCategory(name: string): Promise<Category> {
  const response = await api.post<ApiEnvelope<Category>>('/category', {
    body: JSON.stringify({ category: name }),
  })

  return response.body ?? ({} as Category)
}

export async function deleteCategory(categoryId: number): Promise<Category | null> {
  const response = await api.delete<ApiEnvelope<Category>>(`/category/${categoryId}`)
  return response.body ?? null
}
