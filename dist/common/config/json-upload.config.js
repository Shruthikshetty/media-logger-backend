'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const multer_1 = __importDefault(require('multer'));
const path_1 = __importDefault(require('path'));
const fs_1 = __importDefault(require('fs'));
const config_constants_1 = require('../constants/config.constants');
//destination for json file
const uploadDir = path_1.default.join(__dirname, '../', 'uploads');
//ensure the dir is present
if (!fs_1.default.existsSync(uploadDir)) {
  fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// configure disc storage
const jsonStorage = multer_1.default.diskStorage({
  /**
   * specify the destination
   */
  destination: function (
    _req,
    // eslint-disable-next-line no-undef
    _file,
    // eslint-disable-next-line no-unused-vars
    cb
  ) {
    cb(null, uploadDir);
  },
  /**
   * Generates a unique filename while preserving the original file extension.
   * This prevents file name collisions.
   */
  filename: (
    _req,
    // eslint-disable-next-line no-undef
    file,
    // eslint-disable-next-line no-unused-vars
    cb
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      'data-' + uniqueSuffix + path_1.default.extname(file.originalname)
    );
  },
});
/**
 * This function is a multer file filter that checks whether the file is a valid
 * JSON file. If the file is valid, it accepts it and passes it to the next
 * middleware. If the file is not valid, it rejects it with a specific error.
 *
 */
const jsonFileFilter = (
  _req,
  // eslint-disable-next-line no-undef
  file,
  cb
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
const jsonUpload = (0, multer_1.default)({
  storage: jsonStorage,
  fileFilter: jsonFileFilter,
  limits: {
    fileSize: config_constants_1.JSON_FILE_SIZE,
  },
});
exports.default = jsonUpload;
