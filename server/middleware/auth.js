import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.json({success: false, message: "not authorized"})
    }
    try {
        const userId = jwt.decode(token, process.env.JWT_SECRET)

        if(!userId){
            return res.json({success: false, message: "not authorized"})
        }
        req.user = await User.findById(userId).select("-password") // Fetches the authenticated user's data from the database using the userId obtained from the JWT token. The select("-password") part excludes the password field from the returned user data for security reasons. This user data is then attached to the req object (req.user) so that it can be accessed in subsequent middleware or route handlers that require authentication.
        next();
    } catch (error) {
        return res.json({success: false, message: "not authorized"})
    }
}
