# CSV store app
This app reads csv and store the data under MongoDB for use

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

🛠️ Run the project:

docker-compose up --build

This will:

- Start the MongoDB container
- Build and serve the React app on http://localhost:5173
- Build and run the Express server on http://localhost:8000

Note: use this csv for the happy case upload https://github.com/QuangNguyen4673/CSVstore/blob/main/client/public/data.csv

