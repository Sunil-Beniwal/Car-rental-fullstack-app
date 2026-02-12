import express from "express";
import { getCars, getUserData, loginUser, registerUser } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser) 
userRouter.get('/data', protect, getUserData) 
// This route is protected, meaning only authenticated users with a valid JWT token can access it. The protect middleware checks for the token and verifies it before allowing access to the getUserData controller function. This ensures that only logged-in users can retrieve their data.
userRouter.get('/cars', getCars)

export default userRouter;


// we will use postman to test our APIs. Postman is a popular tool for testing and debugging APIs. It allows us to send HTTP requests to our backend server and view the responses. We can use it to test our user registration, login, and data retrieval endpoints to ensure they are working correctly before integrating them with the frontend.
// Postman is used to test backend API routes without a frontend.
// It sends HTTP requests like GET, POST, PUT, DELETE.


/**********************Notes**************** */
// This file’s job is ONLY routing.
// It decides which controller runs for which URL + HTTP method

// the purpose of this file is to define the routes related to user operations (registration, login, fetching user data) and connect them to the corresponding controller functions that will handle the business logic for each route. This keeps our code organized and modular by separating route definitions from the actual logic of handling requests.
// By defining routes in a separate file (userRoutes.js) and connecting them to controller functions (in userController.js), we keep our code organized. The routes file only contains the URL paths and HTTP methods, while the controller file contains the logic for what happens when those routes are accessed. This separation of concerns makes it easier to maintain and scale our application as it grows.

// const userRouter = express.Router(); creates a new router object using Express. This router will be used to define routes related to user operations (like registration, login, fetching user data). We can then export this router and use it in our main server file (server.js) to mount it on a specific base path (e.g., /api/user). This keeps our route definitions organized and modular.
// userRouter.post('/register', registerUser) defines a POST route for user registration. When a POST request is made to /api/user/register, the registerUser controller function will be executed to handle the registration logic (e.g., validating input, hashing password, saving user to database).
// userRouter.post('/login', loginUser)  Defines a POST route for user login. When a POST request is made to /api/user/login, the loginUser controller function will be executed to handle the login logic (e.g., validating credentials, generating JWT token).

// ************************important questions************************
// What is Express Router and why do you use it?
// “Express Router allows us to group related routes into separate files, making the code modular, readable, and easier to maintain.
// It helps in organizing routes based on functionality (e.g., user routes, owner routes) and keeps the main server file clean.”