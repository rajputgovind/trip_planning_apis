import { check, body, param, query } from 'express-validator'

export const validateRegister = [
  check('name')
    .notEmpty()
    .withMessage('مطلوب اسم')
    // .withMessage("Name is required")
    .isString()
    .withMessage('يجب أن يكون الاسم من نوع السلسلة')
    // .withMessage("Name must be of string type")

    .isLength({ min: 3 })
    .withMessage('يجب أن يحتوي الاسم على 3 أحرف على الأقل'),
  // .withMessage("Name must contain atleast 3 chars"),

  check('email')
    .notEmpty()
    .withMessage('البريد الالكتروني مطلوب')
    // .withMessage("Email is required")

    .isEmail()
    .withMessage('الرجاء إدخال بريد إلكتروني صحيح')
    // .withMessage("Please enter valid email")

    .normalizeEmail(),

  check('role')
    .isMongoId()
    .withMessage('دور غير صالح')
    // .withMessage("Invalid role")

    .notEmpty()
    .withMessage('الدور مطلوب'),
  // .withMessage("Role is required"),

  check('phone')
    .notEmpty()
    .withMessage('رقم الهاتف مطلوب')
    // .withMessage("Phone number is required")

    .isNumeric()
    .withMessage('رقم الهاتف يجب أن يكون رقمياً')
    // .withMessage("Phone number must be numeric")

    .isLength({ min: 5 })
    .withMessage('رقم الهاتف يجب أن يكون الحد الأدنى 5 أرقام'),
  // .withMessage("Phone number must be minimum 5 digit"),

  // check("birthDate")
  //   .notEmpty()
  //   .withMessage("تاريخ الميلاد مطلوب")
  //   // .withMessage("Date of birth is required")
  //   // .isDate()
  //   // .withMessage('Invalid date format')
  //   .custom((value) => {
  //     const dob = new Date(value);
  //     const currentDate = new Date();

  //     if (dob >= currentDate) {
  //       throw new Error("يجب أن يكون تاريخ الميلاد في الماضي");
  //       // throw new Error("Date of birth must be in the past");
  //     }

  //     return true;
  //   }),

  check('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
    // .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage('يجب أن يكون طول كلمة المرور أكبر من 5'),
  // .withMessage("Password must be of length greater than 5"),

  // check("countryCode")
  // .notEmpty()
  // // .withMessage("رمز البلد مطلوب")
  // .withMessage("Country code is required")
  // .isString()
  // // .withMessage("يجب أن يكون رمز البلد من نوع السلسلة"),
  // .withMessage("Country code must be of string type"),
]

export const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('يجب ألا يكون حقل البريد الإلكتروني فارغًا')
    // .withMessage("Email field should not be empty")
    .isEmail()
    .withMessage('الرجاء إدخال بريد إلكتروني صحيح'),
  // .withMessage("Please enter valid email"),

  body('password')
    .notEmpty()
    .withMessage('يجب ألا يكون حقل كلمة المرور فارغًا')
    // .withMessage("Password Field should not be empty")
    .isLength({ min: 6 })
    .withMessage('يجب أن تحتوي كلمة المرور على أكثر من 6 أحرف'),
  // .withMessage("Password must contain more than 6 chars"),
]

export const validateProfile = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('يجب ألا يكون الاسم فارغًا')
    // .withMessage("Name must not be empty")
    .isString()
    .withMessage('الرجاء إدخال اسم صالح لنوع السلسلة')
    // .withMessage("Please enter valid name of type String")
    .isLength({ min: 3 })
    .withMessage('يجب أن يحتوي الاسم على 3 أحرف على الأقل'),
  // .withMessage("Name must contain atleast 3 chars"),

  body('phone')
    .optional()
    .notEmpty()
    .withMessage('يجب ألا يكون رقم الهاتف فارغا')
    // .withMessage("Phone number must not be empty")
    .isNumeric()
    .withMessage('رقم الهاتف يجب أن يكون رقمياً')
    // .withMessage("Phone number must be numeric")
    .isLength({ min: 5 })
    .withMessage('رقم الهاتف يجب أن يكون الحد الأدنى 5 أرقام'),
  // .withMessage("Phone number must be minimum 5 digit"),

  check('birthDate')
    .optional()
    .notEmpty()
    .withMessage('تاريخ الميلاد مطلوب')
    // .withMessage("Date of birth is required")
    // .isDate()
    // .withMessage('Invalid date format')
    .custom(value => {
      const dob = new Date(value)
      const currentDate = new Date()

      if (dob >= currentDate) {
        throw new Error('يجب أن يكون تاريخ الميلاد في الماضي')
        // throw new Error("Date of birth must be in the past");
      }

      return true
    }),
]

