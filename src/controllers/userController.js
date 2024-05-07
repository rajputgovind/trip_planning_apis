import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import User from '../models/UserModel.js'
import moment from 'moment'
import Role from '../models/RoleModel.js'
import { validationResult } from 'express-validator'
import errorHandler from '../middleware/validationErrorHandler.js'
import Sib from 'sib-api-v3-sdk'
import Trip from '../models/TripModel.js'

// Registration Api

export const userRegistration = async (req, res) => {
  try {
    const errors = validationResult(req)
    const errMessages = errorHandler(errors)

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages })
    }

    const { name, email, phone, password, role, birthDate, marketing } =
      req.body
    // console.log(marketing)
    const isEmailMatch = await User.findOne({ email: email })

    if (isEmailMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'البريد الإلكتروني موجود بالفعل' })
    }

    const hashPassword = bcryptjs.hashSync(password, 10)

    const user = new User({
      name,
      email,
      birthDate,
      phone,
      password: hashPassword,
      marketing: marketing != undefined ? marketing : '',
      role,
    })

    const token = await user.generateAuthToken()
    // Code For Sending Mail

    const checkOrganizer = await Role.findById(user.role)

    if (checkOrganizer && checkOrganizer.roleName === 'Organizer') {
      // console.log("organizer registration")
      const client = Sib.ApiClient.instance
      const apiKey = client.authentications['api-key']
      apiKey.apiKey = process.env.API_KEY
      const tranEmailApi = new Sib.TransactionalEmailsApi()

      const sender = {
        email: req.body.email,
        name: `${req.body.email}`,
      }

      const receivers = [
        {
          email: process.env.ADMIN_EMAIL,
        },
      ]

      let emailResult = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'تسجيل منظم جديد',
        textContent:
          'مرحبًا أيها المسؤول،\n\nلقد قام منظم جديد بالتسجيل. يرجى مراجعة تفاصيلهم.',
        htmlContent: `
        <div style="font-family: Arial, sans-serif;">
        <h2>تسجيل منظم جديد</h2>
        <p>مرحبًا أيها المسؤول،</p>
        <p>لقد قام منظم جديد بالتسجيل. يرجى مراجعة تفاصيلهم.</p>
        <p>معلومات المنظم:</p>
        <ul>
          <li><strong>الاسم:</strong> ${req.body.name}</li>
          <li><strong>البريد الإلكتروني:</strong> ${req.body.email}</li>
          <li><strong>الدور:</strong> ${checkOrganizer.roleName}</li>
        </ul>
        <p>شكرًا لك.</p>
        <p>يمكنك إدارة جميع المنظمين <a href="https://admin.gate8.travel/organizer">من هنا</a>.</p>
      </div>
        `,
        params: {
          role: 'Frontend',
        },
      })
    }

    const userData = await user.save()
    await userData.populate('role')

    if (checkOrganizer.roleName === 'Organizer') {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'التسجيل ناجح!',
        data: userData,
      })
    }
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'التسجيل ناجح!!',
      data: userData,
      token:token
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل المستخدم',
      error: error.message,
    })
  }
}

// Login Api

export const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    const errMessages = errorHandler(errors)

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages })
    }

    const email = req.body.email
    const password = req.body.password

    // if(!email || !password){
    //   return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"Please fill all fields properly"})
    // }
    const user = await User.findOne({ email: email }).populate('role')

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'المستخدم غير موجود' })
    }

    const role = await Role.findById(user.role)
    const isPasswordMatch = bcryptjs.compareSync(password, user.password)
    if (isPasswordMatch) {
      const token = await user.generateAuthToken()

      if (user.isDeleted === true) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message:
            'لا يمكن لهذا المستخدم تسجيل الدخول. لقد تم حذف هذا بالفعل من قبل المشرف',
        })
      } else if (user.isOrganizer && role.roleName === 'Organizer') {
        return res.status(StatusCodes.OK).json({
          success: true,
          message: 'تم تسجيل دخول المنظم بنجاح!',
          data: user,
          token: token,
        })
      } else if (user.isOrganizer === false && role.roleName === 'Organizer') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'لم يوافق عليك المشرف كمنظم',
        })
      } else if (role.roleName == 'Admin') {
        return res.status(StatusCodes.OK).json({
          success: true,
          message: 'تم تسجيل دخول المشرف بنجاح!',
          data: user,
          token: token,
        })
      } else {
        return res.status(StatusCodes.OK).json({
          success: true,
          message: 'تم تسجيل دخول المستخدم بنجاح!',
          data: user,
          token: token,
        })
      }
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'اعتماد تسجيل الدخول غير صالح' })
    }
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل دخول المستخدم',
      error: error.message,
    })
  }
}

// Get All User Api

export const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || ''
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const skip = (page - 1) * limit

    const userId = await Role.findOne({ roleName: 'User' })

    let matchOptions = {
      role: userId._id,
      isDeleted: false,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
      ],
    }
    // if(req.query.category){
    //   matchOptions.category = req.query.category
    // }
    const users = User.aggregate([
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
    const data = await User.aggregatePaginate(users, { page, limit })
    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'لا يمكن العثور على المستخدم' })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم العثور على كافة المستخدمين بنجاح',
      data: data,
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء محاولة البحث عن كافة المستخدمين',
      error: error.message,
    })
  }
}

// Get Single User Api For Admin

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('role')
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'المستخدم غير موجود' })
    }
    return res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: 'تم العثور على المستخدم بنجاح',
        data: user,
      })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء محاولة العثور على المستخدم الوحيد',
      error: error.message,
    })
  }
}

