import cv2
import torch
import numpy as np
import io
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from PIL import Image
from ultralytics import YOLO

app = FastAPI()

# Load YOLO model
model = YOLO("yolov8n.pt")

@app.post("/detect-and-replace")
async def detect_and_replace(file: UploadFile = File(...)):
    # Read image
    image_bytes = await file.read()
    image = np.array(Image.open(io.BytesIO(image_bytes)))  # Convert to NumPy array
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # Convert to OpenCV format

    # Run object detection
    results = model(image)
    detections = results[0].boxes.data.tolist()

    # Process each detected object
    for box in detections:
        x1, y1, x2, y2, confidence, class_id = map(int, box)

        # Create a mask for the detected object
        mask = np.zeros(image.shape[:2], dtype=np.uint8)
        cv2.rectangle(mask, (x1, y1), (x2, y2), (255), thickness=-1)

        # Inpaint (fill the removed object area)
        image = cv2.inpaint(image, mask, inpaintRadius=5, flags=cv2.INPAINT_TELEA)

    # Save the new image
    output_path = "output.jpg"
    cv2.imwrite(output_path, image)

    # Return the modified image
    return FileResponse(output_path, media_type="image/jpeg")

