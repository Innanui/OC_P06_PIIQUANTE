const dotenv = require("dotenv")
dotenv.config()
module.exports = {
  masterKey: process.env.BCRYPT_KEY,
  port: process.env.PORT,
}
