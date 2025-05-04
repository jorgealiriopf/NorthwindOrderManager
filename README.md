# Northwind Order Manager

NorthwindOrderManager is a fullstack application built with React (frontend) and ASP.NET Core (backend) for managing orders from the classic Northwind database. This is a **Database-First** project, so you **must create the database first** using the provided SQL script before running the system.

---

## ⚙️ Prerequisites

### Required software:

- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- [SQL Server (Express or SSMS)](https://aka.ms/ssms)
- [Node.js + npm](https://nodejs.org/)
- (Optional) Visual Studio 2022 or Visual Studio Code

---

## 🗃️ 1. Create the database using the SQL script

1. Open SQL Server Management Studio (SSMS).
2. Run the provided `Northwind.sql` script to create and populate the database.
   - This file includes table definitions and sample data.
3. Make sure the `Northwind` database was successfully created.

---

## 📁 2. Clone the repository

```bash
git clone https://github.com/jorgealiriopf/NorthwindOrderManager.git
cd NorthwindOrderManager
```

---

## 🔙 3. Backend (.NET API)

1. Navigate to the backend:

```bash
cd NorthwindOrderManager/NorthwindOrderManager-Backend
```

2. Restore dependencies:

```bash
dotnet restore
```

3. Check your connection string in `NorthwindOrderManager.API/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=Northwind;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

4. **This project does not use migrations to create the database**. Since it follows a **Database-First** approach, Entity Framework will read the existing database schema.

5. Run the API:

```bash
cd NorthwindOrderManager.API
dotnet run
```

> By default, it runs at `http://localhost:5027`.

---

## 🌐 4. Frontend (React + Vite)

1. In another terminal:

```bash
cd NorthwindOrderManager/NorthwindOrderManager-Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with the following content:

```env
VITE_API_BASE_URL=http://localhost:5027/api
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

> 🔑 Make sure your API key has **Maps JavaScript API** enabled in Google Cloud Console.

4. Run the app:

```bash
npm run dev
```

---

## 🚀 You're all set!

- Backend Swagger: http://localhost:5027/swagger
- Frontend React: http://localhost:5173

---

## ✅ App Features

- View orders, customers, employees, and shippers
- Create and update orders
- Add order lines with products
- Address validation using Google Maps
- Export order reports as PDF (with static map)
- Responsive UI and error handling