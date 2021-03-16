const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for category']
  }
}, {
  timestamps: true,
  // Virtuals
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Reverse populate with virtuals in a field courses
CategorySchema.virtual('notes', {
  ref: 'Note',
  localField: '_id',
  foreignField: 'category', // A field in the course model that we want to partain to
  justOne: false
})

module.exports = mongoose.model('Category', CategorySchema)