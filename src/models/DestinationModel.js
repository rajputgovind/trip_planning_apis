import mongoose from 'mongoose'

const destinationSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    destinationDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    agenda: {
      type: String,
      required: true,
    },
    hotelName: {
      type: String,
      required: true,
    },
    destinationImage: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Destination = new mongoose.model('Destination', destinationSchema)

export default Destination
