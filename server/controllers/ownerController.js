import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import fs from "fs";
import imagekit from "../configs/imageKit.js";


// API function to Change Role of User
export const changeRoleToOwner = async (req, res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role: "owner"})
        res.json({success: true, message: "Now you can list cars"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Api to list  Car
export const addCar = async (req, res)=>{
    try {
        const {_id} = req.user;
        let car = JSON.parse(req.body.carData);

        const imageFile = req.file; // Note1 This file will be added using multer.js middleware that we will create using multer package.

        // --- ADD THIS VALIDATION ---
        if (!imageFile) {
            return res.json({ 
                success: false, 
                message: "Please upload a car image." 
            });
        }
        
        // Upload Image to ImageKit
        // method 1: using file path (works with disk storage). We need fs module to read the file from disk and convert it to buffer for uploading to ImageKit
        // const fileBuffer = fs.readFileSync(imageFile.path)
        // const fileBase64 = fileBuffer.toString('base64'); 
        
        // Method 2 : using memory storage (works with memory storage). Since we are using memory storage in multer, the uploaded file is already available as a buffer in req.file.buffer, so we can directly convert it to base64 without needing to read it from disk.
        const fileBase64 = imageFile.buffer.toString('base64');

        const response =  await imagekit.files.upload({
            file: fileBase64,
            fileName: imageFile.originalname,
            folder: '/cars'
        })

        // optimization through imagekit URL transformation
       var optimizedImageUrl = imagekit.helper.buildSrc({
            src: response.url,
            transformation : [
                {width: '1280'}, // Width resizing
                {quality: 'auto'}, // Auto compression
                { format: 'webp' }  // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;
        // if(!image){
        //     return res.json({success: false, message: "Image upload failed"})
        // }
        await Car.create({...car, owner: _id, image})

        res.json({success: true, message: "Car Added"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// Api to get owner's all cars
export const getOwnerCars = async (req, res)=>{
    try {
        const {_id} = req.user;
        const cars = await Car.find({owner: _id })
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Toggle Car Availability
export const toggleCarAvailability = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // Checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.isAvaliable = !car.isAvaliable;
        await car.save()

        res.json({success: true, message: "Availability Toggled"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Api to delete a car
export const deleteCar = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // Checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.owner = null;
        car.isAvaliable = false;

        await car.save()

        res.json({success: true, message: "Car Removed"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//  API to get Dashboard Data
export const getDashboardData = async (req, res) =>{
    try {
        const { _id, role } = req.user;

        if(role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" });
        }

        const cars = await Car.find({owner: _id})
        const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });

        const pendingBookings = await Booking.find({owner: _id, status: "pending" })
        const completedBookings = await Booking.find({owner: _id, status: "confirmed" })

        // Calculate monthlyRevenue from bookings where status is confirmed
        const monthlyRevenue = bookings.slice().filter(booking => booking.status === 'confirmed').reduce((acc, booking)=> acc + booking.price, 0)

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue
        }

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to update user image
export const updateUserImage = async (req, res)=>{
    try {
        const { _id } = req.user;

        const imageFile = req.file;

        // Upload Image to ImageKit
        const fileBase64 = imageFile.buffer.toString('base64');
        const response = await imagekit.files.upload({
            file: fileBase64,
            fileName: imageFile.originalname,
            folder: '/users'
        })

        // optimization through imagekit URL transformation
       var optimizedImageUrl = imagekit.helper.buildSrc({
            src: response.url,
            transformation : [
                {width: '1280'}, // Width resizing
                {quality: 'auto'}, // Auto compression
                { format: 'webp' }  // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;

        await User.findByIdAndUpdate(_id, {image});
        res.json({success: true, message: "Image Updated" })

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}   










/******************************Notes*************************** */
// Note 1: Since we are using multer middleware to handle file uploads, the uploaded file is available in req.file. We read this file and upload it to ImageKit, which returns a URL for the uploaded image. We then save this URL in our Car model so that we can display the car image later when fetching car data.
// multer middleware processes the incoming multipart/form-data request and extracts the uploaded file, making it available as req.file. This file object contains details about the uploaded image, including its path on the server (imageFile.path) and its original name (imageFile.originalname). We read the file from the temporary location using fs.readFileSync(imageFile.path) to get a buffer that can be uploaded to ImageKit.

