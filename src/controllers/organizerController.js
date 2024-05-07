import { StatusCodes } from 'http-status-codes'
import Role from '../models/RoleModel.js'
import User from '../models/UserModel.js'
import Trip from '../models/TripModel.js'
import mongoose from 'mongoose'
import JoiningRequest from '../models/JoiningRequestModel.js'
import Sib from 'sib-api-v3-sdk'
import moment from 'moment'

// Get All Organizer Api

export const getAllOrganizers = async (req, res) => {
  try {
    const search = req.query.search || ''
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const skip = (page - 1) * limit

    const organizerId = await Role.findOne({ roleName: 'Organizer' })

    let matchOptions = {
      role: organizerId._id,
      isDeleted: false,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
      ],
    }
    const organizers = User.aggregate([
      {
        $match: matchOptions,
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role',
        },
      },
    ])

    const data = await User.aggregatePaginate(organizers, { page, limit })

    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'ولم يتم العثور على المنظمين' })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم العثور على جميع المنظمين بنجاح',
      data: data,
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء محاولة العثور على كافة المنظمين',
      error: error.message,
    })
  }
}

// Get Single Organizer Api

export const getSingleOrganizer = async (req, res) => {
  try {
    const Organizer = await User.findById(req.params.id).populate('role')
    if (!Organizer) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'المنظم غير موجود' })
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم العثور على المنظم بنجاح',
      data: Organizer,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء محاولة العثور على المنظم الفردي',
      error: error.message,
    })
  }
}

// Particular Organizer's Trip Api

export const getAllTripOfOrganizer = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5

    const trips = Trip.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.user._id) },
      },
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'user',
          as: 'user',
        },
      },
      {
        $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'destinations',
          localField: 'destination',
          foreignField: '_id',
          as: 'destination',
        },
      },
      {
        $lookup: {
          from: 'documents',
          localField: 'document',
          foreignField: '_id',
          as: 'document',
        },
      },
      {
        $unwind: { path: '$document', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'joiningrequests',
          localField: '_id',
          foreignField: 'trip',
          as: 'joiningRequests',
        },
      },
      {
        $lookup: {
          from: 'joiningrequests',
          let: { tripId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$trip', '$$tripId'] },
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails',
              },
            },
            {
              $unwind: {
                path: '$userDetails',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $sort: { createdAt: -1 }, // Sort by date in descending order
            },
          ],
          as: 'joiningRequests',
        },
      },
      {
        $lookup: {
          from: 'joiningrequestmetadatas', // Use the correct collection name
          localField: 'joiningRequests._id', // Joining request ID
          foreignField: 'joining',
          as: 'joiningrequestmetadata',
        },
      },
      // Merge the joiningRequests array with the joiningrequestmetadata
      {
        $addFields: {
          joiningRequests: {
            $map: {
              input: '$joiningRequests',
              as: 'request',
              in: {
                $mergeObjects: [
                  '$$request',
                  {
                    joiningrequestmetadata: {
                      $filter: {
                        input: '$joiningrequestmetadata',
                        as: 'metadata',
                        cond: {
                          $eq: ['$$metadata.joining', '$$request._id'],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          // Exclude the joiningrequestmetadata field
          joiningrequestmetadata: 0,
        },
      },
    ])
    const data = await Trip.aggregatePaginate(trips, { page, limit })
    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'لا يمكن العثور على الرحلات' })
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم العثور على الرحلات بنجاح',
      data: data,
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء محاولة العثور على جميع رحلات المنظم',
      error: error.message,
    })
  }
}

// Update Joining Request Api

