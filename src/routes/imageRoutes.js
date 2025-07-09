const upload = require("../utils/multer");
const express = require("express");
const router = express.Router();
const {
    uploadImageasync,
    getImages,
    deleteImage,
    deleteGallery
} = require("../controllers/image.controller");

router.post("/gallery", upload.array("images"), uploadImageasync);
router.get("/get-images", getImages);
router.delete("/delete-image", deleteImage);
router.delete("/delete-gallery/:id", deleteGallery);

module.exports = router;