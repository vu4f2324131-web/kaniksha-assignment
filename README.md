# 🛍️ ShopEase - Mini E-Commerce Application

A responsive, production-quality React e-commerce web application built for a React Developer Intern take-home assessment. ShopEase offers a smooth shopping experience featuring real-time product filtering, category browsing, sorting, product detail views, dynamic cart management with `useReducer` and `Context API`, and robust `localStorage` persistence.

---

## 🌟 Key Features

- **Product Catalog & Browsing**:
  - Live search by product title or description (case-insensitive & trimmed).
  - Category filtering (Electronics, Fashion, Home & Living, Accessories, Beauty).
  - Multi-directional sorting (Featured, Price: Low to High, Price: High to Low, Rating: High to Low).
  - Combined search, category, and sorting on derived state without mutating original data.
- **Product Details Page (`/products/:id`)**:
  - Full product showcase with fallback image handling, rating stars, price in INR (`₹`), and stock availability.
  - Quantity selector with strict stock boundaries (prevents exceeding available stock or dropping below 1).
  - Related products recommendation section based on category.
  - Dedicated **Product Not Found** page for invalid product IDs.
- **Shopping Cart Management (`/cart`)**:
  - Centralized state managed via `Context API` + `useReducer`.
  - Item addition, quantity increment/decrement, direct input, and removal.
  - Live header badge displaying total item count (sum of quantities).
  - Real-time calculation of subtotal, free shipping threshold (orders > ₹999), and grand total.
  - Confirmation dialog modal before clearing cart.
  - Interactive demo checkout modal notice explaining frontend scope.
- **Data Persistence & Safety**:
  - Automatic `localStorage` sync for cart contents.
  - Defensive parsing for missing, invalid, or corrupted localStorage data.
  - Stores only minimal cart items (`{ id, quantity }`), deriving full product details dynamically from dataset.
- **Accessibility & UX**:
  - Semantic HTML structure and full keyboard navigation.
  - Dynamic Toast notifications for user actions.
  - Fully responsive grid layout across mobile, tablet, and desktop viewports.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 (Functional Components & Hooks)
- **Build Tool & Dev Server**: Vite
- **Routing**: React Router DOM v7
- **State Management**: React Context API + `useReducer`
- **Persistence**: Web Storage API (`localStorage`)
- **Styling**: Vanilla CSS (Custom Design System with CSS variables)
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library + JSDOM

---

## 📂 Project Structure

```
mini-ecommerce/
├── public/
├── src/
│   ├── __tests__/           # Vitest unit tests for cart reducer & utilities
│   │   ├── cartReducer.test.js
│   │   └── cartUtils.test.js
│   ├── components/          # Reusable UI Components
│   │   ├── CartItem.jsx & CartItem.css
│   │   ├── CartSummary.jsx & CartSummary.css
│   │   ├── CategoryFilter.jsx & CategoryFilter.css
│   │   ├── ConfirmModal.jsx & ConfirmModal.css
│   │   ├── EmptyState.jsx & EmptyState.css
│   │   ├── ErrorMessage.jsx & ErrorMessage.css
│   │   ├── Footer.jsx & Footer.css
│   │   ├── Layout.jsx
│   │   ├── LoadingSpinner.jsx & LoadingSpinner.css
│   │   ├── Navbar.jsx & Navbar.css
│   │   ├── ProductCard.jsx & ProductCard.css
│   │   ├── ProductGrid.jsx & ProductGrid.css
│   │   ├── QuantitySelector.jsx & QuantitySelector.css
│   │   ├── RatingStars.jsx & RatingStars.css
│   │   ├── SearchBar.jsx & SearchBar.css
│   │   ├── SortDropdown.jsx & SortDropdown.css
│   │   └── Toast.jsx & Toast.css
│   ├── context/
│   │   └── CartContext.jsx  # Centralized Cart Context Provider
│   ├── data/
│   │   ├── products.json    # Local JSON dataset (20+ items)
│   │   └── productService.js # Data querying utility service
│   ├── hooks/
│   │   └── useCart.js       # Custom cart context hook
│   ├── pages/
│   │   ├── Cart.jsx & Cart.css
│   │   ├── Home.jsx & Home.css
│   │   ├── NotFound.jsx & NotFound.css
│   │   └── ProductDetails.jsx & ProductDetails.css
│   ├── reducers/
│   │   └── cartReducer.js   # Pure reducer for cart actions
│   ├── utils/
│   │   ├── cartUtils.js     # Cart calculations and enrichment
│   │   └── formatCurrency.js# INR currency formatting helper
│   ├── App.jsx
│   ├── index.css            # Global CSS design system
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (v18 or higher) and npm installed.

```bash
node -v
npm -v
```

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mini-ecommerce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Available Commands

- **Start Development Server**:
  ```bash
  npm run dev
  ```
  Open your browser and navigate to `http://localhost:5173`.

- **Run Unit Tests**:
  ```bash
  npm run test
  ```

- **Build for Production**:
  ```bash
  npm run build
  ```

- **Preview Production Build**:
  ```bash
  npm run preview
  ```

---

## 💡 Local Data, State Management & Persistence

### 1. Local JSON Product Dataset (`src/data/products.json`)
Product data is stored locally in JSON format, avoiding artificial external API calls. The `productService.js` module provides clean getter functions (`getAllProducts()`, `getProductById(id)`, `getCategories()`, `getRelatedProducts()`) to query the data safely.

### 2. Normalized Cart State (`src/reducers/cartReducer.js`)
Instead of duplicating full product objects in cart state (which risks stale prices or out-of-sync details), the cart state stores only minimal references:
`[{ id: "prod-101", quantity: 2 }]`.
The `getEnrichedCartItems` utility merges cart entries with the latest product dataset dynamically.

### 3. LocalStorage Persistence (`src/context/CartContext.jsx`)
- Automatically saves cart changes to `localStorage` under key `shopease_cart_v1`.
- Restores cart items when reloading or reopening the browser.
- Safely handles empty, missing, or malformed stored data with try-catch parsing.

---

## 🛣️ Available Routes

- `/` — **Home / Product Listing**: Banner, live search, category pills, sorting dropdown, and product grid.
- `/products/:id` — **Product Details**: Product showcase, stock limits, quantity picker, add to cart, and related recommendations.
- `/cart` — **Shopping Cart**: Cart line items, quantity controls, price subtotal, free shipping calculator, and checkout modal demo.
- `*` — **404 Not Found**: Clean error page with a direct link back to home.

---

## 🧪 Testing Instructions

Run the unit test suite powered by Vitest and React Testing Library:

```bash
npm run test
```

Includes unit tests for:
- Reducer actions (`ADD_TO_CART`, `REMOVE_FROM_CART`, `INCREASE_QUANTITY`, `DECREASE_QUANTITY`, `CLEAR_CART`).
- Cart utility calculations (total unit sum, line subtotal, free shipping thresholds, and INR currency formatting).

---

## 📝 Known Limitations

- **Frontend-Only Scope**: Does not include backend authentication, database servers, or payment gateways. The "Proceed to Checkout" button opens an interactive demonstration modal.
- **Client-Side Stock Simulation**: Stock limits are specified in `products.json` and maintained in client memory.

---

## 📄 License

MIT License. Built for React Developer Internship Assessment.

# kaniksha-assignment
