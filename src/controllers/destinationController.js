import { StatusCodes } from 'http-status-codes'
import Destination from '../models/DestinationModel.js'
import errorHandler from '../middleware/validationErrorHandler.js'
import { validationResult } from 'express-validator'

// Add Destination Api

export const addDestination = async (req, res) => {
  try {
    const errors = validationResult(req)
    const errMessages = errorHandler(errors)

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages })
    }

    let image
    if (!req.files.destinationImage) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'الرجاء اختيار صورة الوجهة' })
    } else {
      const images = req.files ? req.files.destinationImage : []
      image = images.map(item => {
        return item.filename
      })
    }

    const { city, destinationDate, duration, agenda, hotelName } = req.body

    const destination = new Destination({
      city,
      destinationDate,
      duration,
      agenda,
      hotelName,
      destinationImage: image,
    })
    const destinationData = await destination.save()
    if (!destinationData) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'تفاصيل الوجهة غير صحيحة' })
    }
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'تم إنشاء الوجهة',
      data: destinationData,
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: true,
      message: 'حدث خطأ أثناء إنشاء الوجهة',
      error: error.message,
    })
  }
}

// Edit Destination Api

export const updateDestination = async (req, res) => {
  try {
    const errors = validationResult(req)
    const errMessages = errorHandler(errors)

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages })
    }
    const destinationId = req.params.id
    const images = req.files ? req.files.destinationImage : []

    let image
    if (images) {
      image = images.map(item => {
        return item.filename
      })
    }

    const { city, destinationDate, duration, agenda, hotelName } = req.body

    const updatedDestinationData = {
      city,
      destinationDate,
      duration,
      agenda,
      hotelName,
      destinationImage: image,
    }

    const updatedDestination = await Destination.findByIdAndUpdate(
      destinationId,
      updatedDestinationData,
      { new: true }
    )

    if (!updatedDestination) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'لا يمكن العثور على الوجهة' })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم تحديث الوجهة',
      data: updatedDestination,
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الوجهة',
      error: error.message,
    })
  }
}

// Get Single Destination Api

export const getSingleDestination = async (req, res) => {
  try {
    const destinationId = req.params.id
    const destination = await Destination.findById(destinationId)
    if (!destination) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'لم يتم العثور على الوجهة' })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم العثور على الوجهة بنجاح',
      data: destination,
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء محاولة العثور على الوجهة',
      error: error.message,
    })
  }
}
// Delete Destination Api

export const deleteDestination = async (req, res) => {
  try {
    const id = req.params.id
    const destination = await Destination.findByIdAndDelete(id)
    if (!destination) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'لم يتم العثور على الوجهة' })
    }
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'تم حذف الوجهة' })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء محاولة حذف الوجهة',
      error: error.message,
    })
  }
}