export const validateDestination = [
  check('city')
    .notEmpty()
    .withMessage('المدينة مطلوبة')
    // .withMessage("City is required")
    .isString()
    .withMessage('يجب أن تكون المدينة من نوع السلسلة')
    // .withMessage("City must be of string type")
    .isLength({ min: 3 })
    .withMessage('يجب أن تحتوي المدينة على 3 أحرف على الأقل'),
  // .withMessage("City must contain atleast 3 chars"),

  check('destinationDate')
    .notEmpty()
    .withMessage('تاريخ الوجهة مطلوب')
    // .withMessage("Destination date is required")
    .custom(value => {
      const dob = new Date(value)
      const currentDate = new Date()

      if (dob <= currentDate) {
        throw new Error('يجب أن يكون تاريخ الوجهة في المستقبل')
        // throw new Error("Destination date must be in the future");
      }

      return true
    }),
  // .isDate()
  // .withMessage("Invalid date"),

  check('duration')
    .notEmpty()
    .withMessage('المدة حقل مطلوب')
    // .withMessage("Duration is required field")
    .isNumeric()
    .withMessage('يجب أن تكون المدة من النوع الرقمي'),
  // .withMessage("Duration must be of number type"),

  check('agenda')
    .notEmpty()
    .withMessage('جدول الأعمال حقل مطلوب')
    // .withMessage("Agenda is required field")
    .isString()
    .withMessage(),

  check('hotelName')
    .notEmpty()
    .withMessage('اسم الفندق حقل مطلوب')
    // .withMessage("Hotel name is required field")

    .isString()
    .withMessage('يجب أن يكون اسم الفندق من نوع السلسلة'),
  // .withMessage("Hotel name must be string type"),

  check('destinationImage').custom((value, { req }) => {
    if (!req.files) {
      throw new Error('الرجاء اختيار صورة الوجهة')
      // throw new Error("Please choose destination Image");
    }

    return true
  }),
]

export const validateUpdateDestination = [
  check('city')
    .optional()
    .isString()
    .withMessage('يجب أن تكون المدينة من نوع السلسلة')
    // .withMessage("City must be of string type")
    .isLength({ min: 3 })
    .withMessage('يجب أن تحتوي المدينة على 3 أحرف على الأقل'),
  // .withMessage("City must contain atleast 3 chars"),

  check('destinationDate')
    .optional()
    .custom(value => {
      const dob = new Date(value)
      const currentDate = new Date()

      if (dob <= currentDate) {
        throw new Error('يجب أن يكون تاريخ الوجهة في المستقبل')
        // throw new Error("Destination date must be in the future");
      }

      return true
    }),
  // .isDate()
  // .withMessage("Invalid date"),

  check('duration')
    .optional()
    .isNumeric()
    .withMessage('يجب أن تكون المدة من النوع الرقمي'),
  // .withMessage("Duration must be of number type"),

  check('agenda')
    .optional()
    .isString()
    .withMessage('يجب أن يكون جدول الأعمال من نوع السلسلة'),
  // .withMessage("Agenda must be of string type"),

  check('hotelName')
    .optional()
    .notEmpty()
    .withMessage('اسم الفندق حقل مطلوب')
    // .withMessage("Hotel name is required field")

    .isString()
    .withMessage('يجب أن يكون اسم الفندق من نوع السلسلة'),
  // .withMessage("Hotel name must be string type"),

  check('destinationImage')
    .optional()

    .custom((value, { req }) => {
      if (!req.files) {
        throw new Error('الرجاء اختيار صورة الوجهة')
        // throw new Error("Please choose destination Image");
      }

      return true
    }),
]

