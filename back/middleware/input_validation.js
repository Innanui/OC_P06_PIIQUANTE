const validator = require("validator")

// validates presence and length of sauce elements - used at sauce creation and modification
exports.main = (req, res, next) => {
  console.log(req.body)
  const sauceObject = JSON.parse(req.body.sauce)
  try {
    //const sauceObject = JSON.parse(req.body.sauce)
    if (
      !(
        validator.isLength(sauceObject.name, { min: 1, max: 20 }) &&
        validator.isLength(sauceObject.manufacturer, { min: 1, max: 20 }) &&
        validator.isLength(sauceObject.description, { min: 1, max: 50 }) &&
        validator.isLength(sauceObject.mainPepper, { min: 1, max: 20 }) &&
        validator.isInt(sauceObject.heat.toString(), { min: 1, max: 10 })
      )
    ) {
      res.status(401).json({ message: "Invalid request! no1" })
    } else {
      next()
    }
  } catch {
    console.log("on est la")
    res.status(401).json({
      error: new Error("Invalid request! no2 "),
    })
  }
}
