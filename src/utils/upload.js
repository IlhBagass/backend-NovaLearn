import cloudinary from '../config/cloudinary.js';

export const uploadImageToCloudinary = (fileStream) => {
    return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
            { folder: 'novalearn/courses' }, 
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        fileStream.pipe(upload);
    });
};