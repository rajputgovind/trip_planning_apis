import mongoose, { mongo } from 'mongoose'

const tripFilterSchema = new mongoose.Schema(
  {
    price: {
      type: Boolean,
      // default: false,
    },

    duration: {
      type: Boolean,
      // default: false,
    },

    groupType: {
      type: Boolean,
      // default: false,
    },

    tripType: {
      type: Boolean,
      // default: false,
    },
    country: {
      type: Boolean,
    },
    aboutUs: {
      type: Boolean,
    },
    vision: {
      type: Boolean
    }
  },
  {
    timestamps: true,
  }
)

const TripFilter = new mongoose.model('TripFilter', tripFilterSchema)

export default TripFilter
