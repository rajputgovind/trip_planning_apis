import { StatusCodes } from 'http-status-codes'
import Filter from '../models/FilterTripModel.js'
import mongoose from 'mongoose'

// Add Trip Filter Api

export const addTripFilterField = async (req, res) => {
  try {
    const { fieldName, value } = req.body
    if (!fieldName) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Please fill it properly.' })
    }

    // Check if a filter with the same name already exists
    const existingFilter = await Filter.findOne({ fieldName })

    if (existingFilter) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ success: false, message: 'This field is already exist.' })
    }
    const filterValue = value.map((data, index) => data)
    const filter = Filter({ fieldName, value: filterValue })
    const filterData = await filter.save()
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Field has been added successfully.',
      data: filterData,
    })
  } catch (error) {
    console.log('error', error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error occurred while adding the trip filter field.',
      error: error.message,
    })
  }
}

// Get All Trip Filters Api

export const getAllTripFiltersField = async (req, res) => {
  try {
    const tripFilter = await Filter.find({})
    if (!tripFilter) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'Trip Filter field was not found.' })
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Trip filter field has been found successfully.',
      data: tripFilter,
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: flase,
      message: 'Error occurred while find trip filter field',
      error: error.message,
    })
  }
}

// Retrieve the trip filter to display on the frontend Api

export const getTripFilterField = async (req, res) => {
  try {
    const tripFilter = await Filter.find({ status: true })
    if (!tripFilter) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'Trip Filter filed was not found.' })
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Trip filter field has been found successfully.',
      data: tripFilter,
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: flase,
      message: 'Error occurred while find trip filter field',
      error: error.message,
    })
  }
}

// Get Single Trip Filter Field Api

export const getSingleTripFilterField = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Error occurred while find trip filter field.',
      })
    }

    const filterField = await Filter.findById(req.params.id)

    if (!filterField) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'Trip Filter filed was not found.' })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Trip filter field has been found successfully.',
      data: filterField,
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error occurred while find trip filter field.',
      error: error.message,
    })
  }
}

// Update trip filter Api

export const updateTripFilterField = async (req, res) => {
  try {
    const { fieldName, status, value } = req.body

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Error occurred while update trip filter.',
      })
    }

    const getField = await Filter.findById(req.params.id)

    if (fieldName !== undefined) {
      // Check if the provided fieldName already exists in the database
      const existingFilter = await Filter.findOne({ fieldName: fieldName })
      if (existingFilter && existingFilter._id.toString() !== req.params.id) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: 'This field name is already in use.',
        })
      }
      getField.fieldName = fieldName
    }

    if (value) {
      const sanitizedValues = value.map(val =>
        typeof val === 'string'
          ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
          : val
      )

      // Check if the values to be added already exist in the array
      const existingValues = getField.value.map(v => v.toLowerCase())

      for (const val of sanitizedValues) {
        if (!existingValues.includes(val.toLowerCase())) {
          getField.value.push(val)
        } else {
          return res.status(StatusCodes.CONFLICT).json({
            success: false,
            message: 'This value field is already exist',
          })
        }
      }
    }

    if (status !== undefined) {
      getField.status = status
    }

    await getField.save()
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Trip filter field updated successfully.',
      data: getField,
    })
  } catch (error) {
    console.log('error', error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error occurred while update trip filter',
      error: error.message,
    })
  }
}

// Delete trip Filter Api

export const deleteTripFilterField = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Error occurred while delete trip filter field.',
      })
    }

    const filter = await Filter.findByIdAndDelete(req.params.id)
    if (!filter) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'Trip Filter field was not found.' })
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Trip filter field deleted successfully.',
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error occurred while delete trip filter field',
      error: error.message,
    })
  }
}

// Delete FieldValue apis

export const deleteFieldValues = async (req, res) => {
  try {
    const filterId = req.params.id
    const value = req.body.value

    // Find the filter by ID
    const filterField = await Filter.findById(filterId)

    if (!filterField) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Field not found.',
      })
    }

    // Filter out the values to delete from the field

    const filterValue = filterField.value.filter(val => !value.includes(val))

    if (filterValue) {
      filterField.value = filterValue
    }
    // Save the updated filter
    await filterField.save()

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Values have been deleted successfully.',
      data: filterField,
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error occurred while deleting values',
      error: error.message,
    })
  }
}