export const validateTrip = [
  check('country')
    .notEmpty()
    .withMessage('الدولة مطلوبة')
    // .withMessage("Country is required")
    .isString()
    .withMessage('يجب أن تكون الدولة من نوع السلسلة')
    // .withMessage("Country must be of string type")
    .isLength({ min: 3 })
    .withMessage('يجب أن يحتوي البلد على 3 أحرف على الأقل'),
  // .withMessage("Country must contain atleast 3 chars"),

  check('tripDate')
    .notEmpty()
    .withMessage('تاريخ الرحلة مطلوب')
    // .withMessage("Trip date is required")
    .custom(value => {
      const dob = new Date(value)
      const currentDate = new Date()

      if (dob <= currentDate) {
        throw new Error('يجب أن يكون تاريخ الرحلة في المستقبل')
        // throw new Error("Trip date must be in the future");
      }

      return true
    }),

  check('tripDuration')
    .notEmpty()
    .withMessage('مدة الرحلة حقل مطلوب')
    // .withMessage("Trip Duration is required field")
    .isNumeric()
    .withMessage('يجب أن تكون مدة الرحلة من نوع الرقم'),
  // .withMessage("Trip Duration must be number type")
  // .isIn(["One week", "Two weeks", "Month", "More than a month"])
  // .withMessage('قيمة مدة الرحلة غير صالحة'),
  // .withMessage('Invalid trip duration value'),

  check('tripIncludes')
    .notEmpty()
    .withMessage('تتضمن الرحلة حقل مطلوب')
    // .withMessage("Trip Includes is required field")
    .isString()
    .withMessage('يجب أن تكون الرحلة من نوع السلسلة'),
  // .withMessage("Trip includes must be of string type"),

  check('mainTripImage').custom((value, { req }) => {
    if (!req.files && !req.files.mainTripImage) {
      throw new Error('الرجاء اختيار صورة الرحلة')
      // throw new Error("Please choose Trip Image");
    }

    return true
  }),

  check('tripLogo').custom((value, { req }) => {
    if (!req.files && !req.files.tripLogo) {
      throw new Error('الرجاء اختيار شعار الرحلة')
      // throw new Error("Please choose Trip Logo");
    }

    return true
  }),
  check('tripPrice')
    .notEmpty()
    .withMessage('يجب ألا يكون السعر فارغًا')
    // .withMessage("Price must not be empty")
    .isString()
    .withMessage('يجب أن يكون السعر رقميًا'),
  // .withMessage("Price must be numeric"),

  check('groupType')
    .notEmpty()
    .withMessage('نوع المجموعة حقل مطلوب')
    // .withMessage("Group Type is required field")
    .isString()
    .withMessage('يجب أن يكون نوع المجموعة من نوع السلسلة')
    // .withMessage("Group Type must be of string type")
    .isIn(['Male', 'Female', 'Families', 'Men', 'Women', 'Students'])
    .withMessage('قيمة نوع المجموعة غير صالحة'),
  // .withMessage('Invalid group type value'),

  check('tripType')
    .notEmpty()
    .withMessage('نوع الرحلة حقل مطلوب')
    // .withMessage("Trip Type is required field")
    .isString()
    .withMessage('يجب أن يكون نوع الرحلة من نوع السلسلة')
    // .withMessage("Trip Type must be of string type")
    .isIn([
      'Adventure',
      'Hunt',
      'Historical',
      'Nature',
      'Tourism',
      'Hunting',
      'Therapeutic',
      'Training',
      'Educational',
    ])
    .withMessage('قيمة نوع الرحلة غير صالحة'),
  // .withMessage('Invalid trip type value'),

  check('tripName')
    .notEmpty()
    .withMessage('اسم الرحلة حقل مطلوب')
    // .withMessage("Trip Name is required field")
    .isString()
    .withMessage('يجب أن يكون اسم الرحلة من نوع السلسلة'),
  // .withMessage("Trip Name must be of string type"),

  check('contactName')
    .notEmpty()
    .withMessage('مطلوب اسم')
    // .withMessage("Name is required")
    .isString()
    .withMessage('يجب أن يكون الاسم من نوع السلسلة')
    // .withMessage("Name must be of string type")
    .isLength({ min: 3 })
    .withMessage('يجب أن يحتوي الاسم على 3 أحرف على الأقل'),
  // .withMessage("Name must contain atleast 3 chars"),

  check('contactPhone')
    .notEmpty()
    .withMessage('رقم الهاتف مطلوب')
    // .withMessage("Phone number is required")
    .isNumeric()
    .withMessage('رقم الهاتف يجب أن يكون رقمياً')
    // .withMessage("Phone number must be numeric")
    .isLength({ min: 5 })
    .withMessage('رقم الهاتف يجب أن يكون الحد الأدنى 5 أرقام'),
  // .withMessage("Phone number must be minimum 5 digit"),

  check('contactEmail')
    .notEmpty()
    .withMessage('البريد الالكتروني مطلوب')
    // .withMessage("Email is required")
    .isEmail()
    .withMessage('الرجاء إدخال بريد إلكتروني صحيح')
    // .withMessage("Please enter valid email")
    .normalizeEmail(),

  check('destination')
    .isMongoId()
    .withMessage('معرف الوجهة غير صالح')
    // .withMessage("Invalid destination id")
    .notEmpty()
    .withMessage('الوجهة حقل مطلوب'),
  // .withMessage("Destination is required field"),

  check('document')
    .isMongoId()
    .withMessage('معرف المستند غير صالح')
    // .withMessage("Invalid document id")
    .notEmpty()
    .withMessage('الوثيقة حقل مطلوب'),
  // .withMessage("Document is required field"),

  check('termAndConditions')
    .notEmpty()
    .withMessage('يرجى ملء حقل الشروط والأحكام')
    // .withMessage('Please fill the Term and Conditions field')

    .isString()
    .withMessage('يجب أن يكون المصطلح والشرط من نوع السلسلة'),
  // .withMessage("Term and Condition must be of string type"),
]

