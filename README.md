# 🚀 Learnova - Learning Management System

Learnova is a premium, modern SaaS platform designed to facilitate seamless online learning experiences. Built with a powerful Laravel backend and a high-performance React frontend, it provides tools for course management, instructor/expert applications, and user profile management within a sleek, modern interface.

---

## 🎨 Design Vision
Learnova follows a premium dark-blue aesthetic, incorporating **glassmorphism**, modern **typography**, and a **dynamic design system**. Every interaction is designed to feel fluid and professional, providing a state-of-the-art administrative and learning environment.

---

## ✨ Features

- **🔐 Advanced Authentication**: Secure user management with **JWT Support**.
- **🎓 Course Ecosystem**: Complete lifecycle for creating, hosting, and managing learning content.
- **🛡 Admin Control Center**: Dedicated dashboard for user moderation, course approvals, and application vetting.
- **✍️ Expert & Instructor Portals**: Strategic application processes for content creators.
- **👤 Dynamic Profiles**: Interactive user profiles with customizable settings and media support via **Cloudinary**.
- **📄 Article Hosting**: Modern blogging and knowledge-sharing integration.
- **⚡ Performance-First Architecture**: Built on Vite and Laravel 11 for lightning-fast responsiveness.

---

## 🏗 Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, TypeScript, Vanilla CSS |
| **Backend** | Laravel 11 (PHP 8.2+), JWT Authentication |
| **Database** | SQL Server (Azure SQL Compatible) |
| **Storage** | Cloudinary (Media management) |
| **Tooling** | Composer, NPM, Artisan |

---

## 🛠 Prerequisites

Before starting, ensure you have the following installed:
- **PHP 8.2+**
- **Composer**
- **Node.js 18+ & NPM**
- **SQL Server** (or access to an Azure SQL instance)

---

## 🚀 Getting Started

To run the full Learnova ecosystem, you'll need to set up both the backend and the frontend.

### 1. Backend Setup (`/server`)

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Configure Environment:**
   Copy `.env.example` to `.env` and configure your database credentials and JWT secret.
   ```bash
   cp .env.example .env
   # Update your DB_CONNECTION, DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD
   ```

4. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

5. **Run Migrations & Seeders:**
   ```bash
   php artisan migrate --seed
   ```

6. **Start the server:**
   ```bash
   php artisan serve
   ```
   *The backend will be available at `http://127.0.0.1:8000`.*

### 2. Frontend Setup (`/client`)

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install NPM dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Update your API base URL in `.env` if necessary (e.g., `VITE_API_BASE_URL=http://localhost:8000/api`).

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`.*

---

## 📂 Project Structure

```text
Learnova/
├── client/           # React + Vite + TypeScript Frontend
├── server/           # Laravel 11 Backend API
│   ├── app/          # Models, Controllers, Logic
│   ├── database/     # Migrations, Factories, Seeders
│   └── routes/       # API endpoints (api.php)
└── README.md         # Project documentation
```

---

## 📜 Key Commands

- `php artisan migrate:fresh --seed` - Wipe database and re-seed.
- `php artisan make:controller [Name]` - Create a new backend controller.
- `npm run build` - Generate production build for the frontend.
- `npm run preview` - Preview the built frontend application.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request or open an Issue if you find a bug or have a feature suggestion.

---

## 📄 License
This project is for educational and commercial demonstration purposes. All rights reserved.

<div align="center">
  <br />
  <b>Learnova LMS</b> • Empowering the next generation of online learning.
</div>
