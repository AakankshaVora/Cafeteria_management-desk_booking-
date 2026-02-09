# 🍽️ Cafeteria & Desk Booking System - Backend

![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

A robust RESTful API built with **Flask** and **PostgreSQL** for managing cafeteria orders and desk bookings.

## 📖 Table of Contents
- [Setup & Installation](#-setup--installation)
- [Authentication](#-authentication)
- [API Reference](#-api-reference)
  - [Auth](#1-authentication-auth)
  - [Desk Booking](#2-desk-booking-desk-bookings)
  - [Desks](#3-desks-desks)
  - [Menu](#4-menu-menu)
  - [Orders](#5-orders-orders)
  - [Dashboard](#6-dashboard-dashboard)
  - [Reports](#7-reports-reports)
  - [Reviews](#8-reviews-reviews)

---

## ⚙️ Setup & Installation

### Docker (Recommended)
```bash
docker-compose up --build
```
The API will be available at `http://localhost:5000`.

### Local Development
1.  **Install Dependencies**: `pip install -r requirements.txt`
2.  **Set Env Vars**: create `.env` with `DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET_KEY`.
3.  **Run**: `python run.py`

---

## 🔐 Authentication
Used **Bearer Token** authentication.
Header: `Authorization: Bearer <your_token>`

---

## 📡 API Reference

### 1. Authentication (`/auth`)

#### `POST /auth/login`
User login.
<details>
<summary>Details</summary>

**Body:**
```json
{
  "email": "employee@example.com",
  "password": "password123"
}
```
**Response (200 OK):**
```json
{
  "message": "Login successful",
  "access_token": "eyJ0...",
  "user": { "id": 1, "email": "employee@example.com", "role": "employee" }
}
```
</details>

#### `POST /auth/register`
Register a new employee.
<details>
<summary>Details</summary>

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee"
}
```
**Response (201 Created):**
```json
{ "message": "Registration successful. Please login." }
```
</details>

#### `GET /auth/profile`
Get current user profile.
<details>
<summary>Details</summary>

**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee",
  "created_at": "2026-01-01"
}
```
</details>

#### `PUT /auth/profile`
Update profile name.
<details>
<summary>Details</summary>

**Body:**
```json
{ "name": "Johnathan Doe" }
```
**Response:**
```json
{ "message": "Profile updated successfully", "user": { ... } }
```
</details>

---

### 2. Desk Booking (`/desk-bookings`)

#### `POST /desk-bookings/hold`
**[Locking]** Hold a desk for 5 minutes.
<details>
<summary>Details</summary>

**Body:**
```json
{
  "desk_id": 5,
  "booking_date": "2026-02-10"
}
```
**Response (201 Created):**
```json
{
  "message": "Desk held successfully",
  "booking_id": 102,
  "expires_in_seconds": 300
}
```
</details>

#### `POST /desk-bookings`
Confirm a booking (using hold ID) or book directly.
<details>
<summary>Details</summary>

**Body (Confirm Hold):**
```json
{ "booking_id": 102 }
```
**Body (Direct Book):**
```json
{
  "desk_id": 5,
  "booking_date": "2026-02-10"
}
```
**Response:**
```json
{ "message": "Booking confirmed successfully" }
```
</details>

#### `GET /desk-bookings/my`
Get logged-in user's bookings.
<details>
<summary>Details</summary>

**Response:**
```json
[
  {
    "id": 102,
    "desk_code": "D1",
    "location": "Floor 1",
    "booking_date": "2026-02-10",
    "status": "booked"
  }
]
```
</details>

#### `DELETE /desk-bookings/<id>`
Cancel a booking.
<details>
<summary>Details</summary>

**Response:**
```json
{ "message": "Booking cancelled successfully" }
```
</details>

---

### 3. Desks (`/desks`)

#### `GET /desks`
Get all desks with status for a specific date.
<details>
<summary>Details</summary>

**Query Params:** `date=YYYY-MM-DD`, `start_time=HH:MM`, `end_time=HH:MM`
**Response:**
```json
[
  {
    "id": 1,
    "desk_code": "D1",
    "location": "Quiet Zone",
    "status": "available", 
    "booked_by": "-" 
  },
  {
    "id": 2,
    "desk_code": "D2",
    "status": "Held",
    "booked_by": "Jane Doe"
  }
]
```
</details>

#### `POST /desks`
**[Admin]** Create a new desk.
<details>
<summary>Details</summary>

**Body:**
```json
{
  "desk_code": "D-101",
  "location": "Floor 2"
}
```
</details>

#### `PUT /desks/<id>/status`
**[Admin]** Update desk status (e.g., maintenance).
<details>
<summary>Details</summary>

**Body:**
```json
{ "status": "maintenance" }
```
</details>

---

### 4. Menu (`/menu`)

#### `GET /menu`
Get all menu items.
<details>
<summary>Details</summary>

**Response:**
```json
[
  {
    "id": 1,
    "name": "Burger",
    "price": 5.99,
    "is_available": true,
    "is_special": true
  }
]
```
</details>

#### `POST /menu`
**[Admin]** Add menu item.
<details>
<summary>Details</summary>

**Body:**
```json
{
  "name": "Pizza",
  "description": "Cheese Pizza",
  "price": 8.99,
  "is_available": true
}
```
</details>

#### `PUT /menu/<id>/special`
**[Admin]** Set item as Today's Special.
<details>
<summary>Details</summary>

**Response:**
```json
{ "message": "'Pizza' is now Today's Special" }
```
</details>

---

### 5. Orders (`/orders`)

#### `POST /orders`
Place a food order.
<details>
<summary>Details</summary>

**Body:**
```json
{
  "items": [
    { "item_id": 1, "quantity": 2 }
  ],
  "scheduled_time": "2026-02-10T12:30:00"
}
```
**Response:**
```json
{
  "message": "Order placed successfully",
  "order_id": 55,
  "total_amount": 11.98
}
```
</details>

#### `GET /orders/my`
Get my orders.
<details>
<summary>Details</summary>

**Response:**
```json
{
  "orders": [
    {
      "id": 55,
      "status": "pending",
      "total_amount": 11.98,
      "items": [...]
    }
  ]
}
```
</details>

#### `PUT /orders/<id>/status`
**[Admin]** Update order status (`pending`, `completed`, `cancelled`).
<details>
<summary>Details</summary>

**Body:**
```json
{ "status": "completed" }
```
</details>

---

### 6. Dashboard (`/dashboard`)

#### `GET /dashboard/daily-summary`
**[Employee]** Get daily briefing card.
<details>
<summary>Details</summary>

**Response:**
```json
{
  "next_action": {
    "type": "start_day",
    "title": "Plan your day 🚀",
    "action_text": "Book Desk",
    "link": "/employee/book-desk"
  },
  "pending_orders_count": 0,
  "special_dish": { "name": "Pizza", ... }
}
```
</details>

#### `GET /dashboard/admin-stats`
**[Admin]** Get widget stats.
<details>
<summary>Details</summary>

**Response:**
```json
{
  "widgets": {
    "total_orders": 150,
    "revenue": "1,200",
    "completed": 140
  },
  "top_items": [...]
}
```
</details>

---

### 7. Reports (`/reports`)

#### `GET /reports/revenue`
**[Admin]** Get revenue details.
<details>
<summary>Details</summary>

**Response:**
```json
{
  "total_revenue": 5000.50,
  "today_revenue": 120.00
}
```
</details>

---

### 8. Reviews (`/reviews`)

#### `POST /reviews`
Submit feedback.
<details>
<summary>Details</summary>

**Body:**
```json
{
  "rating": 5,
  "feedback": "Great food!"
}
```
</details>
