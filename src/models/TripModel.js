import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const tripSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    tripDate: {
      type: Date,
      required: true,
    },
    tripDuration: {
      type: Number,
      // enum :["One week","Two weeks","Month","More than a month"],
      required: true,
    },
    tripIncludes: {
      type: String,
      required: true,
    },
    mainTripImage: {
      type: String,
      required: true,
    },
    tripLogo: {
      type: String,
      // required:true
    },
    tripPrice: {
      type: String,
      required: true,
    },
    groupType: {
      type: String,
      enum: ['Male', 'Female', 'Families', 'Men', 'Women', 'Students'],
      required: true,
    },
    tripType: {
      type: String,
      enum: [
        'Adventure',
        'Hunt',
        'Historical',
        'Nature',
        'Tourism',
        'Hunting',
        'Therapeutic',
        'Training',
        'Educational',
      ],
      required: true,
    },
    tripName: {
      type: String,
      required: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: Number,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },

    destination: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
      },
    ],
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tripStatus: {
      type: Boolean,
      default: true,
    },
    tripVisibility: {
      type: Boolean,
      default: true,
    },
    termAndConditions: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

tripSchema.plugin(aggregatePaginate)
const Trip = new mongoose.model('Trip', tripSchema)

export default Trip
