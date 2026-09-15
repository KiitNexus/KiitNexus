require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')
const contactRoutes = require('./routes/contact')
const recruitmentRoutes = require('./routes/recruitment')

const app = express()

// Vercel sits in front of this app as a proxy — without this,
// express-rate-limit throws on the X-Forwarded-For header under load.
app.set('trust proxy', 1)

mongoose.set('bufferCommands', false)

let connecting = null
function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve()
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is missing.')
    return Promise.resolve()
  }
  if (!connecting) {
    connecting = mongoose
      .connect(process.env.MONGODB_URI, {
        maxPoolSize: 20,
        minPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 20000,
      })
      .then(() => console.log('Connected to MongoDB'))
      .catch((err) => {
        console.error('MongoDB connection error:', err)
        connecting = null // allow retry on next request
      })
  }
  return connecting
}
connectDB()

app.use(helmet())
app.use(express.json())

const allowedOrigins = [
  'http://localhost:3000',
  'https://kiitnexus.in',
  'https://www.kiitnexus.in',
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)

      const isAllowed =
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        /\.vercel\.app$/.test(origin) ||
        origin.endsWith('kiitnexus.in')

      if (isAllowed) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  }),
)

// Rate limiting — safe now that trust proxy is set. Bumped headroom
// slightly since this fires per-IP across many students at once.
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

app.use(limiter)

// Attempt reconnect on the way in, per-request, cheaply (no-op once connected).
app.use((req, res, next) => {
  connectDB()
  next()
})

app.use('/api', contactRoutes)
app.use('/api/recruitments', recruitmentRoutes)

const PORT = process.env.PORT || 4000

module.exports = app

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}
