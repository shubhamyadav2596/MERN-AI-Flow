# AI Flow Builder

A MERN stack application that integrates React Flow and the OpenRouter API to create a visual, node-based interface for AI prompt generation. 

## 🚀 Features
* **Visual Interface:** Uses React Flow to display connected nodes for user input and AI output.
* **AI Integration:** Securely connects to OpenRouter via the backend to fetch responses from free AI models.
* **Database Storage:** Saves user prompts and AI responses directly to a MongoDB database with a single click.
* **Modern Stack:** Built with MongoDB, Express.js, React (Vite), and Node.js.

## 🛠️ Tech Stack
* **Frontend:** React, React Flow, Axios, Vite
* **Backend:** Node.js, Express.js, Mongoose, node-fetch
* **Database:** MongoDB (Atlas/Local)
* **AI API:** OpenRouter (Model: `google/gemini-2.0-flash-lite-preview-02-05:free`)

## 📋 Prerequisites
Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
* An [OpenRouter API Key](https://openrouter.ai/)

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/mern-react-flow-app.git](https://github.com/your-username/mern-react-flow-app.git)
cd mern-react-flow-app
```


### 2. Backend Setup
Navigate to the backend directory and install dependencies:

#### Bash
cd backend
npm install
Create a .env file in the backend directory and add your credentials:

#### Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
OPENROUTER_API_KEY=your_openrouter_api_key_here

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:

#### Bash
cd ../frontend
npm install
🏃‍♂️ Running the Application
You will need two terminal windows to run the frontend and backend simultaneously.

## Terminal 1 (Backend):

#### Bash
cd backend
npm start 
# Note: Ensure your package.json has "type": "module" enabled for ES6 imports.
Terminal 2 (Frontend):

#### Bash
cd frontend
npm run dev
Open your browser and navigate to the localhost URL provided by Vite (usually http://localhost:5173).

# 🌐 Links & Deliverables
Frontend Deployment: [Insert Vercel/Netlify/Render Link Here]

Backend API: [Insert Heroku/Render Link Here]

Video Demo: [Insert Loom/YouTube Link Here]

Developed as a MERN App Developer Task.
