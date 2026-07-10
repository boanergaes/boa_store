# Backend API Documentation

## Overview

This backend exposes a simple REST API for managing products, a shopping cart, and product categories. It is built with Express, PostgreSQL, and express-validator.

Base path for all routes:

- `/api`

Example local base URL:

- `http://localhost:3000/api`

> The actual host and port come from the environment variable `BASE_URL` and `PORT`.

---

## Common response structure

### Successful responses

Most successful responses follow this pattern:

```json
{
  "message": "Descriptive success message",
  "body": { "..." } | ["..."],
  "prodCount": 3,
  "cartCount": 1,
  "categoryCount": 2
}
```

### Validation error response

When request validation fails:

```json
{
  "message": "Validation error occured.",
  "errors": [
    {
      "msg": "Must provide a product name.",
      "param": "prod_name",
      "location": "body"
    }
  ]
}
```

### Server error response

When an unexpected server error happens:

```json
{
  "message": "Could not fetch products, something went wrong in the server. Sorry!"
}
```

---

## Data models

### Product

```json
{
  "id": 1,
  "prod_name": "Keyboard",
  "category_id": 2,
  "category": "Electronics",
  "image_path": null,
  "price": 49.99
}
```

### Category

```json
{
  "id": 1,
  "category": "Electronics"
}
```

### Cart entry

```json
{
  "id": 5,
  "prod_id": 1,
  "prod_name": "Keyboard",
  "category_id": 2,
  "category": "Electronics",
  "price": 49.99,
  "image_path": null
}
```

---

## Products API

### 1) Get all products

- Method: `GET`
- Route: `/api/products`

#### Success

- Status: `200`
- Returns all products

```json
{
  "message": "Fetched All products successfully.",
  "prodCount": 2,
  "body": [
    {
      "id": 1,
      "prod_name": "Keyboard",
      "category_id": 2,
      "category": "Electronics",
      "image_path": null,
      "price": 49.99
    }
  ]
}
```

#### Edge case

- If there are no products, the API still returns `200` with an empty array in the `body` field.

---

### 2) Get one product

- Method: `GET`
- Route: `/api/products/:id`

#### Request params

- `id` must be an integer

#### Success

- Status: `200`
- Returns the matching product

```json
{
  "message": "Fetched product successfully.",
  "body": {
    "id": 1,
    "prod_name": "Keyboard",
    "category_id": 2,
    "category": "Electronics",
    "image_path": null,
    "price": 49.99
  }
}
```

#### Edge cases

- Invalid `id` (non-integer or empty):
  - Status: `400`
  - Response:

```json
{
  "message": "Validation error occured.",
  "errors": [
    {
      "msg": "Id parameter should be integer."
    }
  ]
}
```

- Product not found:
  - Status: `404`
  - Response:

```json
{
  "message": "Could not find product with this id.",
  "body": null
}
```

---

### 3) Create a product

- Method: `POST`
- Route: `/api/products`

#### Request body

```json
{
  "prod_name": "Mouse",
  "category_id": 2,
  "image_path": null,
  "price": 25
}
```

> Optional fields are allowed. If `category_id` or `image_path` are omitted, they default to `null`. If `price` is omitted, it defaults to `0`.

#### Success

- Status: `201`
- Returns the created product

```json
{
  "message": "Created product successfully.",
  "body": {
    "id": 2,
    "prod_name": "Mouse",
    "category_id": 2,
    "category": "Electronics",
    "image_path": null,
    "price": 25
  }
}
```

#### Edge cases

- Missing `prod_name`:
  - Status: `400`
  - Response:

```json
{
  "message": "Validation error occured.",
  "errors": [
    {
      "msg": "Must provide a product name."
    }
  ]
}
```

- If `category_id` points to a category that does not exist, the backend does not fail the request. Instead, it stores the product with `category_id: null` and returns a product response with `category: null`.

---

### 4) Update a product

- Method: `PUT`
- Route: `/api/products/:id`

#### Request body

```json
{
  "prod_name": "Mechanical Keyboard",
  "category_id": 2,
  "image_path": null,
  "price": 89.99
}
```

#### Success

- Status: `200`
- Returns the updated product

```json
{
  "message": "Updated product successfully.",
  "body": {
    "id": 1,
    "prod_name": "Mechanical Keyboard",
    "category_id": 2,
    "category": "Electronics",
    "image_path": null,
    "price": 89.99
  }
}
```

