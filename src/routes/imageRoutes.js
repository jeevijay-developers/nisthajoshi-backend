const upload = require("../utils/multer");
const express = require("express");
const router = express.Router();
const {
    uploadImageasync,
    getImages,
    deleteImage
} = require("../controllers/image.controller")

router.post("/gallery", upload.array("images"), uploadImageasync);
router.get("/get-images", getImages);
router.delete("/delete-image", deleteImage)

module.exports = router;