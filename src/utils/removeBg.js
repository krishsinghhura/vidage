import axios from "axios";
import imageFile from "../utils/imageFile";
export async function removeBg(imageFile) {
  const apiKey = "YOURjiy7Cnznqu685S4eq5fLXxwx";
  const formData = new FormData();
  formData.append("image_file", imageFile);
  formData.append("size", "auto");

  try {
    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data_url; // Returns the URL of the processed image
  } catch (error) {
    console.error("Error removing background:", error);
    return null;
  }
}
