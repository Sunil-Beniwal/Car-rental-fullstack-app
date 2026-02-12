import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Initialize Express App
const app = express() // app is our main server object created using Express

// connect database
await connectDB();

// Middleware
app.use(cors()); // Enables CORS (Cross-Origin Resource Sharing). Allows frontend (running on different port/domain) to send requests to this backend and have access to backend resources.
app.use(express.json());

app.get('/', (req,res)=>res.send("server is running")) //  test route to check if server is running. Used for testing backend status in browser or Postman
app.use('/api/user', userRouter) // Mounts userRouter on /api/user path. so all user-related routes are grouped under that base URL.
app.use('/api/owner', ownerRouter) // Mounts ownerRouter on /api/owner path. All owner-related routes are grouped under that base URL(/api/owner) for owners. This keeps our API organized and modular.
app.use('/api/bookings', bookingRouter) // Mounts ownerRouter on /api/owner path. All owner-related routes are grouped under that base URL(/api/owner) for owners. This keeps our API organized and modular.
  
// server listener
const PORT = process.env.PORT || 3000; //// Uses PORT from .env file if available, otherwise defaults to 3000
app.listen(PORT, ()=> console.log(`server running on port ${PORT}`)) // Starts the server and listens for incoming requests


// *******************************************notes**************************************************
// “Why do we use cors middleware?”
// “It allows cross-origin requests so that a frontend application running on a different domain or port can communicate with the backend.”

// app.use(express.json()); Parses incoming JSON data from frontend
// Without this, req.body will be undefined when frontend sends JSON data in requests.
// frontend sends data as JSON (string format) , express.json() It parses (converts) this JSON string into a JavaScript object and attaches it to: req.body

// Why do we use express.json()?”
// “It is a built-in express middleware that parses incoming JSON request bodies and makes the data available on req.body. Without it, Express cannot read JSON data sent from the client.”

// request lifecyclein express: “In Express, a request flows through middleware, is matched to a route, handled by a controller, interacts with the database through models, and finally sends a response using res.json().”
// 1. Client (frontend) sends an HTTP request to the server (e.g., POST /api/user/register with user data in JSON format).
// 2. The request hits the Express server and goes through any defined middleware (like cors, express.json()).
// 3. The request is then routed to the appropriate route handler based on the URL and HTTP method (e.g., userRouter.post('/register', registerUser)).
// 4. The route handler (controller function) processes the request, interacts with the database if needed, and sends back a response to the client using res.json() or other response methods.
// 5. The client receives the response and can update the UI accordingly based on the success or failure of the request.

// **************************************backend setup commannds**********************************************
// npm init -y
// Initializes a new Node.js project. Creates a package.json file with default values. 

//  npm install express cors dotenv jsonwebtoken bcrypt mongoose
// Installs core backend libraries:
// express       -> Used to create the backend server and APIs
// cors          -> Allows frontend (different origin) to talk to backend
// dotenv        -> Loads environment variables from .env file (API keys, DB URL, secrets)
// jsonwebtoken  -> Used for authentication (JWT tokens for login/signup)
// bcrypt        -> Used to hash passwords before storing them in database
// mongoose      -> Used to connect Node.js with MongoDB and define schemas/models

// npm install --save-dev nodemon
// Installs nodemon as a development dependency
// nodemon automatically restarts the server when code changes
// This is only used during development, not in production

// npm install multer
// Installs multer, a middleware for handling multipart/form-data, which is primarily used for uploading files. In our case, it will be used to handle image uploads for properties.