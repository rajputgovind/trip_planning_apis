import { StatusCodes } from 'http-status-codes'
import User from '../models/UserModel.js'
import Role from '../models/RoleModel.js'
import Sib from 'sib-api-v3-sdk'
import AdminSetting from '../models/AdminSetttingModel.js'
import errorHandler from '../middleware/validationErrorHandler.js'
import { validationResult } from 'express-validator'

// export const approvedOrganizer = async(req,res)=>{
//     try {
//         const id = req.params.id
//         const user = await User.findById(id)

//         if(!user){
//             return res.status(StatusCodes.NOT_FOUND).json({success : false, message:"لم يتم العثور على المنظم"})
//         }

//    const checkOrganizer = await Role.findById(user.role);

//     if (checkOrganizer && checkOrganizer.roleName === "Organizer") {
//       // console.log("organizer registration")
//       user.isOrganizer = req.body.status

//       const client = Sib.ApiClient.instance;
//       const apiKey = client.authentications["api-key"];
//       apiKey.apiKey = process.env.API_KEY;
//       const tranEmailApi = new Sib.TransactionalEmailsApi();

//       const sender = {
//         email: "govindjadam5@gmail.com",
//         name: `Hii govindjadam5@gmail.com`,
//       };

//       const receivers = [
//         {
//           email: user.email,
//         },
//       ];

//       let emailResult = await tranEmailApi.sendTransacEmail({
//         sender,
//         to: receivers,
//         subject: "Organizer Approval Notification",
//       textContent: "Hello Organizer,\n\nCongratulations! Your request to become an organizer has been approved.",
//       htmlContent: `
//         <div style="font-family: Arial, sans-serif;">
//           <h2>Organizer Approval Notification</h2>
//           <p>Hello Organizer,</p>
//           <p>Congratulations! Your request to become an organizer has been approved.</p>
//           <p>Organizer Information:</p>
//           <ul>
//             <li><strong>Name:</strong> ${user.name}</li>
//             <li><strong>Email:</strong> ${user.email}</li>
//             <li><strong>Role:</strong> ${checkOrganizer.roleName}</li>
//           </ul>
//           <p>Thank you for being a part of our team.</p>
//           <p>You can access your organizer dashboard <a href="https://trip-planning-app.vercel.app/admin/login">here</a>.</p>
//         </div>
//       `,
//       params: {
//         role: "Frontend",
//       },
//     });

//       await user.save()
//     }
//     return res.status(StatusCodes.OK).json({success:true, message:"لقد تمت الموافقة عليك من قبل المشرف للعمل كمنظم", data:user})
//     } catch (error) {
//         console.log(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message:"حدث خطأ أثناء الموافقة على المنظم"})
//     }
// }

