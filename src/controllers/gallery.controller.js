const { cloudinary } = require("../utils/cloudinary");
const Images = require("../models/Images");

exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Gallery ID is required" });
    }

    // Find the gallery to get all images
    const gallery = await Images.findById(id);
    
    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    // Delete all images from Cloudinary
    const deletePromises = gallery.images.map(image => 
      cloudinary.uploader.destroy(image.public_id, { resource_type: "image" })
    );

    await Promise.all(deletePromises);

    // Delete the gallery document from MongoDB
    await Images.findByIdAndDelete(id);

    res.status(200).json({
      message: "Gallery and all its images deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    res.status(500).json({ error: "Server error while deleting gallery" });
  }
};
