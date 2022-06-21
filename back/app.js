const express = require("express")
const mongoose = require("mongoose")
const rateLimit = require("express-rate-limit")
const userRoutes = require("./routes/user")
const sauceRoutes = require("./routes/sauce")
const path = require("path")

const app = express()

mongoose
  .connect(
    "mongodb+srv://delphwolff:Tehau2020!!@cluster0.nafd7.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"))

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

// app.use(
//   rateLimit({
//     windowMs: 12 * 60 * 60 * 1000, // 12 hour duration in milliseconds
//     max: 5,
//     message: "You exceeded 100 requests in 12 hour limit!",
//     headers: true,
//   })
// )

app.use("/images", express.static(path.join(__dirname, "images")))
app.use("/api/auth", userRoutes)
app.use("/api/sauces", sauceRoutes)

module.exports = app
