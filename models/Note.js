const mongoose = require('mongoose')

const geocoder = require('../utils/geocoder')

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  body: {
    type: String,
    required: [true, 'Please include a note body']
  },
  address: String,
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
}, {
  timestamps: true
})

NoteSchema.pre('save', async function(next) {
  if (this.address) {
    const loc = await geocoder.geocode(this.address)
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress
    }
  
    // Do not save address to database
    this.address = undefined
  }

  next()
})

module.exports = mongoose.model('Note', NoteSchema)