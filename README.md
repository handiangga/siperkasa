# 🚀 **SIPERKASA (Fullstack)**

### Sistem Informasi Perkara Jaksa

Aplikasi fullstack untuk mengelola **SPDP, Perkara, dan Penunjukan Jaksa (P16)** berbasis role dalam lingkungan kejaksaan.

---

## 🌐 Demo Concept

> Sistem ini mensimulasikan workflow nyata:

```text
SPDP → Perkara → P16 → Jaksa
```

---

# 🧩 Architecture

```id="arsitektur"
Frontend (React + Vite)
        ↓
REST API (Express)
        ↓
Database (PostgreSQL)
```

---

# 🛠 Tech Stack

## 🔹 Frontend

* React (Vite)
* Tailwind CSS
* Axios
* React Router DOM
* SweetAlert2
* React Icons

## 🔹 Backend

* Node.js
* Express
* Sequelize ORM
* PostgreSQL
* JWT Authentication
* Bcrypt

---

# ✨ Features

## 🔐 Authentication & Authorization

* Login dengan JWT
* Role-based system:

  * 👑 Admin
  * 🟣 Kajari
  * 🔵 Operator
  * 🟢 Jaksa

---

## ⚖️ Core Features

### 📄 SPDP

* CRUD SPDP
* Search + highlight
* Pagination
* Auto create Perkara

### 📁 Perkara

* Tracking status perkara
* Relasi ke SPDP

### 👨‍⚖️ Jaksa

* CRUD Jaksa
* Detail Jaksa → lihat P16

### 🧾 P16 Assignment

* Assign multi jaksa
* Validasi jaksa utama

### 👤 User Management

* Role system
* Mapping user ↔ jaksa

---

## 🎯 UI Features (Frontend)

* 🔍 Global search + debounce
* ✨ Highlight keyword
* 📄 Pagination
* 🎨 Premium UI (Tailwind)
* 🔐 Role-based UI (hide button)
* 🧭 Navigation layout system
* 👤 Dynamic user header
* ⚡ Fast SPA (Vite)

---

# 🔐 Role Access Matrix

| Feature     | Admin | Kajari | Operator | Jaksa |
| ----------- | ----- | ------ | -------- | ----- |
| View Data   | ✅     | ✅      | ✅        | ✅     |
| Create Data | ✅     | ❌      | ✅        | ❌     |
| Edit Data   | ✅     | ❌      | ✅        | ❌     |
| Delete Data | ✅     | ❌      | ❌        | ❌     |
| Manage User | ✅     | ❌      | ❌        | ❌     |

---

# 📌 API Endpoints (Backend)

## 🔹 Auth

```http
POST /users/login
POST /users/register
```

## 🔹 SPDP

```http
GET /spdps
POST /spdps
PUT /spdps/:id
DELETE /spdps/:id
```

## 🔹 Perkara

```http
GET /perkaras
GET /perkaras?page=1&limit=5
GET /perkaras?search=andi
```

## 🔹 Jaksa

```http
GET /jaksas
POST /jaksas
```

## 🔹 P16

```http
POST /p16
GET /p16
GET /p16/jaksa/:id
```

## 🔹 User

```http
GET /users
DELETE /users/:id
```

---

# 📂 Project Structure

```id="structure-full"
siperkasa/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── app.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── routes/
│   │   ├── hooks/
│   │   └── services/
│   └── vite.config.js
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/your-username/siperkasa.git
cd siperkasa
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

### 🔐 ENV

```env
PORT=3000
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=siperkasa
DB_HOST=localhost
JWT_SECRET=secret
```

### 🔧 Database

```bash
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
```

### ▶️ Run Backend

```bash
npm run dev
```

---

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 🧠 System Flow

```id="flow-full"
User Login → Dashboard  
↓  
Input SPDP  
↓  
Auto Create Perkara  
↓  
Assign P16 (Jaksa)  
↓  
Jaksa melihat perkara miliknya  
```

---

# 🔥 Highlights

* Fullstack architecture (FE + BE terintegrasi)
* Clean MVC backend
* Role-based UI + API security
* Relational database design (FK)
* Scalable structure
* Production-ready UI

---

# 🚀 Future Improvements

* 📊 Dashboard analytics (chart real data)
* 🔔 Notifikasi perkara
* 📎 Upload dokumen
* 🔐 Refresh token
* 👤 Profile & change password
* 📱 Mobile responsive improvement

---

# 👨‍💻 Author

**Handi Angga**
Fullstack Developer 🚀

---
