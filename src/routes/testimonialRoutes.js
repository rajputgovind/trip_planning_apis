import express from 'express'
import multer from 'multer'
import {
  addTestimonial,
  deleteTestimonial,
  editTestimonial,
  getAllTestimonials,
  getOneTestimonial,
} from '../controllers/testimonialController.js'
import {
  validateAddTestimonial,
  validateEditTestimonial,
} from '../middleware/validate.js'
const testimonialRouter = express.Router()
import { fileURLToPath } from 'url'
import path from 'path'
import checkAdmin from '../middleware/checkAdmin.js'
import auth from '../middleware/auth.js'
import { param } from 'express-validator'

// Image Upload Code

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const imageLocation = path.join(__dirname, '../../public/testimonialImages')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, imageLocation, function (error, success) {
      if (error) throw error
    })
  },
  filename: function (req, file, cb) {
    const fname = Date.now() + '-' + file.originalname
    return cb(null, fname, function (error, success) {
      if (error) throw error
    })
  },
})

const upload = multer({ storage: storage })

testimonialRouter.get('/', getAllTestimonials)

testimonialRouter.get(
  '/:testimonialId',
  [
    param('testimonialId')
      .isMongoId()
      .withMessage('testimonialId must be valid mongodb ObjectId'),
  ],
  getOneTestimonial
)

testimonialRouter.post(
  '/add',
  auth,
  checkAdmin,
  upload.single('image'),
  validateAddTestimonial,
  addTestimonial
)

testimonialRouter.put(
  '/edit/:testimonialId',
  auth,
  checkAdmin,
  upload.single('image'),
  validateEditTestimonial,
  editTestimonial
)

testimonialRouter.delete(
  '/delete/:testimonialId',
  [
    param('testimonialId')
      .isMongoId()
      .withMessage('testimonialId must be valid mongodb ObjectId'),
  ],
  auth,
  checkAdmin,
  deleteTestimonial
)
export default testimonialRouter
