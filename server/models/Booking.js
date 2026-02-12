import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types

const bookingSchema = new mongoose.Schema({
    car: {type: ObjectId, ref: "Car", required: true},
    user: {type: ObjectId, ref: "User", required: true},
    owner: {type: ObjectId, ref: "User", required: true},
    pickupDate: {type: Date, required: true},
    returnDate: {type: Date, required: true},
    status: {type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending"},
    price: {type: Number, required: true}
},{timestamps: true})

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking

// what is this objectId in the above code?
// The ObjectId in the above code is a special type provided by Mongoose that represents a unique identifier for documents in a MongoDB collection. It is used to create references between different collections. In this case, the ObjectId is used to reference the Car, User, and Owner documents in the Booking schema. When a booking is created, it will store the ObjectId of the associated car, user, and owner, allowing us to easily retrieve related data when needed.

// so what will this car field store in the database?
// The car field in the database will store the ObjectId of the associated Car document. This ObjectId is a unique identifier that references a specific car in the Car collection. When a booking is created, the car field will contain the ObjectId of the car that is being booked, allowing us to easily retrieve the details of that car when needed by populating the field.

// what is the purpose of ref in the above code?
// The ref property in the above code is used to specify the name of the model that the ObjectId is referencing. It tells Mongoose which collection to look in when populating the referenced field. For example, in the bookingSchema, the car field has a ref of "Car", which means that when we populate this field, Mongoose will look for documents in the "Car" collection that match the ObjectId stored in the car field. This allows us to easily retrieve related data from other collections when querying for bookings.

