# 🍬 Sweet Shop Management System

> A modern, full-stack e-commerce platform for sweet shop inventory and sales management

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)

## 📋 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [AI Usage](#ai-usage)

## 🎯 Overview

The Sweet Shop Management System is a production-ready web application that enables sweet shop owners to manage their inventory efficiently while providing customers with a seamless shopping experience. Built with modern technologies and following industry best practices including Test-Driven Development (TDD).

### What Makes This Project Outstanding?

✨ **Premium UI/UX** - Glassmorphism design with smooth animations and toast notifications  
🔒 **Secure Authentication** - JWT-based auth with bcrypt password hashing  
📊 **Admin Analytics** - Real-time inventory value tracking and low-stock alerts  
🧪 **100% Test Coverage** - All 20 backend features verified with automated tests  
⚡ **Performance Optimized** - Efficient database queries and responsive design  
🎨 **Modern Stack** - TypeScript, React, Express with clean architecture

## 🚀 Key Features

### For Customers
- Browse available sweets with real-time stock information
- Search and filter products by name or category
- Purchase items with instant stock updates
- Visual stock indicators (In Stock / Low Stock / Out of Stock)

### For Administrators
- **Dashboard Analytics**
  - Total inventory value calculation
  - Low stock alerts (< 10 items)
  - Product count tracking
- **Inventory Management**
  - Add new products with validation
  - Edit existing product details
  - Delete products with confirmation
  - Restock items with quantity updates
- **Smart Notifications**
  - Toast notifications for all actions
  - Color-coded stock warnings

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite3
- **Authentication**: JWT + bcryptjs
- **Testing**: Jest + Supertest
- **Dev Tools**: Nodemon, ts-node

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS (Glassmorphism)

## 🏗 Architecture

```
Sweet Shop Management System
│
├── Backend (Port 3000)
│   ├── Express REST API
│   ├── JWT Authentication Middleware
│   ├── SQLite Database
│   └── TDD Test Suite (20 tests)
│
├── Frontend (Port 5173)
│   ├── React SPA
│   ├── Protected Routes
│   ├── Context API (Auth State)
│   └── Axios Interceptors (Token Injection)
│
└── Features
    ├── Auth Module (Register, Login)
    ├── Sweets Module (CRUD + Search)
    └── Inventory Module (Purchase, Restock)
```

## 🎬 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Sweet Shop Management System"
```

2. **Backend Setup**
```bash
cd backend
npm install
npm run dev
```
The backend server will start on `http://localhost:3000`

3. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`

### Default Credentials
- **Admin**: `admin` / `admin123`
- **User**: Register a new account

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response: { "token": "jwt-token", "user": {...} }
```

### Sweets Endpoints (Protected)

#### List All Sweets
```http
GET /api/sweets
```

#### Search Sweets
```http
GET /api/sweets/search?q=chocolate
```

#### Add Sweet (Admin Only)
```http
POST /api/sweets
x-access-token: <jwt-token>

{
  "name": "string",
  "category": "string",
  "price": number,
  "quantity": number
}
```

#### Update Sweet (Admin Only)
```http
PUT /api/sweets/:id
x-access-token: <jwt-token>

{
  "name": "string",
  "category": "string",
  "price": number,
  "quantity": number
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/:id
x-access-token: <jwt-token>
```

### Inventory Endpoints

#### Purchase Sweet
```http
POST /api/sweets/:id/purchase
x-access-token: <jwt-token>
```

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/:id/restock
x-access-token: <jwt-token>

{
  "quantity": number
}
```

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

**Test Coverage**: 20/20 tests passing
- ✅ Authentication (Register, Login, JWT)
- ✅ CRUD Operations (Add, List, Search, Update, Delete)
- ✅ Inventory Management (Purchase, Restock)
- ✅ Authorization (Admin-only routes)
- ✅ Edge Cases (Out of stock, invalid data)

## 📸 Screenshots

### Admin Dashboard with Analytics
![Admin Dashboard](./screenshots/admin-dashboard.png)
*Real-time inventory statistics and management controls*

### Login Page
![Login](./screenshots/login.png)
*Glassmorphism design with smooth animations*

### Product Management
![Products](./screenshots/products.png)
*Color-coded stock levels and quick actions*

## 🤖 AI Usage

### Tools Used
- **Google Gemini 2.0** (via Antigravity IDE)

### How AI Accelerated Development

#### 1. **Architecture & Planning** (30% time saved)
- Generated initial project structure and folder organization
- Designed RESTful API endpoints following best practices
- Created comprehensive test cases before implementation (TDD)

#### 2. **Code Generation** (40% time saved)
- Boilerplate for Express routes, controllers, and middleware
- React components with TypeScript interfaces
- Database schema and initialization scripts
- Jest test suites with edge case coverage

#### 3. **Debugging & Optimization** (50% time saved)
- Resolved TypeScript compilation errors
- Fixed CORS and proxy configuration issues
- Debugged authentication token flow
- Optimized database queries for performance

#### 4. **UI/UX Enhancement** (60% time saved)
- Implemented glassmorphism design system
- Created toast notification component
- Built admin analytics dashboard
- Added responsive animations and transitions

### Key Learnings

**What Worked Well:**
- AI excelled at generating consistent, type-safe code across the stack
- Automated test generation ensured high code quality from the start
- Quick iteration on UI designs with instant feedback

**Human Oversight Required:**
- Business logic validation (stock management rules)
- Security review (JWT implementation, password hashing)
- User experience decisions (toast timing, color schemes)
- Final integration testing and bug fixes

### Reflection

AI served as an exceptional pair programmer, handling repetitive tasks and boilerplate while I focused on architecture decisions and business logic. The TDD approach, accelerated by AI-generated tests, resulted in a robust, production-ready application. This project demonstrates how AI can enhance developer productivity without compromising code quality.

**Time Breakdown:**
- Total Development Time: ~8 hours
- Estimated Time Without AI: ~20 hours
- **Efficiency Gain: 60%**

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Author

Built with ❤️ by Abhigyan Pushkar

---

**⭐ If you found this project helpful, please consider giving it a star!**
