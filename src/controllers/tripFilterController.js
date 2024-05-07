import { StatusCodes } from 'http-status-codes'
import TripFilter from '../models/TripFilterModel.js'

// Trip Filter Update Api

export const createTripFilter = async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    const tripFilter = await TripFilter.findOne()

    if (!tripFilter) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'اقتراح غير جيد' })
    }

    updates.forEach(update => {
      tripFilter[update] = req.body[update]
    })
    await tripFilter.save()
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: 'تم تطبيق الفلتر', date: tripFilter })
  } catch (error) {
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'حدث خطأ أثناء تطبيق الفلتر' })
  }
}

// Get All Trip Filter

export const getAllTripFilter = async (req, res) => {
  try {
    const tripFilter = await TripFilter.findOne()
    if (!tripFilter) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'تعذر العثور على مرشح الرحلة' })
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم جلب مرشح الرحلة بالكامل بنجاح',
      data: tripFilter,
    })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'حدث خطأ أثناء جلب مرشح الرحلة' })
  }
}
