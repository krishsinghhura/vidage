"use client";

import { useState } from "react";
import { removeBg } from "../../utils/removeBg";
import Image from "next/image";

export default function ImageProcessor() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [updatedImage, setUpdatedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setProcessedImage(null);
      setUpdatedImage(null);
    }
  };

  const handleRemoveBg = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const result = await removeBg(selectedImage);
    console.log(result);

    setProcessedImage(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 px-4 py-8">
      <div className="max-w-4xl w-full text-center">
        <img
          src="https://www.aiease.ai/wp-content/uploads/2024/08/before-and-after-effects-of-removing-background-in-AI-Ease-free-AI-background-remover.webp"
          alt="Background Removal"
          className="mx-auto mb-6 h-88"
        />
        <p className="text-gray-700 mb-6">
          Easily remove the background from your images and download them in PNG
          format.
        </p>
      </div>

      <div className="p-6 bg-white text-gray-900 rounded-lg w-full max-w-4xl text-center shadow-lg ">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-700 border border-green-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={handleRemoveBg}
          disabled={!selectedImage || loading}
          className="bg-green-500 px-5 py-2 rounded-lg text-white font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
        >
          {loading ? "Processing..." : "Remove Background"}
        </button>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-6">
          {originalImageUrl && (
            <div className="flex flex-col items-center">
              <p className="mb-2 text-sm font-semibold text-gray-700">
                Original Image
              </p>
              <Image
                src={originalImageUrl}
                alt="Original"
                width={250}
                height={250}
                className="border rounded-lg shadow-md"
              />
            </div>
          )}

          {processedImage && (
            <div className="flex flex-col items-center">
              <p className="mb-2 text-sm font-semibold text-gray-700">
                Processed Image
              </p>
              <Image
                src={processedImage}
                alt="Processed"
                width={250}
                height={250}
                className="border rounded-lg shadow-md bg-gray-100"
              />
              <a
                href={processedImage}
                download="background_removed.png"
                className="mt-2 bg-green-500 px-3 py-1 rounded-md text-sm text-white font-semibold hover:bg-green-600 transition duration-300"
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
