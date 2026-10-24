EventEase – Workshop Registration System

EventEase is a web-based workshop registration platform designed to help students discover technical workshops, register for events, and manage participation. Administrators can manage workshops and view registered attendees through an admin dashboard.

The project is built using the MERN stack and provides a responsive interface, REST API, and MongoDB database integration.

Features

Participant Features

* Browse upcoming technical workshops.
* Search workshops by title, category, or venue.
* View workshop descriptions, dates, times, and locations.
* Check available seats and registration status.
* Register for workshops using a name and email address.
* Receive feedback about registration success or failure.

Administrator Features

* Log in through the administrator interface.
* Create and manage workshops.
* View registered participants.
* Monitor workshop registrations and seat availability.

Backend Features

* RESTful API for workshop management.
* MongoDB database integration.
* Participant registration handling.
* Duplicate-registration prevention.
* Seat-capacity management.
* Environment-based configuration for sensitive credentials.

Technology Stack

Frontend

* React.js
* Vite
* HTML
* CSS
* JavaScript

Backend

* Node.js
* Express.js

Database

* MongoDB
* Mongoose

Deployment

* Vercel for the frontend
* Render for the backend
* MongoDB Atlas for cloud database hosting

Project Structure

eventease/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── AdminDashboard.jsx
│   ├── package.json
│   └── ...
├── server/
│   ├── models/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md

The exact file structure may vary depending on the current implementation.

Prerequisites

Install the following before running the project locally:

* Node.js and npm
* Git
* A MongoDB database, either local MongoDB or MongoDB Atlas
* A web browser

Installation and Setup

1. Clone the repository

git clone https://github.com/shreyas715/-eventease.git
cd -eventease

2. Set up the backend

Open a terminal and run:

cd server
npm install

Create a .env file inside the server directory.

Configure the environment variables required by your backend. For example:

PORT=5001
MONGODB_URI=your_mongodb_connection_string

Add any other environment variables required by your existing server configuration, including the administrator authentication settings.

Replace placeholder values with your own configuration. Never commit real passwords, database credentials, secret keys, or .env files to GitHub.

Start the backend:

npm start

The backend should start on the configured port. With the default port above, the local server is:

http://localhost:5001

3. Set up the frontend

Open another terminal:

cd client
npm install

Create a .env file inside the client directory if required.

Configure the backend API URL:

VITE_API_URL=http://localhost:5001/api

Start the frontend development server:

npm run dev

Vite will display a local URL, usually:

http://localhost:5173

Open that address in your browser.

Note: The environment variable names and values must match your actual backend configuration. The frontend and backend must both be running for the complete local application to work.

API Endpoints

The following endpoints are used by the application. Confirm the complete route definitions in server.js before relying on this list.

Method	Endpoint	Purpose
GET	/api/events	Retrieve workshops
POST	/api/events/:eventId/register	Register a participant
POST	/api/admin/login	Authenticate an administrator

Additional endpoints may be available for creating, updating, or deleting workshops and retrieving attendee information.

Database

EventEase uses MongoDB to store workshop information and registration data.

Workshop records include fields such as:

* Workshop title
* Category
* Description
* Date and time
* Venue
* Total seats
* Number of registered participants

The database configuration is supplied through environment variables rather than hardcoded credentials.

Deployment

The application can be deployed using:

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

For production deployment, configure the backend environment variables in Render and set VITE_API_URL in the frontend deployment environment to the deployed backend API base URL.

Redeploy the frontend after changing its environment variables.

Security

* Keep .env files out of version control.
* Never publish database credentials or administrator passwords.
* Configure appropriate database access controls.
* Validate registration requests on the backend.
* Enforce duplicate-registration prevention and seat limits on the server, not only in the frontend.

Future Enhancements

* Workshop categories and advanced filtering.
* Email confirmation after registration.
* QR-code-based attendance tracking.
* Workshop cancellation and waitlists.
* Registration analytics and reports.
* Improved role-based access control.

Author

Developed as a technical workshop registration project using the MERN stack.

Repository

GitHub: https://github.com/shreyas715/-eventease.git