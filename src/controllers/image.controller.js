const {uploadToCloudinary, cloudinary} = require("../utils/cloudinary");
const Images = require("../models/Images");

exports.uploadImageasync = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Title and images are required." });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);
      uploadedImages.push({ url: result.url, public_id: result.public_id, });
    }

    const newImages = new Images({
      title,
      images: uploadedImages,
    });

    const savedImages = await newImages.save();
    res.status(201).json(savedImages);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Server error uploading images." });
  }
};

exports.getImages = async (req, res) => {
  try {
    const images = await Images.find();
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { galleryId, public_id } = req.body;

    console.log("Gallery id --> ", galleryId);
    

    if (!galleryId || !public_id) {
      return res
        .status(400)
        .json({ error: "galleryId and public_id are required." });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== "ok" && result.result !== "not found") {
      return res
        .status(500)
        .json({ error: "Failed to delete image from Cloudinary." });
    }

    // Remove image from DB
    const updatedGallery = await Images.findByIdAndUpdate(
      galleryId,
      { $pull: { images: { public_id } } },
      { new: true }
    );

    if (!updatedGallery) {
      return res.status(404).json({ error: "Gallery not found." });
    }

    res.status(200).json({
      message: "Image deleted successfully.",
      updatedGallery,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server error while deleting image." });
  }
};