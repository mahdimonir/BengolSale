# API Documentation - BengolSale Order System

This API allows external dashboards to manage orders securely.

## Authentication
All management endpoints (GET, PATCH) require the `x-admin-key` header.
- **Header Name**: `x-admin-key`
- **Value**: Must match the `ADMIN_API_KEY` set in your `.env` file.

**Example Request:**
```bash
curl -H "x-admin-key: YOUR_SECRET_KEY" https://bengolsale.com/api/order
```

---

## Endpoints

### 1. Create Order (Public)
Creates a new order. Used by the checkout page.

- **URL**: `/api/order`
- **Method**: `POST`
- **Auth**: None (Rate Limited by IP/Phone)
- **Body**:
  ```json
  {
    "customer": {
      "name": "John Doe",
      "phone": "01700000000",
      "address": "Dhaka",
      "area": "inside"
    },
    "items": [
      {
        "productId": "pack-6",
        "name": "Premium Pack",
        "price": 1200,
        "quantity": 1,
        "selectedSize": "M"
      }
    ],
    "deliveryCharge": 80,
    "total": 1280
  }
  ```

### 2. List All Orders (Secured)
Retrieves a list of all orders, sorted by newest first.

- **URL**: `/api/order`
- **Method**: `GET`
- **Auth**: Required (`x-admin-key`)
- **Response**:
  ```json
  {
    "success": true,
    "orders": [
      {
        "id": "cm...",
        "status": "PENDING",
        "customerName": "...",
        "items": [...]
      }
    ]
  }
  ```

### 3. Get Single Order (Secured)
Retrieves full details for a specific order.

- **URL**: `/api/order/:id`
- **Method**: `GET`
- **Auth**: Required (`x-admin-key`)
- **Response**: Returns the order object or 404.

### 4. Update Order Status (Secured)
Updates the status of an order (e.g., CONFIRMED, DELIVERED).

- **URL**: `/api/order/:id`
- **Method**: `PATCH`
- **Auth**: Required (`x-admin-key`)
- **Body**:
  ```json
  {
    "status": "DELIVERED"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "order": { ...updated_order }
  }
  ```

---

## Data Models

### 1. Order Object
Represents a customer order.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (CUID) | Unique Order ID. |
| `customerName` | String | Customer's full name. |
| `customerPhone` | String | Validated BD phone number (+880...). |
| `customerAddress` | String | Full delivery address. |
| `customerArea` | String | Delivery area: `'inside'` (Dhaka) or `'outside'`. |
| `total` | Float | Total bill amount (Subtotal + Delivery). |
| `deliveryCharge` | Float | Shipping cost (80 or 130). |
| `status` | String (Enum) | Current order status. See Enums below. |
| `createdAt` | DateTime | ISO 8601 Timestamp. |
| `updatedAt` | DateTime | ISO 8601 Timestamp. |
| `items` | Array | List of `OrderItem` objects. |

### 2. OrderItem Object
Represents a product inside an order.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (CUID) | Unique Item ID. |
| `productId` | String | Reference to Product ID (e.g., `pack-6`). |
| `name` | String | Snapshot of product name at time of order. |
| `price` | Float | Snapshot of unit price. |
| `quantity` | Integer | Number of units ordered. |
| `selectedSize` | String | Size (e.g., `M`, `L`, `XL`, `XXL`). |
| `selectedColor` | String | Optional color selection. |
| `imageUrl` | String | URL of the product image. |

### 3. Enums & Constants

#### Order Status (`status`)
| Value | Description |
| :--- | :--- |
| `PENDING` | Default status when order is placed. |
| `CONFIRMED` | Order has been verified by admin. |
| `SHIPPED` | Order has been dispatched. |
| `DELIVERED` | Customer has received the order. |
| `CANCELLED` | Order was cancelled. |

#### Delivery Area (`customerArea`)
| Value | Cost |
| :--- | :--- |
| `inside` | Dhaka City (৳80) |
| `outside` | Outside Dhaka (৳130) |
