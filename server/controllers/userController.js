import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js";


// Generate JWT Token using user ID. // Token is signed using JWT_SECRET
const generateToken = (userId)=>{
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
} //Note1

// Register User
export const registerUser = async (req, res)=>{
    // Note 2
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password ){
            return res.json({success: false, message: 'Fill all the fields'})
        }
        
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword})
        const token = generateToken(user._id.toString())
        res.json({success: true, token})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Login User 
export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials" })
        }
        const token = generateToken(user._id.toString())
        res.json({success: true, token})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get User data using Token (JWT)
export const getUserData = async (req, res) =>{
    try {
        const {user} = req;  //Note: user is attached to req object in the protect middleware after verifying the JWT token. It contains the authenticated user's data (except password).
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get All Cars for the Frontend
export const getCars = async (req, res) =>{
    try {
        const cars = await Car.find({isAvaliable: true})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}



/***********************************Notes*********************************/
// Controllers handle the request logic, interact with models for data operations, and return appropriate responses to the client.

// userController is mainly responsible for handling user-related operations such as registration, login, and fetching user data. It also includes a function to get all available cars for the frontend. Each function interacts with the User model (and Car model for getCars) to perform database operations and returns appropriate responses to the client.

// Note1: JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. In our case, we use it for authentication. When a user logs in or registers successfully, we generate a JWT token that contains the user's ID as the payload. This token is then sent back to the client (frontend) and can be stored (e.g., in localStorage). For subsequent requests that require authentication (like fetching user data), the frontend can include this token in the Authorization header. The backend can then verify this token to authenticate the user and allow access to protected routes.

// Note2 : what is this async function doing here and what are these req and res?
//  It is an Express route handler function. when this api route POST /api/user/register hits, Express automatically calls this function and injects two objects:
// req (request) -> request object (data coming IN). Contains information about the incoming HTTP request, such as headers, body, query parameters, etc. In this function, we access req.body to get the user registration data sent from the frontend.
// res (response) -> response object (data going OUT). Used to send back a response to the client. We use res.json() to send a JSON response indicating success or failure of the registration process, along with any relevant messages or data (like the JWT token on successful registration).

// What does res.json() mean?
// res.json() is a method provided by the Express response object (res) that sends a JSON response back to the client. It takes a JavaScript object as an argument, converts it to a JSON string, and sets the appropriate Content-Type header to application/json before sending it back to the client. This is commonly used in APIs to send structured data (like success status, messages, user data, tokens) in a format that can be easily consumed by frontend applications or other clients making requests to the API.
// so basically res.json({ success: true, token }) is equivalent to:
// res.setHeader("Content-Type", "application/json");
// res.send(JSON.stringify({ success: true, token }));

// How are we getting user._id when _id is NOT in schema?
// In MongoDB, every document automatically gets a unique _id field, which serves as the primary key for that document. This _id is generated by MongoDB when a new document is created and is not explicitly defined in the Mongoose schema. _id is:auto-generated,auto-generated, primary key, always present.

