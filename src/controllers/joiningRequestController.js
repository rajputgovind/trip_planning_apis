import { StatusCodes } from 'http-status-codes'
import JoiningRequest from '../models/JoiningRequestModel.js'
import mongoose from 'mongoose'
import JoiningRequestMetaData from '../models/JoiningRequestMetaData.js'
import Trip from '../models/TripModel.js'

// Create Joining request Api

export const createJoiningRequest = async (req, res) => {
  try {
    const trip = await Trip.findById(req.body.tripId)

    if (trip.tripStatus === false) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({
          success: false,
          message:
            'لا يمكنك الانضمام إلى هذه الرحلة لأن هذه الرحلة في مرحلة غير نشطة.',
        })
    }

    const joiningRequest = await JoiningRequest.findOne({
      trip: req.body.tripId,
      user: req.user._id,
    })
    // console.log(joiningRequest)
    if (joiningRequest) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          success: false,
          message: 'لقد قمت بالفعل بتقديم طلب الانضمام لهذه الرحلة',
        })
    }

    const fields = req.body.fields

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        const value = fields[key]

        if (!value) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: `قيمة المفتاح '${key}' مفقودة`,
          })
        }

        if (key === 'email' && !isValidEmail(value)) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: `تنسيق عنوان البريد الإلكتروني غير صالح لمفتاح "البريد الإلكتروني"`,
          })
        }
      }
    }

    const newJoiningRequest = new JoiningRequest({
      user: req.user._id,
      trip: req.body.tripId,
      // status:req.body.status
    })

    const savedJoiningRequest = await newJoiningRequest.save()
    // console.log(req.body, "req");

    let metaData
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        const value = fields[key]

        if (!value) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: `قيمة المفتاح '${key}' مفقودة`,
          })
        }

        metaData = new JoiningRequestMetaData({
          joining: savedJoiningRequest._id,
          key: key,
          value: fields[key],
        })
        await metaData.save()
      }
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'تم إنشاء طلب الانضمام',
      data: metaData,
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء طلب الانضمام',
      error: error.message,
    })
  }
}

// Upload File Api

export const uploadFile = async (req, res) => {
  try {
    // const image = req.file? req.file.filename :''
    if (!req.files) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'الرجاء اختيار الملف' })
    }
    const images = req.files ? req.files.uploadImage : []
    const image = images?.map(item => item.filename)

    console.log(req.files)
    const tripId = req.params.id

    const trip = await JoiningRequest.findOne({
      trip: tripId,
      user: req.user._id,
    })

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'لا يمكن العثور على الرحلة' })
    }
    if (trip.uploadImage.length > 0) {
      trip.uploadImage.push(...image)
      // return res.status(StatusCodes.BAD_REQUEST).json({success:false, message:"تم تحميل الملف بالفعل"})
    } else {
      trip.uploadImage = image
    }

    await trip.save()

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'تم تحميل الصورة بنجاح', data: trip })
  } catch (error) {
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'حدث خطأ أثناء تحميل الملف' })
  }
}

// Get All Request Of User

export const getAllJoiningRequestOfUser = async (req, res) => {
  try {
    const userId = req.user._id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    // const joiningRequest =await JoiningRequest.find({user:userId}).populate('trip').populate('user')

    const joiningRequest = JoiningRequest.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'trips',
          localField: 'trip',
          foreignField: '_id',
          as: 'trip',
        },
      },
      {
        $unwind: { path: '$trip', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'destinations',
          localField: 'trip.destination',
          foreignField: '_id',
          as: 'destination',
        },
      },
      {
        $addFields: {
          'trip.destination': '$destination',
        },
      },
      {
        $project: {
          destination: 0,
        },
      },
    ])
    const data = await JoiningRequest.aggregatePaginate(joiningRequest, {
      page,
      limit,
    })
    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'تعذر العثور على طلب الانضمام' })
    }
    return res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: 'البحث عن جميع طلبات الانضمام للمستخدم',
        data: data,
      })
  } catch (error) {
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: 'حدث خطأ أثناء محاولة العثور على طلبات الانضمام',
      })
  }
}

// Delete Joining Request Api

export const deleteJoiningRequest = async (req, res) => {
  try {
    const joiningRequest = await JoiningRequest.findByIdAndDelete(req.params.id)
    if (!joiningRequest) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'تعذر تحديد موقع طلب الانضمام' })
    }
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'تم حذف طلب الانضمام' })
  } catch (error) {
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: 'حدث خطأ أثناء حذف طلب الانضمام',
        error: error.message,
      })
  }
}
