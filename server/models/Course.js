const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title zaroori hai'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description zaroori hai']
  },
  category: {
    type: String,
    enum: ['computer', 'tailoring', 'language', 'coaching', 'skills', 'other'],
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Price zaroori hai'],
    min: 0
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: [true, 'Location zaroori hai']
  },
  schedule: {
    days: [String],
    time: String,
    duration: String
  },
  thumbnail: {
    type: String,
    default: ''
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);