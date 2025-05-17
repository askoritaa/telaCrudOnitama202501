const {Router} = require("express");
const router = Router();
const backgroundController = require("../controllers/backgroundController");
const multer = require("multer");

const upload = multer({ dest: "./uploads/backgrounds/" });

router.get("/backgrounds", backgroundController.search);
router.get("/background/:id", backgroundController.getBackgroundById);
router.get("/background/:id/bg", backgroundController.getBgImage);
router.post("/backgrounds", upload.fields([
    { name: "sprite_bg", maxCount: 1 },
  ]), backgroundController.create);
router.put("/background/:id", upload.fields([
    { name: "sprite_bg", maxCount: 1 },
  ]), backgroundController.update);
router.delete("/background/:id", backgroundController.delete);

module.exports = router;