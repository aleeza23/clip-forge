const BASE = "https://api.magichour.ai";

async function mh(path: string, init: RequestInit = {}) {
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.MAGIC_HOUR_API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Magic Hour error ${res.status}`);
  return data;
}

// Upload the photo to Magic Hour storage, returns a file_path
export async function uploadImage(file: File) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const { items } = await mh("/v1/files/upload-urls", {
    method: "POST",
    body: JSON.stringify({ items: [{ type: "image", extension: ext }] }),
  });
  const put = await fetch(items[0].upload_url, {
    method: "PUT",
    body: await file.arrayBuffer(),
  });
  if (!put.ok) throw new Error("Image upload failed");
  return items[0].file_path as string;
}

export function createVideo(imagePath: string, prompt: string, seconds = 5) {
  return mh("/v1/image-to-video", {
    method: "POST",
    body: JSON.stringify({
      name: "photo-to-video",
      end_seconds: seconds,
      model: process.env.MAGIC_HOUR_MODEL || "wan-2.2",
      resolution: "480p",
      style: { prompt },
      assets: { image_file_path: imagePath },
    }),
  });
}

export const getVideo = (id: string) => mh(`/v1/video-projects/${id}`);

// Keeps the person unchanged and focuses the model on simple motion
export const buildPrompt = (userPrompt: string) =>
  `The same person from the photo, keep face, hair, body and clothes exactly unchanged. ${userPrompt}. Natural smooth motion, realistic, steady camera.`;