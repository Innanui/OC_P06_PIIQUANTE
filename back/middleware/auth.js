const jwt = require("jsonwebtoken")
const { masterKey } = require("../config.js")

//gives access to req.auth : decoded userId from req headers to be used in controllers to check user good authentification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, masterKey)
    const userId = decodedToken.userId
    req.auth = { userId }
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID" // blocks requests having a userId in body and not corresponding to header authorization token
    } else {
      next()
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    })
  }
}
