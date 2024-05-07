import express from 'express'
import {
  approvedOrganizer,
  getAdminSetting,
  updateAdminSetting,
} from '../controllers/adminController.js'
import checkAdmin from '../middleware/checkAdmin.js'
import auth from '../middleware/auth.js'
import { validateAdminSetting } from '../middleware/validate.js'
import { fileURLToPath } from 'url'
import path from 'path'
import multer from 'multer'
const AdminRouter = express.Router()

// Image Upload Code

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const imageLocation = path.join(__dirname, '../../public/tripLogoImages')

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

AdminRouter.put('/approve-organizer/:id', auth, checkAdmin, approvedOrganizer)

AdminRouter.get('/get-settings', getAdminSetting)

AdminRouter.put(
  '/update-setting/:id',
  upload.fields([
    { name: 'mainLogo', maxCount: 1 },
    { name: 'homePageBannerImage', maxCount: 1 },
    { name: 'searchPageBannerImage', maxCount: 1 },
  ]),
  auth,
  checkAdmin,
  validateAdminSetting,
  updateAdminSetting
)

export default AdminRouter
