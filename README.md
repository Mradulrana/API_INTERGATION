# Beauty API Project

This project is a Node.js-based backend with a static frontend that provides an API service for beauty-related queries. The frontend is served as a static site alongside the backend, offering a seamless user experience.

---

## Project Structure

```plaintext
/backend
    ├── public/              # Frontend assets
    │   ├── assets/          # Static assets (images, fonts, etc.)
    │   ├── index.html       # Main HTML file
    │   ├── style.css        # Stylesheet for the frontend
    │   └── script.js        # Client-side JavaScript
    ├── server.mjs           # Main Node.js backend file
    ├── package.json         # Node.js dependencies and scripts
    └── .env                 # Environment variables

/node_modules                # Installed Node.js packages


Backend Project Documentation
This document provides an overview of the project, along with detailed instructions for setup, installation, and usage.

Project Overview
This is a Node.js-based backend application that integrates with OpenAI APIs and other services, providing functionalities for query classification and handling API requests.

Project Structure
bash
Copy code
backend/
├── server.mjs        # Entry point for the application
├── .env              # Environment variables
├── package.json      # Project metadata and dependencies
├── node_modules/     # Installed dependencies
Prerequisites
Ensure the following are installed on your system:

Node.js (version >= 14)

Download and install Node.js.
npm (Node Package Manager, comes with Node.js).

Installation
Follow these steps to set up the project:

1. Clone the Repository
Run this command to clone the repository:

bash
Copy code
git clone <repository-url>
cd backend
2. Install Dependencies
Install the required Node.js packages using:

bash
Copy code
npm install
3. Configure Environment Variables
Create a .env file in the backend directory. Example:

makefile
Copy code
PORT=3000
OPENAI_API_KEY=your_openai_api_key
Replace your_openai_api_key with your actual OpenAI API key.

Usage
1. Start the Server
Run the following command to start the server:

bash
Copy code
npm start
The server will be available at:

arduino
Copy code
http://localhost:<PORT>
Replace <PORT> with the value defined in your .env file (default: 3000).

2. Testing the API
Use tools like Postman or curl to test the API endpoints. Example:

bash
Copy code
curl -X POST http://localhost:3000/api/classify -H "Content-Type: application/json" -d '{"query": "test query"}'
Commands
Command	Description

Install Dependencies with Versions:
Dependency	Command to Install
axios	npm install axios@^1.7.7
body-parser	npm install body-parser@^1.20.3
cors	npm install cors@^2.8.5
dotenv	npm install dotenv@^16.4.5
express	npm install express@^4.21.1
node-fetch	npm install node-fetch@^2.7.0
open	npm install open@^8.4.0
openai	npm install openai@^4.73.0
Environment Variables
Define the following variables in your .env file:

Variable	Description
PORT	Port number where the server will run.
OPENAI_API_KEY	Your OpenAI API key for authentication.
API Endpoints
POST /api/classify
Handles query classification.

Request Body:

json
Copy code
{
  "query": "your_query_here"
}
Response Example:

json
Copy code
{
  "valid": true,
  "category": "Beauty",
  "gptResponse": "This is the result from OpenAI."
}
