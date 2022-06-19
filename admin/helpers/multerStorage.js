import multer from "multer";
import path from "path";

import { randomStringFromDate } from "./uniqueGenerator.js";

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'public/images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + file.originalname.split('.').shift() + '_' + randomStringFromDate() + '.' + file.originalname.split('.').pop());
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    }
});

export const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1024 * 5  // 5 KB
    },
    fileFilter: (req, file, cb) => {
        // Allowed extensions
        const fileTypes = /jpeg|jpg|png|gif/;
        // Check extension
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime type
        const mimetype = fileTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
})

const fileStorage = multer.diskStorage({
    // Destination to store file
    destination: 'public/files',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + file.originalname.split('.').shift() + '_' + randomStringFromDate() + '.' + file.originalname.split('.').pop());
        // file.fieldname is name of the field (file)
        // path.extname get the uploaded file extension
    }
});

export const fileUpload = multer({
    storage: fileStorage,
    limits: {
        fileSize: 1024 * 5  // 5 KB
    },
    fileFilter: (req, file, cb) => {
        // Allowed extensions
        const fileTypes = /pdf|epub/;
        // Check extension
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime type
        const mimetype = fileTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only files are allowed!'));
        }
    }
});
