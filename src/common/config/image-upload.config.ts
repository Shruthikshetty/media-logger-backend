import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import {
  IMAGE_FILE_SIZE,
  ALLOWED_IMAGE_FORMATS,
} from '../constants/config.constants';

//destination for json file
const uploadDir = path.join(__dirname, '../', 'uploads');

//ensure the dir is present
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// configure disc storage
const imageStorage = multer.diskStorage({
  /**
   * specify the destination
   */
  destination: function (
    _req: Request,
    // eslint-disable-next-line no-undef
    _file: Express.Multer.File,
    // eslint-disable-next-line no-unused-vars
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, uploadDir);
  },
  /**
   * Generates a unique filename while preserving the original file extension.
   * This prevents file name collisions.
   */
  filename: (
    _req: Request,
    // eslint-disable-next-line no-undef
    file: Express.Multer.File,
    // eslint-disable-next-line no-unused-vars
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Allowed image formats (by MIME)
//multer file filters
const imageFileFilter = (
  _req: Request,
  // eslint-disable-next-line no-undef
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_IMAGE_FORMATS.includes(file.mimetype)) {
    // The file is a valid image file, accept it.
    cb(null, true);
  } else {
    // The file is not an image, reject it with a specific error.
    cb(
      new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.')
    );
  }
};

//multer instance for image
const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: IMAGE_FILE_SIZE,
  },
});

//export
export default imageUpload;
