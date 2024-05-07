import express from 'express'
import {
  addTripFilterField,
  deleteFieldValues,
  deleteTripFilterField,
  getAllTripFiltersField,
  getSingleTripFilterField,
  getTripFilterField,
  updateTripFilterField,
} from '../controllers/filterTripController.js'

import auth from '../middleware/auth.js'
import checkAdmin from '../middleware/checkAdmin.js'

const FilterTripRouter = express.Router()

FilterTripRouter.post(
  '/post-filter-field',
  auth,
  checkAdmin,
  addTripFilterField
)

FilterTripRouter.get(
  '/get-all-filters-field',
  auth,
  checkAdmin,
  getAllTripFiltersField
)

FilterTripRouter.get('/get-filters-field', getTripFilterField)

FilterTripRouter.get(
  '/get-single-trip-filter-filed/:id',
  getSingleTripFilterField
)

FilterTripRouter.put(
  '/update-filter-field/:id',
  auth,
  checkAdmin,
  updateTripFilterField
)

FilterTripRouter.delete(
  '/delete-filter-field/:id',
  auth,
  checkAdmin,
  deleteTripFilterField
)

FilterTripRouter.put(
  '/delete-field-value/:id',
  auth,
  checkAdmin,
  deleteFieldValues
)

export default FilterTripRouter
