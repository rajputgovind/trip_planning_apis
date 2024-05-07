import express from 'express'
import {
  exportAllOrganizer,
  getAllMarketingFields,
  getAllOrganizers,
  getAllOrganizersName,
  getAllTripOfOrganizer,
  getSingleOrganizer,
  updateJoiningRequest,
} from '../controllers/organizerController.js'

import auth from '../middleware/auth.js'
import checkAdmin from '../middleware/checkAdmin.js'
import checkOrganizer from '../middleware/checkOrganizer.js'

const OrganizerRouter = express.Router()

OrganizerRouter.get('/get-all-organizers', auth, checkAdmin, getAllOrganizers)

OrganizerRouter.get('/get-organizer/:id', auth, getSingleOrganizer)

OrganizerRouter.get(
  '/get-organizer-trip',
  auth,
  checkOrganizer,
  getAllTripOfOrganizer
)

OrganizerRouter.put(
  '/update-joining-request/:id',
  auth,
  checkOrganizer,
  updateJoiningRequest
)

OrganizerRouter.get(
  '/download-all-organizers',
  auth,
  checkAdmin,
  exportAllOrganizer
)

OrganizerRouter.get('/get-all-organizers-name', getAllOrganizersName)

OrganizerRouter.get('/get-marketing-fields', getAllMarketingFields)

export default OrganizerRouter
