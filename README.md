# 🧭 LocalGuide - Local Tourism & Experience Booking Platform

**LocalGuide** is a beginner-friendly full-stack MERN application that connects travelers directly with passionate local guides for authentic walking tours, culinary trails, and outdoor adventures.

---

## 🌟 Key Features

- **Local MongoDB Database**: Fully local connection (`mongodb://127.0.0.1:27017/localguide`) with no third-party cloud database dependencies. Inspectable with MongoDB Compass.
- **Pay at Venue**: Bookings are immediately confirmed on creation with **$0 upfront payment**; payment is collected by the guide at the venue.
- **Server-Side Price Validation**: `totalPrice` is strictly calculated on the server (`price * guests`) to prevent client-side tampering.
- **Group Capacity & Future Date Checks**: Server ensures booking dates are strictly in the future and guest count does not exceed `maxGroupSize`.
- **Verified Reviews**: Tourists can only submit reviews for tours they have genuinely booked. The average rating and review count are dynamically recalculated after each submission.
- **Local Static File Uploads**: Image uploads are handled by Multer, stored locally in `server/uploads/`, and served statically via Express (`/uploads/...`).
- **Role-Based Access Control**:
  - **Tourists**: Browse tours, search/filter, book experiences, cancel reservations, leave verified reviews.
  - **Guides**: Host and manage own experiences (CRUD with local photo uploads), view received guest bookings with total earnings.
  - **Admins**: Supervise all registered users, delete accounts, and moderate experiences.

---

## 📁 Project Architecture

```text
VAC MERN project/
├── client/                     # Frontend (React 18 + Vite + Plain CSS)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ExperienceCard, SearchBar, FilterBar,
│   │   │                       # BookingForm, ReviewForm, ReviewCard, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT + localStorage), ToastContext
│   │   ├── pages/              # Home, Experiences, ExperienceDetails, Login, Register,
│   │   │                       # MyBookings, GuideDashboard, AdminDashboard
│   │   ├── services/           # Axios client with bearer token interceptor
│   │   ├── App.jsx             # Main router with protected routes
│   │   ├── index.css           # Modern design system (tokens, glassmorphism, responsive)
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js          # Vite config with API and static upload proxy
│
└── server/                     # Backend (Node.js + Express + Mongoose)
    ├── config/                 # MongoDB database connection (db.js)
    ├── controllers/            # authController, experienceController, bookingController,
    │                           # reviewController, userController
    ├── middleware/             # auth.js (protect, authorizeRoles), upload.js (Multer), error.js
    ├── models/                 # User.js, Experience.js, Booking.js, Review.js
    ├── routes/                 # authRoutes, experienceRoutes, bookingRoutes, reviewRoutes, userRoutes
    ├── uploads/                # Local static images served via /uploads
    ├── .env                    # Environment configuration
    ├── package.json
    ├── seed.js                 # Seed script with test users, 8 tours, bookings, and reviews
    └── server.js               # Express application entrypoint
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or higher (tested on Node v24)
- **MongoDB**: Running locally on `127.0.0.1:27017`

### 2. Environment Variables Configuration

The server configuration file is located at `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/localguide
JWT_SECRET=localguide_jwt_secret_super_secure_key_2026
NODE_ENV=development
```

---

### 3. Installation Steps

#### Install Backend Dependencies:
```bash
cd server
npm install
```

#### Install Frontend Dependencies:
```bash
cd ../client
npm install
```

---

### 4. Seed Database with Sample Data

Run the seed script from the `server/` directory to create test accounts, 8 diverse experiences, bookings, reviews, and local SVG visual assets:

```bash
cd server
npm run seed
```
*(or `node seed.js`)*

---

### 5. Running the Application

Open two terminal windows:

#### Terminal 1 (Start Backend Server):
```bash
cd server
npm start
```
*Backend will run at: `http://localhost:5000`*

#### Terminal 2 (Start Frontend Dev Server):
```bash
cd client
npm run dev
```
*Frontend will run at: `http://localhost:5173`*

Open **`http://localhost:5173`** in your browser to experience LocalGuide!

---

## 🔑 Test Accounts

All pre-seeded test accounts share the same password: **`password123`**

| Role | Name | Email | Password | Access Capabilities |
|---|---|---|---|---|
| **Admin** | Elena Rostova | `admin@localguide.com` | `password123` | Full admin panel, user management, tour moderation |
| **Guide** | Marco Rossi | `marco.guide@localguide.com` | `password123` | Guide dashboard, create/edit/delete tours, view bookings |
| **Guide** | Sarah Jenkins | `sarah.guide@localguide.com` | `password123` | Guide dashboard, create/edit/delete tours, view bookings |
| **Tourist** | Alice Walker | `alice@traveler.com` | `password123` | Book tours, view/cancel reservations, leave verified reviews |
| **Tourist** | Bob Martin | `bob@traveler.com` | `password123` | Book tours, view/cancel reservations, leave verified reviews |

> 💡 **Tip**: On the **Login** page (`/login`), click the quick demo buttons (*Tourist*, *Guide*, or *Admin*) to autofill credentials with a single click.

---

## 📡 API Reference

### Authentication
- `POST /api/auth/register` - Register a new user (tourist | guide)
- `POST /api/auth/login` - Authenticate user & get JWT token
- `GET /api/auth/me` - Fetch currently authenticated user profile

### Experiences
- `GET /api/experiences` - Search, filter (category, location, price), and sort tours
- `GET /api/experiences/:id` - Fetch single experience with guide details
- `POST /api/experiences` - Create experience with Multer local image upload *(Guide/Admin)*
- `PUT /api/experiences/:id` - Update owned experience *(Guide/Admin)*
- `DELETE /api/experiences/:id` - Delete experience and associated records *(Guide/Admin)*

### Bookings
- `POST /api/bookings` - Create booking (*Server-calculated price, Pay at Venue*)
- `GET /api/bookings/my` - Get logged-in user's bookings
- `PUT /api/bookings/:id/cancel` - Cancel own booking
- `GET /api/bookings/guide` - Get bookings for guide's hosted tours *(Guide/Admin)*

### Reviews
- `POST /api/reviews` - Add review (*Requires prior booking, recalculates average rating*)
- `GET /api/reviews/:experienceId` - Get all reviews for an experience

### Admin Management
- `GET /api/users` - List all registered users *(Admin only)*
- `DELETE /api/users/:id` - Delete user and associated records *(Admin only)*
