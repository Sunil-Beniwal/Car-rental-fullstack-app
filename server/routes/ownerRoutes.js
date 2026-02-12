import express from "express";
import { protect } from "../middleware/auth.js";
import { addCar, changeRoleToOwner, deleteCar, getOwnerCars, toggleCarAvailability, getDashboardData, updateUserImage  } from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner)
ownerRouter.post("/add-car", protect,  upload.single("image"), addCar) //Note 1
ownerRouter.get("/cars", protect, getOwnerCars)
ownerRouter.post("/toggle-car", protect, toggleCarAvailability)
ownerRouter.post("/delete-car", protect, deleteCar)

ownerRouter.get('/dashboard', protect, getDashboardData)
ownerRouter.post('/update-image', protect, upload.single("image"), updateUserImage)

export default ownerRouter;


/****************************************Notes************************** */
// Note1: why are we using upload.single("image") here?
// We are using upload.single("image") here because we want to handle the file upload for a single image file that is being sent in the request. The "image" parameter specifies the name of the form field that contains the file. By using this middleware, multer will process the incoming request, extract the file from the specified field, and make it available in req.file for further processing in our addCar controller function. This allows us to easily access the uploaded image and perform operations such as uploading it to ImageKit or saving it to our database.