#### Edge cases

- Invalid `id` or validation errors:
  - Status: `400`
- Product not found:
  - Status: `404`

```json
{
  "message": "Could not find a product with this id.",
  "body": null
}
```

- If `category_id` points to a category that does not exist, the update still succeeds, but the product is saved with `category_id: null` and `category: null`.

---

### 5) Delete a product

- Method: `DELETE`
- Route: `/api/products/:id`

#### Success

- Status: `200`
- Returns the deleted product

```json
{
  "message": "Deleted product successfully",
  "body": {
    "id": 1,
    "prod_name": "Keyboard",
    "category_id": 2,
    "image_path": null,
    "price": 49.99
  }
}
```

#### Edge cases

- Invalid `id`:
  - Status: `400`
- Product not found:
  - Status: `404`

```json
{
  "message": "Could not find product with this id.",
  "body": null
}
```

---

## Cart API

### 1) Get cart items

- Method: `GET`
- Route: `/api/cart`

#### Success

- Status: `200`
- Returns all cart entries

```json
{
  "message": "Fetched cart successfully.",
  "cartCount": 1,
  "body": [
    {
      "id": 5,
      "prod_id": 1,
      "prod_name": "Keyboard",
      "category_id": 2,
      "category": "Electronics",
      "price": 49.99,
      "image_path": null
    }
  ]
}
```

#### Edge case

- If the cart is empty, the API returns `200` with an empty array in the `body` field.

---

### 2) Add item to cart

- Method: `POST`
- Route: `/api/cart/:entry_id`

#### Request params

- `entry_id` is the product ID to insert into cart

#### Success

- Status: `201`
- Returns the added cart entry

```json
{
  "message": "Successfully added product to cart.",
  "body": {
    "id": 5,
    "prod_id": 1,
    "prod_name": "Keyboard",
    "category_id": 2,
    "category": "Electronics",
    "price": 49.99,
    "image_path": null
  }
}
```

#### Edge cases

- Duplicate entry:
  - Status: `409`
  - Response:

```json
{
  "message": "Product already exists in cart."
}
```

- Product ID does not exist:
  - Status: `404`
  - Response:

```json
{
  "message": "A product with this entry id does not exit.",
  "body": null
}
```

---

### 3) Delete cart item

- Method: `DELETE`
- Route: `/api/cart/:id`

#### Success

- Status: `200`
- Returns the deleted cart row

```json
{
  "message": "Successfully deleted cart item.",
  "body": {
    "id": 5,
    "entry_id": 1
  }
}
```

#### Edge cases

- Invalid `id`:
  - Status: `400`
- Cart item not found:
  - Status: `404`

```json
{
  "message": "Could not find cart entry with this id",
  "body": null
}
```

---

## Categories API

### 1) Get all categories

- Method: `GET`
- Route: `/api/category`

#### Success

- Status: `200`
- Returns all categories

```json
{
  "message": "Fetched all product categories successfully.",
  "categoryCount": 2,
  "body": [
    {
      "id": 1,
      "category": "Electronics"
    }
  ]
}
```

---

### 2) Create a category

- Method: `POST`
- Route: `/api/category`

#### Request body

```json
{
  "category": "Furniture"
}
```

> The submitted category value is converted to lowercase before being stored.

#### Success

- Status: `201`
- Returns the new category

```json
{
  "message": "Created product category successfully.",
  "body": {
    "id": 2,
    "category": "Furniture"
  }
}
```

#### Edge cases

- Missing or empty category:
  - Status: `400`
- Duplicate category:
  - Status: `409`

```json
{
  "message": "Category already exists."
}
```

---

### 3) Delete a category

- Method: `DELETE`
- Route: `/api/category/:id`

#### Success

- Status: `200`
- Returns the deleted category

```json
{
  "message": "Deleted product category successfully.",
  "body": {
    "id": 1,
    "category": "Electronics"
  }
}
```

#### Edge cases

- Invalid `id`:
  - Status: `400`
- Category not found:
  - Status: `404`

```json
{
  "message": "Could not find product category with this id.",
  "body": null
}
```

---

## Notes and limitations

- Authentication is not implemented.
- There is no pagination for products, categories, or cart entries.

