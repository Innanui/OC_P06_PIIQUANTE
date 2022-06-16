const express = require("express")
const router = express.Router()
const sauceCtrl = require("../controllers/sauce")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

router.get("/", auth, sauceCtrl.getAllSauces) //identification verifiee dans auth
router.get("/:id", auth, sauceCtrl.getOneSauce) //identification verifiee dans auth
router.post("/", auth, multer, sauceCtrl.createSauce) // identification verifiee dans controller
router.put("/:id", auth, multer, sauceCtrl.updateSauce) // identification verifiee dans auth si pas de fichier ajouté et sinon verifiee dans controller
router.delete("/:id", auth, sauceCtrl.deleteSauce) // identification verifiee dans controller
router.post("/:id/like", auth, sauceCtrl.likeSauce) //identification verifiee dans auth

module.exports = router