export const validateUpdateTrip = [
  check('country')
    .optional()
    .notEmpty()
    .withMessage('الدولة مطلوبة')
    // .withMessage("Country is required")
    .isString()
    .withMessage('يجب أن تكون الدولة من نوع السلسلة')
    // .withMessage("Country must be of string type")
    .isLength({ min: 3 })
    .withMessage('يجب أن يحتوي البلد على 3 أحرف على الأقل'),
  // .withMessage("Country must contain atleast 3 chars"),

  check('tripDate')
    .optional()
    .notEmpty()
    .withMessage('تاريخ الرحلة مطلوب')
    .withMessage('Trip date is required')
    .custom(value => {
      const dob = new Date(value)
      const currentDate = new Date()

      if (dob <= currentDate) {
        throw new Error('يجب أن يكون تاريخ الرحلة في المستقبل')
        // throw new Error("Trip date must be in the future");
      }

      return true
    }),

  check('tripDuration')
    .optional()
    .notEmpty()
    .withMessage('مدة الرحلة حقل مطلوب')
    .isNumeric()
    .withMessage('يجب أن تكون مدة الرحلة من نوع الرقم'),
  // .isIn(["One week", "Two weeks", "Month", "More than a month"])
  // .withMessage('قيمة مدة الرحلة غير صالحة'),
  // .withMessage('Invalid trip duration value'),

  check('tripIncludes')
    .optional()
    .notEmpty()
    .withMessage('تتضمن الرحلة حقل مطلوب')
    // .withMessage("Trip Includes is required field")
    .isString()
    .withMessage('يجب أن تكون الرحلة من نوع السلسلة'),
  // .withMessage("Trip includes must be of string type"),

  // check("mainTripImage")
  // .custom((value, { req }) => {
  //   if (!req.file) {
  //     throw new Error("Please choose Trip Image");
  //   }

  //   return true;
  // }),

  check('tripPrice')
    .optional()
    .notEmpty()
    .withMessage('يجب ألا يكون السعر فارغًا')
    // .withMessage("Price must not be empty")
    .isString()
    .withMessage('يجب أن يكون السعر رقميًا'),
  // .withMessage("Price must be numeric"),

  check('groupType')
    .optional()
    .isIn(['Male', 'Female', 'Families', 'Men', 'Women', 'Students'])
    .withMessage('قيمة نوع المجموعة غير صالحة'),
  // .withMessage('Invalid group type value'),

  check('tripType')
    .optional()
    .notEmpty()
    .withMessage('نوع الرحلة حقل مطلوب')
    // .withMessage("Trip Type is required field")
    .isIn([
      'Adventure',
      'Hunt',
      'Historical',
      'Nature',
      'Tourism',
      'Hunting',
      'Therapeutic',
      'Training',
      'Educational',
    ])
    .withMessage('قيمة نوع الرحلة غير صالحة'),
  // .withMessage('Invalid trip type value'),

  check('tripName')
    .optional()
    .notEmpty()
    .withMessage('اسم الرحلة حقل مطلوب')
    // .withMessage("Trip Name is required field")
    .isString()
    .withMessage('يجب أن يكون اسم الرحلة من نوع السلسلة'),
  // .withMessage("Trip Name must be of string type"),

  check('contactName')
    .optional()
    .notEmpty()
    .withMessage('مطلوب اسم')
    // .withMessage("Name is required")
    .isString()
    .withMessage('يجب أن يكون الاسم من نوع السلسلة')
    // .withMessage("Name must be of string type")
    .isLength({ min: 3 })
    .withMessage('يجب أن يحتوي الاسم على 3 أحرف على الأقل'),
  // .withMessage("Name must contain atleast 3 chars"),

  check('contactPhone')
    .optional()
    .notEmpty()
    .withMessage('رقم الهاتف مطلوب')
    // .withMessage("Phone number is required")
    .isNumeric()
    .withMessage('رقم الهاتف يجب أن يكون رقمياً')
    // .withMessage("Phone number must be numeric")
    .isLength({ min: 5 })
    .withMessage('رقم الهاتف يجب أن يكون الحد الأدنى 5 أرقام'),
  // .withMessage("Phone number must be 10 digit"),

  check('contactEmail')
    .optional()
    .notEmpty()
    .withMessage('البريد الالكتروني مطلوب')
    // .withMessage("Email is required")
    .isEmail()
    .withMessage('الرجاء إدخال بريد إلكتروني صحيح')
    // .withMessage("Please enter valid email")
    .normalizeEmail(),

  check('destination')
    .optional()
    .isMongoId()
    .withMessage('معرف الوجهة غير صالح')
    // .withMessage("Invalid destination id")
    .notEmpty()
    .withMessage('الوجهة حقل مطلوب'),
  // .withMessage("Destination is required field"),

  check('document')
    .optional()
    .isMongoId()
    .withMessage('معرف المستند غير صالح')
    // .withMessage("Invalid document id")
    .notEmpty()
    .withMessage('الوثيقة حقل مطلوب'),
  // .withMessage("Document is required field"),
]

