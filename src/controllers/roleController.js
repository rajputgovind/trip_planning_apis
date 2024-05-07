import { StatusCodes } from 'http-status-codes'
import Role from '../models/RoleModel.js'

// Create Role Api

export const postRole = async (req, res) => {
  try {
    const { roleName } = req.body

    if (!roleName) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          success: false,
          message: 'يرجى التأكد من ملء جميع الحقول بشكل صحيح',
        })
    }
    const role = new Role({ roleName })
    const roleData = await role.save()

    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: 'تم إنشاء الدور بنجاح', data: roleData })
  } catch (error) {
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: true,
        message: 'حدث خطأ أثناء إنشاء الدور',
        error: error.message,
      })
  }
}

// Get All Roles Api

export const getAllRole = async (req, res) => {
  try {
    const role = await Role.find({})
    if (!role) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'لا يمكن العثور على الدور' })
    }
    return res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: 'تم العثور على جميع الأدوار بنجاح',
        data: role,
      })
  } catch (error) {
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: true, message: 'حدث خطأ أثناء محاولة البحث عن الأدوار' })
  }
}
