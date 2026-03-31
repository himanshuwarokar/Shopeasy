# ShopEasy MERN (Local MongoDB)

MERN stack e-commerce project with basic features:
- User register/login with JWT auth
- Product listing and product detail
- Cart management (guest + logged-in user)
- Checkout and order creation
- My orders page
- Admin product CRUD
- Admin order status updates

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT
- Frontend: React + Vite

## Local Setup

1. Make sure local MongoDB server is running:
   - Default URI used: `mongodb://127.0.0.1:27017/shopeasy`

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Seed demo data (optional but recommended):
   ```bash
   npm run seed
   ```

4. Run backend:
   ```bash
   npm run dev
   ```

5. In a new terminal, install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

6. Run frontend:
   ```bash
   npm run dev
   ```

Frontend URL: `http://localhost:5173`  
Backend URL: `http://localhost:5000`

## Demo Admin
- Email: `admin@shopeasy.com`
- Password: `admin123`
