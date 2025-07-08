const upload = require("../utils/multer");
const express = require("express");
const router = express.Router();
const {
    uploadImageasync,
    getImages
} = require("../controllers/image.controller")

router.post("/gallery", upload.array("images"), uploadImageasync);
router.get("/get-images", getImages);

module.exports = router;