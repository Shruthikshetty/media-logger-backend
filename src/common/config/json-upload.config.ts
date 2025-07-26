import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { JSON_FILE_SIZE } from '../constants/config.constants';

//destination for json file
const uploadDir = path.join(__dirname, '../', 'uploads');

//ensure the dir is present
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// configure disc storage
const jsonStorage = multer.diskStorage({
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
    cb(null, 'data-' + uniqueSuffix + path.extname(file.originalname));
  },
});

/**
 * This function is a multer file filter that checks whether the file is a valid
 * JSON file. If the file is valid, it accepts it and passes it to the next
 * middleware. If the file is not valid, it rejects it with a specific error.
 *
 */
const jsonFileFilter = (
  _req: Request,
  // eslint-disable-next-line no-undef
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === 'application/json') {
    // The file is a valid JSON file, accept it.
    cb(null, true);
  } else {
    // The file is not JSON, reject it with a specific error.
    cb(new Error('Invalid file type. Only JSON files are allowed.'));
  }
};

// Multer upload instance with all configurations
const jsonUpload = multer({
  storage: jsonStorage,
  fileFilter: jsonFileFilter,
  limits: {
    fileSize: JSON_FILE_SIZE,
  },
});

export default jsonUpload;
