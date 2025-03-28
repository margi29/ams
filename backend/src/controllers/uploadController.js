const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Uploading image to Cloudinary...");

    // Convert buffer to stream and upload
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          { folder: "asset_images" },
          (error, uploadedImage) => {
            if (error) {
              console.error(" Cloudinary Upload Error:", error);
              reject(error);
            } else {
              console.log(" Image uploaded:", uploadedImage.secure_url);
              resolve(uploadedImage.secure_url);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const image = await streamUpload(req.file.buffer);
    return res.status(200).json({ image: image });
  } catch (error) {
    console.error(" Error uploading image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { uploadImage };