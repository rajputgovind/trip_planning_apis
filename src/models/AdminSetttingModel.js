import mongoose from 'mongoose'

const adminSettingSchema = new mongoose.Schema(
  {
    mainLogo: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    mainContent: {
      type: String,
      required: true,
    },
    headerColor: {
      type: String,
      required: true,
    },
    homePageBannerImage: {
      type: String,
      required: true,
    },
    searchPageBannerImage: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipCode: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    linkedInUrl: {
      type: String,
      required: true,
    },
    twitterUrl: {
      type: String,
      required: true,
    },
    instagramUrl: {
      type: String,
      required: true,
    },
    facebookUrl: {
      type: String,
      required: true,
    },
    termsAndConditions: {
      type: String,
    },
    privacyPolicy: {
      type: String,
    },
    aboutUs: {
      type: String
    },
    vision: {
      type: String
    }
  },
  {
    timestamps: true,
  }
)

const AdminSetting = new mongoose.model('AdminSetting', adminSettingSchema)

export default AdminSetting
