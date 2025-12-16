// Cloudinary Configuration
const CLOUD_NAME = "dycbotqpw";
const UPLOAD_PRESET = "mati_unsigned";

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  resource_type: string;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  // Determine resource type based on file MIME type
  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
  
  // Optimization: Auto format and quality for images
  if (resourceType === 'image') {
    formData.append("f_auto", "true");
    formData.append("q_auto", "true");
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `${resourceType} upload failed`);
  }

  return response.json();
};