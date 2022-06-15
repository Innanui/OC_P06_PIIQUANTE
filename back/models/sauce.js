const mongoose = require("mongoose")
//const uniqueValidator = require("mongoose-unique-validator")

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  heat: { type: Number, required: true },
  imageUrl: { type: String },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: Array },
  usersDisliked: { type: Array },
})

//sauceSchema.plugin(uniqueValidator)

module.exports = mongoose.model("Sauce", sauceSchema)