import mongoose from 'mongoose'

const filterSchema = new mongoose.Schema(
  {
    fieldName: {
      type: String,
      required: true,
      set: value =>
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    },
    status: {
      type: Boolean,
      default: true,
    },
    value: [
      {
        type: String,
        required: true,
        set: value =>
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Filter = new mongoose.model('Filter', filterSchema)

export default Filter
