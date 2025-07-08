const uploadToCloudinary = require("../utils/cloudinary");
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
      uploadedImages.push({ url: result.url });
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
