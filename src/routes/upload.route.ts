/**
 * @file contains all the routes related to upload
 */

import { Router } from 'express';
import { requireAuth } from '../common/middleware/require-auth';
import imageUpload from '../common/config/image-upload.config';
import { handleUpload } from '../common/middleware/handle-upload';
import { uploadImage } from '../controllers/upload.controller';

//initialize router
const route = Router();

//route to upload image
route.post(
  '/image',
  requireAuth('admin'),
  handleUpload(imageUpload, 'image'),
  uploadImage
);

// export all the routes aggregated
export default route;
