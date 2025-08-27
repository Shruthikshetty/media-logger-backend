"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_constants_1 = require("../constants/config.constants");
//destination for json file
const uploadDir = path_1.default.join(__dirname, '../', 'uploads');
//ensure the dir is present
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// configure disc storage
const imageStorage = multer_1.default.diskStorage({
    /**
     * specify the destination
     */
    destination: function (_req, 
    // eslint-disable-next-line no-undef
    _file, 
    // eslint-disable-next-line no-unused-vars
    cb) {
        cb(null, uploadDir);
    },
    /**
     * Generates a unique filename while preserving the original file extension.
     * This prevents file name collisions.
     */
    filename: (_req, 
    // eslint-disable-next-line no-undef
    file, 
    // eslint-disable-next-line no-unused-vars
    cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'image-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
// Allowed image formats (by MIME)
//multer file filters
const imageFileFilter = (_req, 
// eslint-disable-next-line no-undef
file, cb) => {
    if (config_constants_1.ALLOWED_IMAGE_FORMATS.includes(file.mimetype)) {
        // The file is a valid image file, accept it.
        cb(null, true);
    }
    else {
        // The file is not an image, reject it with a specific error.
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
};
//multer instance for image
const imageUpload = (0, multer_1.default)({
    storage: imageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: config_constants_1.IMAGE_FILE_SIZE,
    },
});
//export
exports.default = imageUpload;
