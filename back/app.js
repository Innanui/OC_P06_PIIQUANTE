const express = require("express")
const mongoose = require("mongoose")
const rateLimit = require("express-rate-limit")
const userRoutes = require("./routes/user")
const sauceRoutes = require("./routes/sauce")
const path = require("path")

const app = express()

//connexion to MongoDB database
mongoose
  .connect(
    "mongodb+srv://delphwolff:glWPTUvuI0Saowui@cluster0.nafd7.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"))

//Headers set up
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  )
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  )
  next()
})

app.use(express.json())

//limits number of API requests per IP adress per period of time
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to API calls only
app.use("/api", apiLimiter)
app.use("/images", express.static(path.join(__dirname, "images")))
app.use("/api/auth", userRoutes)
app.use("/api/sauces", sauceRoutes)

module.exports = app