export const validateDocument = [
  body('firstName').optional().isBoolean().withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value'),

  body('lastName').optional().isBoolean().withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value'),

  body('passport').optional().isBoolean().withMessage('قيمة منطقية غير صالحة'),

  // .withMessage('Invalid boolean value'),

  body('age').optional().isBoolean().withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value'),

  body('gender').optional().isBoolean().withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value'),

  body('birthDate').optional().isBoolean().withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value'),

  body('id').optional().isBoolean().withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value'),

  body('healthIssues')
    .optional()
    .isBoolean()
    .withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value')
]

export const validateUpdateDocument = [
  body('firstName').optional().isBoolean().withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value'),

  body('lastName').optional().isBoolean().withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value'),

  body('passport').optional().isBoolean().withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value'),

  body('age').optional().isBoolean().withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value'),

  body('gender').optional().isBoolean().withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value'),

  body('birthDate').optional().isBoolean().withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value'),

  body('id').optional().isBoolean().withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value'),

  body('healthIssues')
    .optional()
    .isBoolean()
    .withMessage('قيمة منطقية غير صالحة'),
  // .withMessage('Invalid boolean value')
]

export const validateForgotPassword = [
  body('email')
    .notEmpty()
    .withMessage('يجب ألا يكون البريد الإلكتروني فارغًا')
    // .withMessage('email must not be empty')

    .isEmail()
    .withMessage('الرجاء إدخال بريد إلكتروني صحيح'),
  // .withMessage('Please enter valid email')
]

export const validateResetPassword = [
  body('email')
    .isEmail()
    .withMessage('يرجى تقديم بريد إلكتروني صالح')
    // .withMessage('Please provide valid email')
    .notEmpty()
    .withMessage('يجب ألا يكون البريد الإلكتروني فارغًا'),
  // .withMessage('email must not be empty'),

  body('otp')
    .notEmpty()
    .withMessage('يجب ألا يكون otp فارغًا')
    // .withMessage('otp must not be empty')
    .isLength({ min: 6, max: 6 })
    .withMessage('يجب أن يحتوي OTP على 6 أحرف'),
  // .withMessage('otp must contain 6 characters'),

  body('password')
    .notEmpty()
    .withMessage('يجب ألا تكون كلمة المرور فارغة')
    // .withMessage('password must not be empty')
    .isLength({ min: 6, max: 20 })
    .withMessage('يجب أن يتراوح طول كلمة المرور بين 6 و20'),
  // .withMessage('password must be of length between 6 and 20')
]

