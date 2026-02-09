# 💻 Cafeteria & Desk Booking System - Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

The modern, responsive frontend for the Cafeteria Management and Desk Booking System. Built with **React** and **Vite**, styled with **Tailwind CSS**.

## 📖 Table of Contents
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚙️ Setup & Installation](#️-setup--installation)
- [📂 Folder Structure](#-folder-structure)
- [📱 Pages & Routing](#-pages--routing)
- [🧪 Testing](#-testing)

---

## ✨ Features
*   **Role-Based Dashboards**: Custom views for Employees, Cafeteria Admins, and Desk Admins.
*   **Smart Desk Booking**:
    *   Visual desk selection.
    *   **Real-time Locking**: See "Held" desks instantly.
    *   Countdown timer for finishing bookings.
*   **Food Ordering**:
    *   Browse menu with categories.
    *   Cart management.
    *   Schedule orders for later time.
*   **Responsive Design**: Mobile-friendly UI with Tailwind CSS.
*   **Secure Auth**: JWT integration with automatic token attached to requests.

---

## 🛠️ Tech Stack
| Component | Technology |
| :--- | :--- |
| **Framework** | React 18+ |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Routing** | React Router DOM v6 |
| **State/Auth** | React Context API |
| **HTTP Client** | Axios |
| **Icons** | Lucide React |
| **Notifications** | React Toastify |
| **Testing** | Vitest + React Testing Library |

---

## ⚙️ Setup & Installation

### Option 1: Docker (Recommended)
Run as part of the full stack:
```bash
docker-compose up --build
```
Access at `http://localhost:5173`.

### Option 2: Local Development
1.  **Install Dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

---

## 📂 Folder Structure

```text
src/
├── assets/          # Static images and icons
├── auth/            # Auth context and protected routes
├── components/      # Reusable UI components (Buttons, Modals, Cards)
├── context/         # Global state (Confirmation, Cart)
├── layouts/         # Page layouts (Navbar, Sidebar)
├── pages/           # Application views
│   ├── login/       # Login, Register, Forgot Password
│   ├── employee/    # Employee Dashboard, Booking, Ordering
│   ├── cafeteria/   # Admin Menu & Order Management
│   ├── desk/        # Admin Desk Management
│   └── common/      # Profile, 404
├── routes/          # Route definitions per role
├── services/        # API service configurations (Axios)
└── utils/           # Helper functions
```

---

## 📱 Pages & Routing

### Public
*   `/login`: User Login
*   `/register`: Employee Registration
*   `/forgot-password`: Password reset request

### Employee (`/employee`)
*   `/employee`: **Dashboard** - Daily summary, actions.
*   `/employee/book-desk`: **Desk Booking** - Interactive map to book desks.
*   `/employee/order-food`: **Order Food** - Menu browsing and cart.
*   `/employee/my-orders-bookings`: **History** - View past orders and bookings.

### Cafeteria Admin (`/cafeteria`)
*   `/cafeteria`: **Dashboard** - Revenue and order stats.
*   `/cafeteria/menu`: **Manage Menu** - Add/Edit/Delete items.
*   `/cafeteria/orders`: **Order Queue** - Process incoming orders.

### Desk Admin (`/desk`)
*   `/desk`: **Dashboard** - Usage stats.
*   `/desk/status`: **Desk Management** - Enable/Disable desks (maintenance).

---

## 🧪 Testing
We use **Vitest** for unit and component testing.

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui
```
