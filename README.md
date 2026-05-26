# 🍔 FoodApp — Online Food Ordering Platform

A full-stack food ordering web application built as part of a hiring evaluation. Features a customer-facing storefront with cart, orders, and Stripe payments, plus an admin dashboard — all with Arabic/English multi-language support and full dark mode.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [API Reference](#-api-reference)
- [Pages & Routes](#-pages--routes)
- [Authentication & Roles](#-authentication--roles)
- [Payment Flow](#-payment-flow)
- [Multi-language Support](#-multi-language-support)
- [Screenshots](#-screenshots)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🍽️ Menu Display | Full product grid with images, prices, categories, and availability |
| 🛒 Cart | Persistent cart with quantity management (Zustand + localStorage) |
| 📦 Place Orders | Checkout with delivery address and payment method selection |
| 🔐 Authentication | JWT-based register/login with role-based access (Customer / Admin) |
| 💳 Online Payment | Stripe Payment Element integration with test mode support |
| 💵 Cash on Delivery | COD option with auto-confirmation |
| 🛠️ Admin Dashboard | Stats overview, product CRUD, order management with status updates |
| 🌍 Multi-language | Full Arabic & English support with RTL layout for Arabic |
| 🌙 Dark Mode | System-aware dark mode with manual toggle, persisted in localStorage |
---

## 🛠 Tech Stack

### Backend
| Package | Version | Purpose |
|---|---|---|
| NestJS | ^11 | Backend framework |
| Prisma ORM | ^5.22 | Database ORM |
| PostgreSQL (Neon) | — | Hosted serverless database |
| JWT + Passport | — | Authentication |
| Stripe | latest | Payment processing |
| class-validator | ^0.15 | DTO validation |
| bcryptjs | ^3 | Password hashing |

### Frontend
| Package | Version | Purpose |
|---|---|---|
| Next.js | 16 (App Router) | React framework |
| shadcn/ui | latest | UI component library |
| Tailwind CSS | v4 | Styling |
| Framer Motion | latest | Animations |
| TanStack Query | v5 | Server state management |
| Zustand | latest | Client state (cart) |
| next-intl | latest | i18n — Arabic & English |
| Stripe.js | latest | Payment UI |
| Sonner | latest | Toast notifications |
| Axios | latest | HTTP client |

---

## 📁 Project Structure

```
food-ordering-app/
├── backend/                          # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema
│   │   ├── seed.ts                   # Seed data (admin + products)
│   │   └── migrations/
│   ├── src/
│   │   ├── auth/                     # JWT auth, guards, decorators
│   │   │   ├── decorators/
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   └── jwt.strategy.ts
│   │   ├── common/
│   │   │   ├── helpers/localize.helper.ts   # AR/EN field picker
│   │   │   └── middleware/language.middleware.ts
│   │   ├── orders/                   # Order placement & tracking
│   │   ├── payment/                  # Stripe integration
│   │   ├── prisma/                   # Global Prisma service
│   │   ├── products/                 # Menu & categories
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   └── package.json
│
└── frontend/                         # Next.js 16 App
    ├── app/
    │   ├── [locale]/
    │   │   ├── layout.tsx            # Navbar + Footer + i18n
    │   │   ├── page.tsx              # Home / Menu
    │   │   ├── auth/
    │   │   │   ├── login/page.tsx
    │   │   │   └── register/page.tsx
    │   │   ├── cart/page.tsx
    │   │   ├── orders/
    │   │   │   ├── page.tsx
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx      # Order detail + tracker
    │   │   │       └── pay/page.tsx  # Stripe payment
    │   │   └── admin/
    │   │       ├── layout.tsx        # Admin sidebar + guard
    │   │       ├── page.tsx          # Dashboard stats
    │   │       ├── orders/page.tsx
    │   │       └── products/page.tsx
    │   └── layout.tsx
    ├── components/
    │   ├── layout/                   # Navbar, Footer, Providers
    │   ├── menu/                     # ProductCard, CategoryFilter
    │   ├── orders/                   # OrderStatusBadge
    │   └── admin/                    # Stats, Tables, Forms
    ├── hooks/                        # useAuth, useProducts, useOrders
    ├── lib/                          # api.ts (axios), query-client.ts
    ├── store/                        # cart.store.ts (Zustand)
    ├── types/                        # Shared TypeScript types
    ├── i18n/
    │   ├── routing.ts
    │   ├── request.ts
    │   └── messages/
    │       ├── en.json
    │       └── ar.json
    ├── proxy.ts                      # next-intl middleware
    ├── .env.local
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)
- A [Stripe](https://stripe.com) account (test mode is fine)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/food-ordering-app.git
cd food-ordering-app
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Copy the example env and fill in your values:

```bash
cp .env.example .env
```

Run migrations and seed the database:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Start the backend:

```bash
npm run start:dev
# Server runs on http://localhost:3001/api
```

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
```

Copy the example env:

```bash
cp .env.local.example .env.local
```

Start the frontend:

```bash
npm run dev
# App runs on http://localhost:3000 → redirects to /en
```

---

## 🔐 Environment Variables

### Backend — `backend/.env`

```env
# Database (get from neon.tech)
DATABASE_URL="postgresql://user:password@host.neon.tech/neondb?sslmode=require"

# JWT
JWT_SECRET="your-strong-secret-key-here"
JWT_EXPIRES_IN="7d"

# Stripe (get from dashboard.stripe.com → Developers → API Keys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_CURRENCY="usd"

# Server
PORT=3001
```

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Stripe publishable key (starts with pk_test_...)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🗄️ Database Setup

### Schema overview

```
User          — id, email, name, password, role (CUSTOMER | ADMIN)
Category      — id, nameEn, nameAr
Product       — id, nameEn, nameAr, descEn, descAr, price, image, available, categoryId
Order         — id, userId, total, status, paymentMethod, paymentStatus, paymentIntentId, address
OrderItem     — id, orderId, productId, quantity, price
```

### Seeded data

Running `npx prisma db seed` creates:

| Type | Data |
|---|---|
| Admin user | `admin@food.com` / `admin123` |
| Categories | Burgers, Pizza, Drinks (EN + AR) |
| Products | 5 products with Unsplash images (EN + AR names/descriptions) |

---

## 📡 API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new account |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/profile` | JWT | Get current user |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List available products (respects Accept-Language) |
| GET | `/api/products/categories` | Public | List all categories |
| GET | `/api/products/:id` | Public | Single product |
| GET | `/api/products/admin/all` | Admin | All products (both languages) |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/products/categories` | Admin | Create category |

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | JWT | Place a new order |
| GET | `/api/orders/my-orders` | JWT | Get my orders |
| GET | `/api/orders/my-orders/:id` | JWT | Single order detail |
| GET | `/api/orders/admin/all` | Admin | All orders (filterable by status) |
| GET | `/api/orders/admin/stats` | Admin | Dashboard statistics |
| PUT | `/api/orders/admin/:id/status` | Admin | Update order status |

### Payment

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/payment/create-intent` | JWT | Create Stripe PaymentIntent, returns clientSecret |
| POST | `/api/payment/confirm` | JWT | Confirm payment after Stripe succeeds |

---

## 🗺 Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/` | Redirect to `/en` | Public |
| `/en` or `/ar` | Menu / Home | Public |
| `/en/auth/login` | Login | Public |
| `/en/auth/register` | Register | Public |
| `/en/cart` | Cart & Checkout | Public (checkout requires login) |
| `/en/orders` | My Orders list | Customer |
| `/en/orders/:id` | Order detail + status tracker | Customer |
| `/en/orders/:id/pay` | Stripe payment page | Customer |
| `/en/admin` | Admin dashboard stats | Admin only |
| `/en/admin/orders` | Manage all orders | Admin only |
| `/en/admin/products` | Manage products | Admin only |

All routes support `/ar/...` for Arabic with RTL layout.

---

## 🔐 Authentication & Roles

```
CUSTOMER (default)
  ├── Browse menu
  ├── Add to cart
  ├── Place orders (COD or Online)
  ├── View own orders & tracking
  └── Pay via Stripe

ADMIN
  ├── Everything above
  ├── View dashboard stats
  ├── Manage products (create / edit / delete)
  └── Update order status for all orders
```

The JWT token is stored in `localStorage` and sent automatically via the Axios request interceptor as `Authorization: Bearer <token>`. Admin routes are protected by the `RolesGuard` on the backend and a client-side redirect guard on the frontend.

### Default admin credentials (seeded)

```
Email:    admin@food.com
Password: admin123
```

---

## 💳 Payment Flow

### Cash on Delivery
```
Customer places order (COD)
  → Order created with status PENDING
  → Auto-confirmed → status CONFIRMED
  → Admin drives remaining status updates
```

### Online Payment (Stripe)
```
Customer places order (ONLINE)
  → Order created with status PENDING, paymentStatus UNPAID
  → Redirected to /orders/:id/pay
  → Frontend calls POST /payment/create-intent
  → Backend creates Stripe PaymentIntent, returns clientSecret
  → Stripe PaymentElement mounts and customer enters card
  → On success: frontend calls POST /payment/confirm
  → Backend verifies with Stripe, sets paymentStatus PAID + status CONFIRMED
  → Customer redirected to /orders
```

### Stripe test card

```
Card number:  4242 4242 4242 4242
Expiry:       Any future date (e.g. 12/34)
CVC:          Any 3 digits
ZIP:          Any 5 digits
```

---

## 🌍 Multi-language Support

The app supports **English** and **Arabic** with full RTL layout.

### How it works

**Backend** — `Accept-Language` header middleware transforms all product responses:
- `nameEn` / `nameAr` → `name`
- `descEn` / `descAr` → `desc`

So the frontend always receives a unified `name` and `desc` field in the requested language.

**Frontend** — `next-intl` handles UI strings via JSON message files:
- `i18n/messages/en.json` — English UI labels
- `i18n/messages/ar.json` — Arabic UI labels

**Switching language:**
- Click the globe icon in the navbar
- URL switches between `/en/...` and `/ar/...`
- `localStorage.lang` updates → Axios sends correct `Accept-Language`
- TanStack Query invalidates all caches → products refetch in new language
- `dir="rtl"` applied to `<html>` for Arabic → full RTL layout

---

## 📸 Video:
https://drive.google.com/file/d/1pqL5Kh_P9j9EEK5JayOrqIj58RKNzeCt/view?usp=sharing



---
