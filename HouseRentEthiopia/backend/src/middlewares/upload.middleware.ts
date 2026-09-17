import multer from 'multer';

// In-memory storage so buffers go straight to Cloudinary (serverless-friendly).
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

export default upload;
export const uploadSingleImage = upload.single('image');