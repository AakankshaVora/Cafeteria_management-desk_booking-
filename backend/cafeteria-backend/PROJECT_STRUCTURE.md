# Cafeteria Backend

A Flask-based REST API backend for managing a cafeteria business.

## Project Overview

This application provides APIs for managing a cafeteria including menu items, orders, user authentication, desk bookings, and customer reviews.

## Technology Stack

- **Framework**: Flask
- **Database**: SQLite
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
cafeteria-backend/
├── cafeteria.db              # SQLite database file
├── requirements.txt          # Python dependencies
├── create_admin_user.py      # Script to create admin user
├── create_test_user.py       # Script to create test users
├── app/                      # Main application directory
│   ├── __init__.py          # Flask app initialization
│   ├── app.py               # Application entry point
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection and setup
│   ├── models/              # Data models
│   │   ├── __init__.py
│   │   ├── user.py          # User model
│   │   ├── menu_item.py     # Menu item model
│   │   ├── order.py         # Order model
│   │   ├── order_item.py    # Order item model
│   │   ├── desk.py          # Desk model
│   │   ├── desk_booking.py  # Desk booking model
│   │   └── review.py        # Review model
│   └── routes/              # API endpoints
│       ├── __init__.py
│       ├── auth.py          # Authentication routes
│       ├── menu.py          # Menu management routes
│       ├── orders.py        # Order management routes
│       └── protected.py     # Protected routes example
```

## Database Models

### User
Manages user accounts with different roles:
- Stores user credentials (hashed passwords)
- Tracks user information (username, email)
- Supports role-based access control

### MenuItem
Represents items available in the cafeteria:
- Contains item details (name, description, price, category)
- Tracks availability status

### Order & OrderItem
Handles order management:
- Order: Main order entity with status tracking
- OrderItem: Individual items within an order with quantities

### Desk
Manages physical desk availability:
- Tracks desk numbers and capacity
- Manages desk status (available/occupied)

### DeskBooking
Handles desk reservations:
- Links users to desks for specific time periods
- Tracks booking dates and duration

### Review
Manages customer feedback:
- Links reviews to users
- Stores ratings and comments

## API Endpoints

### Authentication Routes (`/auth`)
- User registration
- User login
- Token-based authentication

### Menu Routes (`/menu`)
- List all menu items
- Get single menu item
- Add new menu item
- Update menu item
- Delete menu item

### Order Routes (`/orders`)
- Create new order
- View order history
- Update order status
- Order item management

### Protected Routes (`/protected`)
- Example endpoints requiring authentication
- Demonstrates JWT token verification

## Configuration

The application configuration includes:
- Secret key for JWT tokens
- Database connection settings
- Environment-based configuration options

## Getting Started

### Prerequisites
- Python 3.x
- pip package manager

### Installation
1. Install dependencies: `pip install -r requirements.txt`
2. Initialize database: Run the application once
3. Create admin user: `python create_admin_user.py`
4. Create test users: `python create_test_user.py`
5. Start server: `python app/app.py`

## Usage

Access the API at `http://localhost:5000` by default. Use tools like Postman or curl to interact with the endpoints.
