// Cloudinary Configuration
const CLOUD_NAME = "dycbotqpw";
const UPLOAD_PRESET = "mati_unsigned";

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  // Optimization: Auto format and quality
  formData.append("f_auto", "true");
  formData.append("q_auto", "true");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Image upload failed");
  }

  return response.json();
};