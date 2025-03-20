import axios from "axios";

export async function removeBg(image: File): Promise<string | null> {
  const apiKey = "jiy7Cnznqu685S4eq5fLXxwx";

  const formData = new FormData();
  formData.append("image_file", image);
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
        responseType: "arraybuffer", // Important to handle binary data properly
      }
    );

    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error("Error removing background:", error);
    return null;
  }
}
