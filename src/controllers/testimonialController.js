import { validationResult } from 'express-validator'
import errorHandler from '../middleware/validationErrorHandler.js'
import Testimonial from '../models/TestimonialModel.js'
import { StatusCodes } from 'http-status-codes'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { aggregatePaginate } from 'mongoose-aggregate-paginate-v2'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const imageLocation = path.join(__dirname, '../../public/testimonialImages')

export const addTestimonial = async (req, res) => {
  //validating req body for the fields
  const errors = validationResult(req)
  const errMessages = errorHandler(errors)
  if (errMessages && errMessages.length) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: errMessages })
  }

  try {
    const { name, designation, description } = req.body
    const newTestimony = new Testimonial({
      name,
      designation,
      description,
    })

    // console.log('req.file', req.file)
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'يرجى تحميل الصورة',
      })
    }

    newTestimony['image'] = req.file.filename
    await newTestimony.save()

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'تمت إضافة الشهادة بنجاح',
      newTestimony,
    })
  } catch (error) {
    console.log('Error while adding testimonials : ', error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      //   message: 'An unexpected error occurred',
      message: `حدث خطأ غير متوقع`,
      error: error.message,
    })
  }
}

export const editTestimonial = async (req, res) => {
  //validating req body for the fields
  const errors = validationResult(req)
  const errMessages = errorHandler(errors)
  if (errMessages && errMessages.length) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: errMessages })
  }
  const { testimonialId } = req.params
  try {
    const updates = Object.keys(req.body)
    const testimonial = await Testimonial.findById(testimonialId)
    if (!testimonial) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `Testimonial with id ${testimonialId} not found`,
      })
    }

    if (req.file) {
      if (testimonial.image && testimonial.image.length > 1) {
        fs.unlinkSync(`${imageLocation}/${testimonial.image}`)
        testimonial.image = req.file.filename
      }
    }
    updates.map(update => {
      testimonial[update] = req.body[update]
    })

    await testimonial.save()

    return res.status(StatusCodes.OK).json({
      success: true,
      // message: 'Testimonial updated successfully',
      message: 'تم تحديث الشهادة بنجاح',
      testimonial,
    })
  } catch (error) {
    console.log('Error while edit testimonial : ', error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      //   message: 'An unexpected error occurred',
      message: `حدث خطأ غير متوقع`,
      error: error.message,
    })
  }
}

export const getAllTestimonials = async (req, res) => {
  try {
    // const page = req.query.page ?? 1
    // const limit = req.query.limit ?? 10
    const testimonials = await Testimonial.find({})

    // const data = await Testimonial.aggregatePaginate(testimonials, {
    //   page,
    //   limit,
    // })

    return res.status(StatusCodes.OK).json({
      success: true,
      testimonials,
    })
  } catch (error) {
    console.log('Error while getting testimonials : ', error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      //   message: 'An unexpected error occurred',
      message: `حدث خطأ غير متوقع`,
      error: error.message,
    })
  }
}

export const getOneTestimonial = async (req, res) => {
  try {
    const { testimonialId } = req.params
    const testimonial = await Testimonial.findById(testimonialId)

    if (!testimonial) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `Testimonial with id ${testimonialId} not found`,
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      testimonial,
    })
  } catch (error) {
    console.log('Error while getting testimonial : ', error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      //   message: 'An unexpected error occurred',
      message: `حدث خطأ غير متوقع`,
      error: error.message,
    })
  }
}

export const deleteTestimonial = async (req, res) => {
  try {
    const { testimonialId } = req.params
    const existingTestimonial = await Testimonial.findById(testimonialId)

    if (!existingTestimonial) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `Testimonial with id ${testimonialId} not found`,
      })
    }

    if (existingTestimonial.image && existingTestimonial.image.length > 1) {
      fs.unlinkSync(`${imageLocation}/${existingTestimonial.image}`)
    }

    const deletedTestimonial = await Testimonial.findByIdAndDelete(
      testimonialId
    )

    return res.status(StatusCodes.OK).json({
      success: true,
      //   message: 'Testimonial deleted successfully',
      message: 'تم حذف الشهادة بنجاح',
      deletedTestimonial,
    })
  } catch (error) {
    console.log('Error while getting testimonials : ', error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      //   message: 'An unexpected error occurred',
      message: `حدث خطأ غير متوقع`,
      error: error.message,
    })
  }
}
