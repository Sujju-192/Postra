import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return false;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  return true;
}

export async function uploadImageBufferToCloudinary({
  buffer,
  folder = "postra/posts",
  publicId,
}) {
  const isConfigured = configureCloudinary();
  if (!isConfigured) {
    const err = new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in backend/.env",
    );
    err.statusCode = 500;
    throw err;
  }

  if (!buffer?.length) {
    const err = new Error("No image data to upload");
    err.statusCode = 400;
    throw err;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          const hint =
            error.http_code === 401 || /cloud_name/i.test(error.message || "")
              ? " Check CLOUDINARY_CLOUD_NAME in backend/.env (Dashboard → Settings)."
              : "";
          const err = new Error(
            (error.message || "Cloudinary upload failed") + hint,
          );
          err.statusCode = 500;
          return reject(err);
        }
        resolve(result?.secure_url || result?.url);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}