export const approvedOrganizer = async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findById(id)

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'Not found' })
    }

    if (req.body.status === true) {
      const checkOrganizer = await Role.findById(user.role)
      if (checkOrganizer && checkOrganizer.roleName === 'Organizer') {
        // console.log("organizer registration")
        user.isOrganizer = req.body.status

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
            email: user.email,
          },
        ]

        let emailResult = await tranEmailApi.sendTransacEmail({
          sender,
          to: receivers,
          subject: 'إشعار بموافقة المنظم',
          textContent:
            'مرحبًا منظمنا،\n\nتهانينا! تمت الموافقة على طلبك لتصبح منظمًا.',
          htmlContent: `
          <div style="font-family: Arial, sans-serif;">
            <h2>إشعار بموافقة المنظم</h2>
            <p>مرحبًا منظمنا،</p>
            <p>تهانينا! تمت الموافقة على طلبك لتصبح منظمًا.</p>
            <p>معلومات المنظم:</p>
            <ul>
              <li><strong>الاسم:</strong> ${user.name}</li>
              <li><strong>البريد الإلكتروني:</strong> ${user.email}</li>
              <li><strong>الدور:</strong> ${checkOrganizer.roleName}</li>
            </ul>
            <p>شكرًا لك على كونك جزءًا من فريقنا.</p>
            <p>يمكنك الوصول إلى لوحة التحكم الخاصة بك كمنظم <a href="https://gate8.travel/admin/login">من هنا</a>.</p>
          </div>
          `,
          params: {
            role: 'Frontend',
          },
        })

        await user.save()
        return res.status(StatusCodes.OK).json({
          success: true,
          message: 'لقد تمت الموافقة عليك من قبل المشرف للعمل كمنظم',
          data: user,
        })
      }
    } else {
      const checkOrganizer = await Role.findById(user.role)
      if (checkOrganizer && checkOrganizer.roleName === 'Organizer') {
        // console.log("organizer registration")
        user.isOrganizer = req.body.status

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
            email: user.email,
          },
        ]

        let emailResult = await tranEmailApi.sendTransacEmail({
          sender,
          to: receivers,
          subject: 'حالة طلب المنظم',
          textContent:
            'مرحبًا منظمنا،\n\nنأسف لإعلامكم بأن طلبكم لتصبحوا منظمين قد تم رفضه.',
          htmlContent: `
          <div style="font-family: Arial, sans-serif;">
          <h2>حالة طلب المنظم</h2>
          <p>مرحبًا منظمنا،</p>
          <p>نأسف لإعلامكم بأن طلبكم لتصبحوا منظمين قد تم رفضه.</p>
          <p>للأسف، لا يمكننا متابعة طلبكم في الوقت الحالي.</p>
          <p>شكرًا لكم على النظر فينا، ونقدر اهتمامكم.</p>
          </div>
          `,
          params: {
            role: 'Frontend',
          },
        })

        await user.save()
        return res.status(StatusCodes.OK).json({
          success: true,
          message: 'لقد تم رفض طلبك لتصبح منظمًا',
          data: user,
        })
      }
    }
  } catch (error) {
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'حدث خطأ أثناء الموافقة على المنظم' })
  }
}

// Get admin setting Api

export const getAdminSetting = async (req, res) => {
  try {
    const adminSetting = await AdminSetting.findOne({})
    if (!adminSetting) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'لا يمكن العثور على إعداد المسؤول.' })
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم العثور على إعداد المسؤول بنجاح.',
      data: adminSetting,
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ عند العثور على إعداد المسؤول.',
      error: error.message,
    })
  }
}

// Update admin setting Api

export const updateAdminSetting = async (req, res) => {
  try {
    const errors = validationResult(req)
    const errMessages = errorHandler(errors)

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages })
    }
    const adminSettingId = req.params.id
    const {
      heading,
      mainContent,
      headerColor,
      email,
      city,
      zipCode,
      state,
      address,
      linkedInUrl,
      twitterUrl,
      instagramUrl,
      facebookUrl,
      termsAndConditions,
      privacyPolicy,
      aboutUs,
      vision
    } = req.body

    const setting = await AdminSetting.findOne({})

    const logoImage = req.files?.mainLogo
      ? req.files?.mainLogo[0].filename
      : setting.mainLogo

    const homeBgImage = req.files?.homePageBannerImage
      ? req.files?.homePageBannerImage[0].filename
      : setting.homePageBannerImage

    const searchBgImage = req.files?.searchPageBannerImage
      ? req.files?.searchPageBannerImage[0].filename
      : setting.searchPageBannerImage

    const updateAdminSettingData = {
      mainLogo: logoImage,
      heading,
      mainContent,
      headerColor,
      homePageBannerImage: homeBgImage,
      searchPageBannerImage: searchBgImage,
      email,
      city,
      zipCode,
      state,
      address,
      linkedInUrl,
      twitterUrl,
      instagramUrl,
      facebookUrl,
      termsAndConditions,
      privacyPolicy,
      aboutUs,
      vision
    }

    const adminSetting = await AdminSetting.findByIdAndUpdate(
      adminSettingId,
      updateAdminSettingData,
      { new: true }
    )

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'تم تحديث إعداد المسؤول بنجاح',
      data: adminSetting,
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث إعداد المسؤول.',
      error: error.message,
    })
  }
}
