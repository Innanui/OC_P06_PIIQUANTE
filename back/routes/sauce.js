const express = require("express")
const router = express.Router()
const sauceCtrl = require("../controllers/sauce")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

router.get("/", auth, sauceCtrl.getAllSauces) //User Id checked in middleware auth
router.get("/:id", auth, sauceCtrl.getOneSauce) //User Id checked in middleware auth
router.post("/", auth, multer, sauceCtrl.createSauce) // identification checked in controller
router.put("/:id", auth, multer, sauceCtrl.updateSauce) // identification checked in auth if no file is added and in controller otherwise
router.delete("/:id", auth, sauceCtrl.deleteSauce) // User Id checked in sauce controller
router.post("/:id/like", auth, sauceCtrl.likeSauce) //User Id checked in middleware auth

module.exports = router
