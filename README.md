# BengolSale - Premium Landing Page

A high-conversion, mobile-first landing page and order management system built with Next.js 16.

## 🚀 Features

### ✅ Storefront
*   **Mobile-First Design**: Optimized for seamless mobile browsing.
*   **Fast Checkout**: Single-page product selection and order placement.
*   **Quantity Management**: Easy `+ / -` controls for ordering multiple units.
*   **Dynamic Combos**: Support for single products and value packs.
*   **Smart Delivery Logic**: Auto-calculates delivery fees based on location and quantity (Free delivery for 3+ items).

### 🔒 Backend & API
*   **Secure API**: `GET` and `PATCH` endpoints protected by `x-admin-key`.
*   **Order Management**: Full CRUD support for external dashboard integration.
*   **Rate Limiting**: Built-in protection against spam orders.
*   **PostgreSQL + Prisma**: Robust data handling.

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Styling**: Tailwind CSS v4
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Animations**: Framer Motion
*   **Icons**: Lucide React

---

## ⚙️ Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
    ADMIN_API_KEY="your_secret_secure_key_for_dashboard"
    ```

3.  **Database Setup**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 📖 API Documentation

For detailed API usage (creating, listing, and updating orders), please refer to [API_DOCS.md](./API_DOCS.md).

---

## 📜 License

© 2026 BengolSale. Powered by Co-Founder BD.
