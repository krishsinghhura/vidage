"use client";
import { useState } from "react";

export default function ObjectDetection() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [objects, setObjects] = useState<{ id: number; class_id: number }[]>(
    []
  );
  const [selectedObjects, setSelectedObjects] = useState<number[]>([]);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const detectObjects = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch("http://127.0.0.1:8000/detect-objects", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setObjects(data.objects);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedObjects((prev) =>
      prev.includes(id) ? prev.filter((obj) => obj !== id) : [...prev, id]
    );
  };

  const removeSelectedObjects = async () => {
    if (!image || selectedObjects.length === 0) return;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("remove_ids", selectedObjects.join(","));

    const res = await fetch("http://127.0.0.1:8000/remove-objects", {
      method: "POST",
      body: formData,
    });
    const blob = await res.blob();
    setProcessedImage(URL.createObjectURL(blob));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-green-600">
        Object Detection & Removal
      </h1>
      <input type="file" onChange={handleImageUpload} className="mt-4" />
      {preview && <img src={preview} alt="Uploaded" className="mt-4 w-80" />}
      <button
        onClick={detectObjects}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Detect Objects
      </button>
      {objects.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Select Objects to Remove:</h2>
          {objects.map((obj) => (
            <label key={obj.id} className="block text-green-600">
              <input
                type="checkbox"
                value={obj.id}
                onChange={() => handleCheckboxChange(obj.id)}
                className="mr-2 text-green-600"
              />
              Object {obj.id} (Class {obj.class_id})
            </label>
          ))}
          <button
            onClick={removeSelectedObjects}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove Selected Objects
          </button>
        </div>
      )}
      {processedImage && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Processed Image:</h2>
          <img src={processedImage} alt="Processed" className="mt-2 w-80" />
          <a
            href={processedImage}
            download="processed.jpg"
            className="block mt-2 text-blue-600"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}
