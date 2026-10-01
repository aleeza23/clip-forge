import "server-only";

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a video buffer or stream to Cloudinary inside the specified folder (default: 'videos')
 */
export async function uploadVideoToCloudinary(
  fileBuffer: Buffer,
  fileName: string,
  folder = "videos"
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder,
        public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_")}`,
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed with empty response"));
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Generates an optimized 9:16 vertical clip URL with optional burned-in captions using Cloudinary's dynamic video transformation engine.
 */
export function generateCloudinaryClipUrl(
  publicId: string,
  options: {
    startOffset: number;
    endOffset: number;
    aspectRatio?: "9:16" | "1:1" | "16:9";
    captionText?: string;
  }
): string {
  const { startOffset, endOffset, aspectRatio = "9:16", captionText } = options;

  // Cloudinary URL transformation array
  const transformation: any[] = [
    // Trim video to start and end offset
    {
      start_offset: startOffset,
      end_offset: endOffset,
    },
    // Auto-reframe and crop to target aspect ratio (9:16 vertical shorts by default)
    {
      aspect_ratio: aspectRatio,
      crop: "fill",
      gravity: "auto",
    },
  ];

  // If captionText is provided, burn in animated/stylish caption using Cloudinary text overlay
  if (captionText) {
    const cleanText = captionText.replace(/[,/]/g, " ").trim();
    transformation.push({
      overlay: {
        font_family: "Arial",
        font_size: 38,
        font_weight: "black",
        text: cleanText,
      },
      color: "#ffffff",
      background: "rgb:000000_80",
      gravity: "south",
      y: 120,
    });
  }

  return cloudinary.url(publicId, {
    resource_type: "video",
    transformation,
    format: "mp4",
  });
}
export async function uploadSrtToCloudinary(
  srtContent: string,
  publicId: string
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: publicId,
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(
            error || new Error("SRT upload failed with empty response")
          );
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(Buffer.from(srtContent, "utf-8"));
  });
}

export { cloudinary };
export default cloudinary;
