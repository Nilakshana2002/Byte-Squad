# Byte-Squad
🍽️ SmartCanteen

SmartCanteen is a full-stack food ordering system built with React (Vite, Tailwind) on the frontend and Node.js (Express, Sequelize, MySQL) on the backend.
It provides a modern, mobile-friendly ordering experience with powerful admin tools for managing menu items, users, payments, and real-time order collection.

🚀 Features
👥 User Features

Register/login with JWT authentication

Browse active menu items

Place orders with multiple items

Select payment method:

💳 Online (Stripe/PayPal integration ready)

💵 Cash on Pickup

Get a QR code for order collection

Real-time notifications (order status, payment confirmation, pickup alerts)

🛠️ Admin Features

Menu Management

Add/edit/delete items

Upload/manage food images (multiple per item, compression + preview)

User Management

View/search/filter users

Update status (active/inactive/banned)

Bulk operations (ban, deactivate, activate)

View order history per user

Orders Dashboard

Track orders by status (Pending, Preparing, Ready, Completed, No-Show, Cancelled)

Mark orders as preparing/ready/collected

QR Code Scanner

Mobile-friendly QR scanner for order collection

Duplicate scan prevention + order verification

Alert System

Real-time alerts via in-app notifications (SSE)

Email/SMS ready (SMTP configurable)

Separate user and admin alert channels

🖼️ Screenshots
Checkout with Payment Selection	Admin Menu with Image Manager

	
QR Code Scanner	Notifications

	
⚙️ Tech Stack

Frontend

React 18 + Vite

TailwindCSS

React Router v6

Backend

Node.js + Express

Sequelize ORM + MySQL

JWT authentication

Multer (file uploads), Sharp (image optimization)

QRCode (order QR generation)

Notifications

Server-Sent Events (SSE) for real-time updates

📦 Installation
1. Clone Repo
git clone https://github.com/yourusername/smart-canteen.git
cd smart-canteen

2. Backend Setup
cd backend
npm install
cp .env.example .env


Edit .env and configure:

DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=smartcanteen
JWT_SECRET=supersecretkey
CORS_ORIGIN=http://localhost:5173


Run migrations & seed:

npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all


Start API:

npm run dev

3. Frontend Setup
cd ../frontend
npm install
npm run dev


Frontend runs on http://localhost:5173
Backend runs on http://localhost:3000

🔑 Default Accounts

Admin: admin@example.com / admin123

Staff: staff@example.com / staff123

Student: register via /register

🗄️ Database Schema Highlights

users → roles (STUDENT/STAFF/ADMIN), status (ACTIVE/INACTIVE/BANNED), phone

menu_items → food items

food_images → multiple images per menu item

orders → order status, payment_method, payment_status, qr_token, collected_at

payments → method, status, provider fields

notifications → real-time alerts storage

🧪 Testing
Backend
npm run test


Jest + Supertest (unit + integration)

Covers: payments, uploads, users, QR verify, notifications

Frontend
npm run test


React Testing Library + Vitest

🔒 Security Considerations

All admin routes protected with authRequired + role checks

File uploads: MIME whitelist (jpeg/png/webp/avif), ≤2MB, stripped metadata

QR verification idempotent (duplicate scans blocked)

JWT expiration (7 days)

📬 Deployment

Backend: deploy on Heroku, Render, or Docker

Frontend: deploy on Vercel/Netlify

Static uploads folder /uploads can be served via CDN

Use PUBLIC_BASE_URL in .env for absolute URLs
