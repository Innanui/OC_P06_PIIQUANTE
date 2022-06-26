const Sauce = require("../models/sauce")
const fs = require("fs")
const validator = require("validator")

/**
 * Checks and updates tables according likeCode received and returns object containing new tables and numbers to increment to likes and dislikes
 * @param {number} likeCode
 * @param {string} userId
 * @param {array} usersLiked
 * @param {array} usersDisliked
 * @returns {array, array, number, number}
 */
const manageLikes = (likeCode, userId, usersLiked, usersDisliked) => {
  let likesObject = {
    usersLiked: usersLiked,
    usersDisliked: usersDisliked,
    doLike: 0,
    doDislike: 0,
  }
  if (likeCode == 1) {
    if (usersLiked.includes(userId)) {
      return likesObject
    } else {
      if (usersDisliked.includes(userId)) {
        likesObject.usersLiked.push(userId)
        likesObject.usersDisliked = usersDisliked.filter((e) => e != userId)
        likesObject.doLike = 1
        likesObject.doDislike = -1
        return likesObject
      } else {
        //normal case (user in no table)
        likesObject.usersLiked.push(userId)
        likesObject.doLike = 1
        return likesObject
      }
    }
  } else if (likeCode == 0) {
    if (usersLiked.includes(userId)) {
      if (usersDisliked.includes(userId)) {
        likesObject.usersLiked = usersLiked.filter((e) => e != userId)
        likesObject.usersDisliked = usersDisliked.filter((e) => e != userId)
        likesObject.doLike = -1
        likesObject.doDislike = -1
        return likesObject
      } else {
        //normal case
        likesObject.usersLiked = usersLiked.filter((el) => el != userId) //c'est la que ca bug...
        likesObject.doLike = -1
        return likesObject
      }
    } else {
      //normal case
      if (usersDisliked.includes(userId)) {
        likesObject.usersDisliked = usersDisliked.filter((e) => e != userId)
        likesObject.doDislike = -1
        return likesObject
      } else {
        return likesObject
      }
    }
  } else if (likeCode == -1) {
    if (usersDisliked.includes(userId)) {
      return likesObject
    } else {
      if (usersLiked.includes(userId)) {
        likesObject.usersLiked = usersLiked.filter((e) => e != userId)
        likesObject.usersDisliked.push(userId)
        likesObject.doLike = -1
        likesObject.doDislike = 1
        return likesObject
      } else {
        //normal case
        likesObject.usersDisliked.push(userId)
        likesObject.doDislike = 1
        return likesObject
      }
    }
  }
}

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id
  if (sauceObject.userId != req.auth.userId) {
    res.status(401).json({
      error: new Error("Invalid request!"),
    })
  }
  if (
    // validates presence and length of sauce elements
    !(
      validator.isLength(sauceObject.name, { min: 1, max: 20 }) &&
      validator.isLength(sauceObject.manufacturer, { min: 1, max: 20 }) &&
      validator.isLength(sauceObject.description, { min: 1, max: 50 }) &&
      validator.isLength(sauceObject.mainPepper, { min: 1, max: 20 }) &&
      validator.isInt(sauceObject.heat.toString(), { min: 1, max: 10 })
    )
  ) {
    res.status(401).json({ message: "Invalid request!" })
  }

  if (req.file) {
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    })
    sauce
      .save()
      .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
      .catch((error) => res.status(400).json({ error }))
  } else {
    const sauce = new Sauce({
      ...sauceObject,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    })
    sauce
      .save()
      .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
      .catch((error) => res.status(400).json({ error }))
  }
}

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce)
    })
    .catch((error) => res.status(404).json({ error }))
}

exports.updateSauce = (req, res, next) => {
  if (req.file) {
    if (JSON.parse(req.body.sauce).userId != req.auth.userId) {
      res.status(401).json({
        error: new Error("Invalid request!"),
      })
    }
  }
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }

  if (
    // validates presence and length of sauce elements
    !(
      validator.isLength(sauceObject.name, { min: 1, max: 20 }) &&
      validator.isLength(sauceObject.manufacturer, { min: 1, max: 20 }) &&
      validator.isLength(sauceObject.description, { min: 1, max: 50 }) &&
      validator.isLength(sauceObject.mainPepper, { min: 1, max: 20 }) &&
      validator.isInt(sauceObject.heat.toString(), { min: 1, max: 10 })
    )
  ) {
    res.status(401).json({
      error: new Error("Invalid request!"),
    })
  }

  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id, userId: req.auth.userId })

    .then((sauce) => {
      if (!sauce) {
        res.status(404).json({
          error: new Error("No such Sauce!"),
        })
      }
      const filename = sauce.imageUrl.split("/images/")[1]
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }))
      })
    })
    .catch((error) => res.status(500).json({ error }))
}

exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId
  const like = req.body.like
  if (
    // validates that like is 1, 0 or -1
    !validator.isInt(like.toString(), { min: -1, max: 1 })
  ) {
    res.status(401).json({
      error: new Error("Invalid request!"),
    })
  }

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      let likesObject = manageLikes(
        like,
        userId,
        sauce.usersLiked,
        sauce.usersDisliked
      )
      console.log(likesObject)

      sauce.likes += likesObject.doLike
      sauce.dislikes += likesObject.doDislike
      sauce.usersLiked = likesObject.usersLiked
      sauce.usersDisliked = likesObject.usersDisliked

      Sauce.updateOne(
        { _id: req.params.id },
        {
          likes: sauce.likes,
          dislikes: sauce.dislikes,
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
        }
      )
        .then(() => res.status(200).json({ message: "like enregistré !" }))
        .catch((error) => res.status(400).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}
