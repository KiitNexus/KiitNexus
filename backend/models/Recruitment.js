const mongoose = require('mongoose')

const recruitmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true, // enforce "one application per email" atomically at the DB level
    match: [
      /^[a-zA-Z0-9._%+-]+@kiit\.ac\.in$/,
      'Please fill a valid KIIT email address (@kiit.ac.in)',
    ],
  },
  whatsapp: {
    type: String,
    required: true,
    trim: true,
  },
  semester: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
    enum: [
      'Web Dev',
      'App Dev',
      'Machine Learning',
      'Operations',
      'Marketing',
      'Graphic Design',
      'Video Editing',
      'Content Writing',
    ],
  },
  resume: {
    type: String,
    trim: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
    index: true, // speeds up the .sort({ appliedAt: -1 }) on the admin GET
  },
})

module.exports = mongoose.model(
  'Recruitment',
  recruitmentSchema,
  'RECRUITMENT PHASE 1',
)
