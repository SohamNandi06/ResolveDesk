# 🎫 Complaint Management System

A robust, full-stack Next.js application designed to streamline the submission and management of support tickets. Features role-based access control (Admin/User), JWT authentication, and automated email notifications.


## 🚀 Live Demo
**[View the Live Application Here](https://resolve-desk.vercel.app/)**

---

## ✨ Key Features

### 👤 User Portal
* **Secure Authentication:** User registration and login using JWT (JSON Web Tokens).
* **Ticket Submission:** Users can submit complaints with Priority (Low/Medium/High) and Category (Product/Service/Support).
* **Profile Management:** Update personal details and view account status.
* **Responsive UI:** Modern, glass-morphism design using Tailwind CSS.

### 🛡️ Admin Dashboard
* **Role-Based Access:** Protected routes restrict access to Admins only. (Instructions on how to become admin is given in page.tsx of register folder near the admin code section)
* **Ticket Oversight:** View all user-submitted tickets in a centralized table.
* **Status Management:** Admins can approve, resolve, or reject tickets.
* **User Management:** View and manage registered users.

---

## 🛠️ Tech Stack
* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Backend:** Next.js API Routes
* **Database:** MongoDB (via Mongoose)
* **Authentication:** JWT (JSON Web Tokens)
* **Email Service:** Nodemailer (SMTP)

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
* [Git](https://git-scm.com/)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance).

---

## 📦 Local Installation & Setup

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
```
### 2. Install Dependencies
```bash
npm install
```
3. Setup Environment VariablesCreate a .env file in the root directory and add the following:Code snippet
```
# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/myDatabase

# Authentication Secret (Generate a random string)
JWT_SECRET=your_super_secret_random_string_here

# Email Configuration (Nodemailer - Gmail Example)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
ADMIN_EMAIL=admin_email@gmail.com

# Base URL (Default for local development)
NEXT_PUBLIC_API_URL=http://localhost:3000
```
4. Run the Development Server
```bash
npm run dev
```
5. Access the App: Open``` http://localhost:3000 ```in your browser
Made by Soham Nandi
