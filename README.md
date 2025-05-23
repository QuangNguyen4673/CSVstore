# stengineering

🧩 Full Stack App with React, Express, and MongoDB
This project is a full-stack application built with:

- Frontend: React (Vite)
- Backend: Express.js (Node.js)
- Database: MongoDB (via Docker)
- Containerized using Docker Compose

🚀 Features

- ✅ Fully Dockerized setup (Frontend, Backend, MongoDB)
- 🔍 Search and Pagination functionality
- 🗃️ CSV upload & validation (Zod)
- 📦 RESTful API for CRUD operations

🛠️ Setup

1. Clone the Repository
   <code> git clone https://github.com/QuangNguyen4673/stengineering.git </code>
   <code> cd STE <c/>ode>
2. Start All Services
   docker-compose up --build

This will:

- Start the MongoDB container
- Build and run the Express server on http://localhost:8000
- Build and serve the React app on http://localhost:5173
