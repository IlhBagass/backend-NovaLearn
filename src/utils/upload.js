import cloudinary from '../config/cloudinary.js';

export const uploadFileToCloudinary = (
    fileStream,
    { folder = 'novalearn/uploads', resourceType = 'auto' } = {}
) => {
    return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        fileStream.pipe(upload);
    });
};

export const uploadImageToCloudinary = (fileStream) =>
    uploadFileToCloudinary(fileStream, {
        folder: 'novalearn/courses',
        resourceType: 'image',
    });
