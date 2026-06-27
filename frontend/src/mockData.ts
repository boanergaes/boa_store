export interface Product {
  id: number
  prod_name: string
  prod_catagory_id: number
  prod_catagory: string
  price: number
  prod_img_id: number
  prod_img: string
}

export interface Category {
  id: number
  catagory_name: string
}

export interface CartItem {
  id: number
  entry_id: number
  entry_name: string
  entry_catagory: string
  entry_price: number
  entry_image: string
}

export const createProductImage = (label: string, bg: string, accent: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" rx="0" fill="${bg}" />
      <rect x="40" y="40" width="520" height="320" rx="20" fill="white" opacity="0.15" />
      <circle cx="300" cy="180" r="110" fill="${accent}" opacity="0.8" />
      <rect x="190" y="150" width="220" height="90" rx="12" fill="white" opacity="0.9" />
      <text x="300" y="205" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" fill="${bg}">${label}</text>
    </svg>
  `

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const mockProducts: Product[] = [
  {
    id: 1,
    prod_name: 'Classic Sneakers',
    prod_catagory_id: 1,
    prod_catagory: 'Footwear',
    price: 89.99,
    prod_img_id: 101,
    prod_img: createProductImage('SNK', '#111827', '#f59e0b'),
  },
  {
    id: 2,
    prod_name: 'Travel Backpack',
    prod_catagory_id: 2,
    prod_catagory: 'Accessories',
    price: 54.5,
    prod_img_id: 102,
    prod_img: createProductImage('BAG', '#1f2937', '#38bdf8'),
  },
  {
    id: 3,
    prod_name: 'Ceramic Mug',
    prod_catagory_id: 3,
    prod_catagory: 'Home',
    price: 16.25,
    prod_img_id: 103,
    prod_img: createProductImage('MUG', '#7c2d12', '#fb923c'),
  },
  {
    id: 4,
    prod_name: 'Wireless Headset',
    prod_catagory_id: 4,
    prod_catagory: 'Electronics',
    price: 129.0,
    prod_img_id: 104,
    prod_img: createProductImage('HDS', '#0f172a', '#8b5cf6'),
  },
]

export const mockCategories: Category[] = [
  { id: 1, catagory_name: 'Footwear' },
  { id: 2, catagory_name: 'Accessories' },
  { id: 3, catagory_name: 'Home' },
  { id: 4, catagory_name: 'Electronics' },
]

export const initialCart: CartItem[] = [
  {
    id: 1,
    entry_id: 2,
    entry_name: 'Travel Backpack',
    entry_catagory: 'Accessories',
    entry_price: 54.5,
    entry_image: createProductImage('BAG', '#1f2937', '#38bdf8'),
  },
]
