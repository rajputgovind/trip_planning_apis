import mongoose from 'mongoose'
// import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
})

// testimonialSchema.plugin(aggregatePaginate)

const Testimonial = mongoose.model('Testimonial', testimonialSchema)
export default Testimonial
