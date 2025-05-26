const { Router } = require("express");
const router = Router();
const emojiController = require("../controllers/emojiController");
const multer = require("multer");

const upload = multer({ dest: "./uploads/emojis/" });

router.get("/emojis", emojiController.search);
router.get("/emoji/:id", emojiController.getEmojiById);
router.get("/emoji/:id/image", emojiController.getEmojiImage);
router.get("/emoji/:id/audio", emojiController.getAudioEmoji);
router.post("/emojis", upload.fields([
    { name: "sprite_emoji", maxCount: 1 },
    { name: "audio_emoji", maxCount: 1 },
  ]), emojiController.create);
router.put("/emoji/:id", upload.fields([
    { name: "sprite_emoji", maxCount: 1 },
    { name: "audio_emoji", maxCount: 1 },
  ]), emojiController.update);
router.delete("/emoji/:id", emojiController.delete);

module.exports = router;