export const validateAdminSetting = [
  check('heading')
    .optional()
    .notEmpty()
    .withMessage('العنوان ليس فارغا')
    .isString()
    .withMessage('يجب أن يكون حقل العنوان من نوع السلسلة'),

  check('mainContent')
    .optional()
    .notEmpty()
    .withMessage('المحتوى الرئيسي ليس فارغا')
    .isString()
    .withMessage('يجب أن يكون حقل المحتوى الرئيسي من نوع السلسلة'),

  check('headerColor')
    .optional()
    .notEmpty()
    .withMessage('لون الرأس ليس فارغًا')
    .isString(),

  check('email')
    .optional()
    .notEmpty()
    .withMessage('Email is a required field')
    .isEmail()
    .withMessage('Please enter valid email'),

  check('city')
    .optional()
    // .notEmpty()
    // .withMessage('City is required field')
    .isString()
    .withMessage('City must be of string type'),

  check('state')
    .optional()
    // .notEmpty()
    // .withMessage('State is required field')
    .isString()
    .withMessage('State must be of string type'),

  check('zipCode')
    .optional()
    // .notEmpty()
    // .withMessage('Zip Code is required field')
    .isNumeric()
    .withMessage('Zip Code must be of number type'),

  check('address')
    .optional()
    .notEmpty()
    .withMessage('Address is required field')
    .isString()
    .withMessage('Address must be a string type'),

  check('linkedInUrl')
    .optional()
    // .notEmpty()
    // .withMessage("LinkedIn Url is required field")
    .isString()
    .withMessage('LinkedIn Url must be a string type'),

  check('twitterUrl')
    .optional()
    // .notEmpty()
    // .withMessage("Twitter Url is required field")
    .isString()
    .withMessage('Twitter Url must be a string type'),

  check('instagramUrl')
    .optional()
    // .notEmpty()
    // .withMessage("Instagram Url is required field")
    .isString()
    .withMessage('Instagram Url must be a string type'),

  check('FacebookUrl')
    .optional()
    // .notEmpty()
    // .withMessage("Facebook Url is required field")
    .isString()
    .withMessage('Facebook Url must be a string type'),

    check('aboutUs')
    .optional()
    .isString()
    .withMessage('AboutUs must be string value'),

    check('vision')
    .optional()
    .isString()
    .withMessage('vision must be string value')
]

export const validateAddTestimonial = [
  check('name')
    .notEmpty()
    .withMessage('name must not be empty')
    .isString()
    .withMessage('name must be string value')
    .isLength({ min: 3, max: 32 })
    .withMessage('Name must contain atleast 3 and maximum 32 characters'),
  check('designation')
    .notEmpty()
    .withMessage('designation must not be empty')
    .isString()
    .withMessage('designation must be string value')
    .isLength({ min: 3, max: 32 })
    .withMessage(
      'designation must contain atleast 3 and maximum 32 characters'
    ),
  check('description')
    .notEmpty()
    .withMessage('description must not be empty')
    .isString()
    .withMessage('description must be string value')
    .isLength({ min: 8, max: 300 })
    .withMessage(
      'description must contain atleast 8 and maximum 300 characters'
    ),
]

export const validateEditTestimonial = [
  param('testimonialId')
    .isMongoId()
    .withMessage('testimonialId must be valid mongodb ObjectId'),
  check('name')
    .optional()
    .notEmpty()
    .withMessage('name must not be empty')
    .isString()
    .withMessage('name must be string value')
    .isLength({ min: 3, max: 32 })
    .withMessage('Name must contain atleast 3 and maximum 32 characters'),
  check('designation')
    .optional()
    .notEmpty()
    .withMessage('designation must not be empty')
    .isString()
    .withMessage('designation must be string value')
    .isLength({ min: 3, max: 32 })
    .withMessage(
      'designation must contain atleast 3 and maximum 32 characters'
    ),
  check('description')
    .optional()
    .notEmpty()
    .withMessage('description must not be empty')
    .isString()
    .withMessage('description must be string value')
    .isLength({ min: 8, max: 300 })
    .withMessage(
      'description must contain atleast 8 and maximum 300 characters'
    ),
]
