import multer = require("multer");

export const uploadAvatar = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 1024 * 1024}
})

export const uploadPdf = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    },
    limits: {fileSize: 5 * 1024 * 1024} // 10MB limit
});