// Get Single User Api

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('role')
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'المستخدم غير موجود' })
    }
    return res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: 'تم العثور على المستخدم بنجاح',
        data: user,
      })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء محاولة العثور على المستخدم الوحيد',
      error: error.message,
    })
  }
}

// Update User Api

export const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req)
    const errMessages = errorHandler(errors)
    if (errMessages && errMessages.length) {
      return res.status(400).json({
        success: false,
        errMessages,
      })
    }

    const userId = req.params.id
    const updates = Object.keys(req.body)

    const user = await User.findById(req.user._id)

    if (req.body.password) {
      const hashPassword = bcryptjs.hashSync(req.body.password, 10)
      req.body['password'] = hashPassword
    }

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `لا يمكن العثور على المستخدم`,
      })
    }

    if (req.file) {
      const image = req.file.filename
      user.profileImage = image
    }

    const allowedUpdates = ['name', 'phone', 'birthDate', 'password']

    const isValidUpdates = updates.every(update =>
      allowedUpdates.includes(update)
    )

    if (!isValidUpdates) {
      throw new Error('تحديثات غير صالحة')
    }
    updates.forEach(update => {
      user[update] = req.body[update]
    })

    await user.save()

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم التحديث بنجاح',
      data: user,
    })
  } catch (error) {
    console.log(error)

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء التحديث',
      error: error.message,
    })
  }
}

// Delete User Apis

export const deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id)
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'لا يمكن العثور على المستخدم' })
    }

    user.isDeleted = true

    await user.save()

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'حذف بنجاح', data: user })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء الحذف',
      error: error.message,
    })
  }
}

// Count Users Organizers And Trips Api

export const countAll = async (req, res) => {
  try {
    const userId = await Role.findOne({ roleName: 'User' })
    const users = await User.find({
      role: userId._id,
      isDeleted: false,
    }).countDocuments()

    const organizerId = await Role.findOne({ roleName: 'Organizer' })
    const organizers = await User.find({
      role: organizerId._id,
      isDeleted: false,
    }).countDocuments()

    const trips = await Trip.countDocuments()

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'العد ناجح',
      users: users,
      organizers: organizers,
      trips: trips,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء حساب كافة المستخدمين',
      error: error.message,
    })
  }
}

// Forget Password Api

export const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    const errMessages = errorHandler(errors)

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages })
    }

    const email = req.body.email
    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'المستخدم غير موجود',
      })
    }
    if (user) {
      const otp = Math.random().toString().substring(2, 8)
      const currentDate = new Date()
      const expire = currentDate.setMinutes(currentDate.getMinutes() + 5)

      user.otp = {
        value: otp,
        expire,
      }

      // Mail code

      const client = Sib.ApiClient.instance
      const apiKey = client.authentications['api-key']
      apiKey.apiKey = process.env.API_KEY
      const tranEmailApi = new Sib.TransactionalEmailsApi()

      const sender = {
        email: process.env.ADMIN_EMAIL,
        name: `${process.env.ADMIN_EMAIL}`,
      }

      const receivers = [
        {
          email: req.body.email,
        },
      ]

      let emailResult = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'إعادة تعيين كلمة المرور',
        textContent: 'عزيزي المستخدم، قم بإعادة تعيين كلمة المرور',
        htmlContent: `
      <div style="font-family: Arial, sans-serif;">
      <h2>إعادة تعيين كلمة المرور</h2>
      <p>عزيزي المستخدم،</p>
      <p>لإعادة تعيين كلمة المرور، انقر على الرابط التالي:</p>
      <p><a href="http://localhost:5000/api/users/reset-password">إعادة تعيين كلمة المرور</a></p>
      <p>رمز التحقق الخاص بك <strong>${otp}</strong> صالح لمدة 5 دقائق</p>
      <p>أطيب التحيات،<br>شكرًا لك</p>
      </div>
      `,
        params: {
          role: 'Frontend',
        },
      })

      await user.save()
      return res
        .status(StatusCodes.OK)
        .json({
          success: true,
          message:
            'يرجى التحقق من بريدك الإلكتروني وإعادة تعيين كلمة المرور الخاصة بك',
        })
    }
  } catch (error) {
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'حدث خطأ أثناء نسيان كلمة المرور' })
  }
}

// Reset Password

export const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    const errMessages = errorHandler(errors)

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages })
    }

    const { email, otp, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, error: 'لم يتم العثور على المستخدم' })
    }
    if (user.otp.value !== otp) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, error: 'كلمة مرور لمرة واحدة غير صحيحة' })
    }
    if (user.otp.expire < new Date()) {
      user.otp = undefined
      await user.save()
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({
          success: false,
          error: 'انتهت صلاحية كلمة المرور المؤقتة (OTP).',
        })
    }
    const newPasswordMatch = await bcryptjs.compare(password, user.password)
    if (newPasswordMatch) {
      throw new Error(
        'لا يمكن أن تكون كلمة المرور الحالية وكلمة المرور الجديدة متماثلتين'
      )
    }

    const hashPassword = bcryptjs.hashSync(password, 10)

    user.password = hashPassword
    user.otp = undefined
    await user.save()
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم تغيير كلمة السر',
    })
  } catch (error) {
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: 'حدث خطأ أثناء إعادة تعيين كلمة المرور',
        error: error.message,
      })
  }
}

// Export All Organizer Api

export const exportAllUsers = async (req, res) => {
  try {
    const user = await Role.findOne({ roleName: 'User' })

    const users = await User.find({ role: user._id, isDeleted: false })

    if (!users) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'لا يمكن العثور على المستخدم' })
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم العثور على كافة المستخدمين بنجاح',
      data: users,
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء محاولة البحث عن كافة المستخدمين',
      error: error.message,
    })
  }
}
