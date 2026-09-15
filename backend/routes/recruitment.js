const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Recruitment = require('../models/Recruitment')
const { sendRecruitmentConfirmation } = require('../services/email')

// Fail fast instead of letting a query hang until the function times out.
router.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res
      .status(503)
      .json({ error: 'Server is starting up, please try again in a moment.' })
  }
  next()
})

// Apply for recruitment
router.post('/apply', async (req, res) => {
  try {
    let { name, email, whatsapp, semester, year, branch, domain, resume } =
      req.body

    if (email) {
      email = email.toLowerCase().trim()
    }

    if (!email || !email.endsWith('@kiit.ac.in')) {
      return res
        .status(400)
        .json({ error: 'Only @kiit.ac.in email is allowed.' })
    }

    const application = new Recruitment({
      name,
      email,
      whatsapp,
      semester,
      year,
      branch,
      domain,
      resume,
    })

    try {
      await application.save()
    } catch (saveErr) {
      // Unique index on email (see models/Recruitment.js) is now the single
      // source of truth for "already applied" — this replaces the old
      // findOne-then-save pattern, which raced under concurrent requests
      // and could let duplicates through.
      if (saveErr.code === 11000) {
        return res.status(400).json({ error: 'You have already applied.' })
      }
      throw saveErr
    }

    // Fire-and-forget: don't make the API response wait on SMTP latency.
    sendRecruitmentConfirmation({
      name,
      email,
      whatsapp,
      semester,
      year,
      branch,
      domain,
      resume,
    }).catch((emailErr) =>
      console.error('Error sending recruitment email:', emailErr),
    )

    res.status(201).json({ message: 'Application submitted successfully.' })
  } catch (error) {
    console.error('Recruitment Apply Error:', error)
    res
      .status(500)
      .json({ error: 'Failed to submit application. Please try again.' })
  }
})

// Admin: Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await Recruitment.find().sort({ appliedAt: -1 }).lean()
    res.status(200).json(applications)
  } catch (error) {
    console.error('Recruitment Fetch Error:', error)
    res.status(500).json({ error: 'Failed to fetch applications.' })
  }
})

module.exports = router
