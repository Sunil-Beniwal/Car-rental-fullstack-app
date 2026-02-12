import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    role: {type: String, enum: ["owner", "user"], default: 'user' }, //Note1
    image: {type: String, default: ''}, //Note2
},{timestamps: true}) //Note3

const User = mongoose.model('User', userSchema) //Note4

export default User

// userSchema defines the structure and rules for user documents
// User Model represents the 'users' collection in MongoDB

/****************Notes********************************************/

// Models define the structure of our data and how it will be stored in the database. They are responsible for interacting with the database, performing CRUD operations, and enforcing data validation rules. 

// here we define the User model using Mongoose for the purpose of storing user data i.e. login credentials into our database . This model  defines the schema for user documents in MongoDB, including fields like name, email, password, role, and image. The model also includes timestamps to track when each user document is created and updated.

//Note1: enum prevents invalid role values. Only "owner" or "user" can be assigned to the role field. This helps maintain data integrity and ensures that only valid roles are used in the application.

// Note2: The image field is added to store the URL of the user's profile picture. It is optional and defaults to an empty string if not provided. This allows users to have a profile image associated with their account, which can be displayed in the frontend application.

// Note3: timestamps automatically adds createdAt and updatedAt fields to the schema, which store the date and time when a document is created and last updated. This is useful for tracking when users were registered and when their information was last modified.

//Note4: mongoose.model()creates a Mongoose model named "User" from the schema, and Mongoose automatically maps it to the "users" collection in MongoDB. This model can be used by the controllers to perform database operations related to users, such as creating new users, finding existing users, updating user information, and deleting users.