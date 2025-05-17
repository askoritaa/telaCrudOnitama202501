const { Router } = require("express");
const router = Router();
const skinController = require("../controllers/skinController");
const multer = require("multer");

const upload = multer({ dest: "./uploads/skins/" });

router.get("/skins", skinController.search);
router.get("/skin/:id", skinController.getSkinById);
router.get("/skin/:id/pawn", skinController.getPawnImage);
router.get("/skin/:id/king", skinController.getKingImage);
router.post("/skins", upload.fields([
    { name: "sprite_pawn", maxCount: 1 },
    { name: "sprite_king", maxCount: 1 },
  ]), skinController.create);
router.put("/skin/:id", upload.fields([
    { name: "sprite_pawn", maxCount: 1 },
    { name: "sprite_king", maxCount: 1 },
  ]), skinController.update);
router.delete("/skin/:id", skinController.delete);

module.exports = router;
