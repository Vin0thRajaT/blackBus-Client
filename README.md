
# BlackBus - Frontend

BigBus is a bus ticket booking system built using React.js, Vite, and Material UI. The frontend allows users to search for buses, book tickets, and for administrators to manage bus listings and view ticket details.

## Features

- **User Authentication**: Login and registration pages with protected routes.
- **Bus Search & Booking**: Users can search buses and book available seats.
- **Admin Panel**: Admins can create buses, view booked tickets, and manage bus information.
- **Responsive Design**: Mobile-first design using Material UI.
- **Dynamic Routing**: Uses React Router for navigation between pages.

## Table of Contents

- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

## Technologies

- **React.js**: JavaScript library for building user interfaces.
- **Vite**: Next-generation frontend tooling for fast development.
- **Material UI**: React components library implementing Google's Material Design.
- **Axios**: For making HTTP requests to the backend.
- **React Router**: For handling routing between different pages.
  
## Getting Started

To run the frontend locally, follow the steps below.

### Prerequisites

- **Node.js**: Make sure you have Node.js installed on your machine. You can download it [here](https://nodejs.org/).
- **npm or yarn**: Package manager to install dependencies.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/blackbus-frontend.git
   cd blackbus-frontend
   ```

2. **Install dependencies:**

   Using npm:
   ```bash
   npm install
   ```

   Or using yarn:
   ```bash
   yarn install
   ```

### Running the Project

1. **Start the development server:**

   Using npm:
   ```bash
   npm run dev
   ```

   Or using yarn:
   ```bash
   yarn dev
   ```

2. **Access the application:**

   Once the development server starts, open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

## Scripts

Below are the available scripts you can run:

- **`npm run dev`** or **`yarn dev`**: Starts the development server.
- **`npm run build`** or **`yarn build`**: Builds the app for production.
- **`npm run preview`** or **`yarn preview`**: Serves the production build locally for preview.
- **`npm run lint`** or **`yarn lint`**: Runs ESLint to check for linting issues.

## Environment Variables

For local development, you need to set up environment variables. Create a `.env` file in the root directory of the project.

Example:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

This `VITE_API_BASE_URL` should point to your backend API's base URL.

## Project Structure

```bash
bigbus-frontend/
│
├── public/                   # Static assets
├── src/
│   ├── components/            # Reusable components (AppBar, BusDetails, etc.)
│   ├── context/               # Contexts for authentication and global state
│   ├── pages/                 # Page components for each route (HomePage, LoginPage, etc.)
│   ├── styles/                # CSS styles
│   ├── App.jsx                # Main app component with routing
│   ├── main.jsx               # Entry point of the application
│   └── api/                   # Axios instances and API calls
│
├── .env                       # Environment variables
├── package.json               # Project configuration and dependencies
├── README.md                  # This file
├── vite.config.js             # Vite configuration
└── .eslintrc.js               # Linter configuration
```

## Key Pages & Components

1. **`HomePage.jsx`**: Displays bus search and booking functionality for users.
2. **`LoginPage.jsx`**: User authentication (login).
3. **`RegisterPage.jsx`**: User registration.
4. **`CreateBus.jsx`**: Admin page to create new buses.
5. **`AdminBookedTicketsList.jsx`**: Admin page to list all buses.
6. **`AdminBookedTickets.jsx`**: Admin page to view booked tickets for a specific bus.
7. **`CustomAppBar.jsx`**: Navigation bar, dynamically renders menu based on user role (admin/user).

## Contributions

Feel free to open issues or submit pull requests if you find any bugs or have suggestions for improvement!

## License

This project is licensed under the MIT License.

---

Now you're ready to start working on the frontend of BlackBus! If you have any questions or need further assistance, feel free to ask.
