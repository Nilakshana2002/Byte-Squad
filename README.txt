Smart Canteen System  
====================

This project is a MERN + MySQL application for managing canteen orders.  
It includes authentication, menu management, ordering with QR codes, and role-based access for Admins, Staff, and Students.

------------------------------------------------------------
1. REQUIREMENTS
------------------------------------------------------------
- Node.js v18 or later
- MySQL running locally on port 3306
- Git (optional, if cloned from repository)

------------------------------------------------------------
2. DATABASE SETUP
------------------------------------------------------------
1. Open MySQL:
   mysql -u root -p

2. Create database:
   CREATE DATABASE canteen;

3. (Optional) Verify database exists:
   SHOW DATABASES;

------------------------------------------------------------
3. BACKEND SETUP
------------------------------------------------------------
1. Navigate to backend folder:
   cd backend

2. Copy .env.example to .env and edit values if needed:
   MYSQL_URL=mysql://root:root@localhost:3306/canteen
   JWT_SECRET=replace_me
   PORT=3000
   CORS_ORIGIN=http://localhost:5173

3. Install dependencies:
   npm install

4. Run migrations and seeders:
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all

5. Start backend:
   npm run dev

   API will be available at: http://localhost:3000

------------------------------------------------------------
4. FRONTEND SETUP
------------------------------------------------------------
1. Navigate to frontend folder:
   cd frontend

2. Copy .env.example to .env and edit values if needed:
   VITE_API_URL=http://localhost:3000

3. Install dependencies:
   npm install

4. Start frontend:
   npm run dev

   Frontend will be available at: http://localhost:5173

------------------------------------------------------------
5. DEFAULT ACCOUNTS
------------------------------------------------------------
Admin
  Email: admin@canteen.local
  Password: admin123

Student
  Email: student@canteen.local
  Password: student123

------------------------------------------------------------
6. USAGE NOTES
------------------------------------------------------------
- Run backend first, then frontend.
- If node_modules is missing, run npm install.
- If database errors occur, check .env configuration and ensure MySQL is running.
- Orders generate QR codes that can be shown at pickup.
- Role-based access:
  - Students: Place orders
  - Staff: Manage kitchen orders
  - Admin: Full access (menu, kitchen, user roles)

------------------------------------------------------------
7. EXPORTING / SHARING
------------------------------------------------------------
When sharing this project:
- Do NOT include node_modules or dist folders.
- Only send source code, package.json, and this README.txt.
- Recipient can run npm install to restore dependencies.

------------------------------------------------------------

✅ Smart Canteen System is now ready to use.