export const updateJoiningRequest = async (req, res) => {
  try {
    const mois = [
      'كانون الثاني',
      'شباط',
      'آذار',
      'نيسان',
      'أيار',
      'حزيران',
      'تموز',
      'آب',
      'أيلول',
      'تشرين الأول',
      'تشرين الثاني',
      'كانون الأول',
    ]
    function arrabicTodayDate(date) {
      let today = new Date(date)

      let year = today.getFullYear()
      let dayNumber = today.getDate()
      let month = mois[today.getMonth()]
      let weekday = today.toLocaleDateString('ar-SA', { weekday: 'long' })

      let newDate = `${dayNumber}/${month}/${year}`

      return newDate
    }
    const status = req.body.status
    const id = req.params.id
    const joiningRequest = await JoiningRequest.findById(id)
      .populate('user')
      .populate('trip')

    if (!joiningRequest) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'تعذر العثور على طلب الانضمام' })
    }

    // console.log(joiningRequest)
    const organizer = await User.findById(joiningRequest.trip.user)

    if (organizer) {
      joiningRequest.status = status
      const formattedDate = arrabicTodayDate(joiningRequest.trip.tripDate)
      // const originalDate = new Date(joiningRequest.trip.tripDate);
      // const formattedDate = moment(originalDate).format('MMMM DD, YYYY');

      const client = Sib.ApiClient.instance
      const apiKey = client.authentications['api-key']
      apiKey.apiKey = process.env.API_KEY
      const tranEmailApi = new Sib.TransactionalEmailsApi()

      const sender = {
        email: organizer.email,
        name: `${organizer.email}`,
      }

      const receivers = [
        {
          email: joiningRequest.user.email,
        },
      ]
      let statusData
      if (status === 'Accepted') {
        statusData = 'قبلت'
      } else {
        statusData = 'مرفوض'
      }
      let duration = ''
      if (joiningRequest.trip.tripDuration === 'One week') {
        duration = 'سبوعي'
      } else if (joiningRequest.trip.tripDuration === 'Two weeks') {
        duration = 'إسبوعين'
      } else if (joiningRequest.trip.tripDuration === 'Month') {
        duration = 'شهر'
      } else {
        duration = 'أكثر من شهر'
      }

      let emailResult = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: `طلب رحلة ${statusData}`,
        textContent: `مرحبًا ${joiningRequest.user.email}،\n\nتم ${statusData} طلب رحلتك.`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif;">
          <h2>طلب رحلة ${statusData}</h2>
          <p>مرحبًا ${joiningRequest.user.name}،</p>
          <p>تم ${statusData} طلب رحلتك.</p>
          <p>تفاصيل الرحلة:</p>
          <ul>
            <li><strong>تاريخ الرحلة:</strong> ${formattedDate}</li>
            <li><strong>المنظم:</strong> ${organizer.name}</li>
            <li><strong>مدة الرحلة:</strong> ${duration}</li>
          </ul>
          <p>نتمنى لك رحلة ممتعة!</p>
          <p>أطيب التحيات،</p>
          <p>فريق منظمي الرحلات الخاص بك</p>
        </div>
          `,
        params: {
          role: 'Frontend',
        },
      })

      await joiningRequest.save()

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'تم تحديث طلب الانضمام',
        data: joiningRequest,
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.OK).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث طلب الانضمام',
      error: error.message,
    })
  }
}

// Export All Organizer Api

export const exportAllOrganizer = async (req, res) => {
  try {
    const organizer = await Role.findOne({ roleName: 'Organizer' })

    const organizers = await User.find({
      role: organizer._id,
      isDeleted: false,
    })

    if (!organizers) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'ولم يتم العثور على المنظمين' })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم العثور على جميع المنظمين بنجاح',
      data: organizers,
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء محاولة العثور على كافة المنظمين',
      error: error.message,
    })
  }
}

// Get All Organizers Name Api

export const getAllOrganizersName = async (req, res) => {
  try {
    const search = req.query.search || ''

    const organizer = await Role.findOne({ roleName: 'Organizer' })

    let matchOptions = {
      role: organizer._id,
      isDeleted: false,
      $or: [{ name: { $regex: '.*' + search + '.*', $options: 'i' } }],
    }
    const organizers = await User.aggregate([
      {
        $match: matchOptions,
      },
    ])

    if (!organizers) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'ولم يتم العثور على المنظمين' })
    }
    const organizersName = organizers?.map(organizer => {
      return organizer.name
    })

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم العثور على جميع أسماء المنظمين بنجاح',
      data: organizersName,
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء محاولة العثور على كافة المنظمين',
      error: error.message,
    })
  }
}

//Get All Marketing Name Api

export const getAllMarketingFields = async (req, res) => {
  try {
    const search = req.query.search || ''

    const organizer = await Role.findOne({ roleName: 'Organizer' })

    let matchOptions = {
      role: organizer._id,
      isDeleted: false,
      $or: [{ name: { $regex: '.*' + search + '.*', $options: 'i' } }],
    }
    const organizers = await User.aggregate([
      {
        $match: matchOptions,
      },
    ])

    if (!organizers) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'لم يتم العثور على حقل التسويق' })
    }
    const marketingFields = organizers?.map(organizer => {
      return organizer.marketing
    })

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم العثور على مجال التسويق بنجاح',
      data: marketingFields,
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ عند البحث عن حقول التسويق',
      error: error.message,
    })
  }
}
