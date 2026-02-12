import multer from "multer";

// Method 1: Disk Storage (saves files to disk)
// const upload = multer({storage: multer.diskStorage({})})

// Method 2: Memory Storage (stores files in memory as Buffer objects)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload

// what is happening here basically?
// we are creating a multer middleware that will handle file uploads in our application.
// We are using memory storage, which means that the uploaded files will be stored in memory as Buffer objects. This is useful when we want to process the files immediately (like uploading to ImageKit) without saving them to disk first. The upload middleware can then be used in our routes to handle file uploads, and the uploaded file will be available in req.file for further processing.

// const storage = multer.memoryStorage(); what this line doing?
// The line const storage = multer.memoryStorage(); creates a storage engine for multer that stores uploaded files in memory as Buffer objects. This means that when a file is uploaded, it will not be saved to disk but will instead be kept in memory, allowing us to access its contents directly through req.file.buffer. This is particularly useful for scenarios where we want to process the file immediately (like uploading to a cloud service) without the overhead of writing it to disk first.

// const upload = multer({ storage }); what this line doing?
// The line const upload = multer({ storage }); initializes the multer middleware with the specified storage engine (in this case, memory storage). This means that when we use the upload middleware in our routes, any files uploaded will be stored in memory and accessible via req.file for processing.

// how file property is added to req object?
// When a file is uploaded using the multer middleware, multer processes the incoming request and extracts the file data. It then adds a file property to the req object, which contains information about the uploaded file, such as its original name, encoding, MIME type, size, and a buffer containing the file data (if using memory storage). This allows us to access the uploaded file's details and content in our route handlers for further processing, such as uploading to ImageKit or saving to disk.