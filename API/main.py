import cv2
import io
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse
from PIL import Image
from ultralytics import YOLO

app = FastAPI()
model = YOLO("yolov8n.pt")  # Load YOLO model


@app.post("/detect-objects")
async def detect_objects(file: UploadFile = File(...)):
    """ Detects objects and returns a list of detected objects """
    image_bytes = await file.read()
    image = np.array(Image.open(io.BytesIO(image_bytes)))
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    results = model(image)
    detections = results[0].boxes.data.tolist()

    objects_detected = []
    for idx, box in enumerate(detections):
        x1, y1, x2, y2, confidence, class_id = map(int, box)
        objects_detected.append({
            "id": idx,  # Unique ID for selection
            "class_id": class_id,
            "bounding_box": [x1, y1, x2, y2],
            "confidence": float(confidence)
        })

    return JSONResponse(content={"objects": objects_detected})


@app.post("/remove-objects")
async def remove_objects(
    file: UploadFile = File(...),
    remove_ids: str = Form(...)
):
    """ Removes only selected objects based on IDs """
    image_bytes = await file.read()
    image = np.array(Image.open(io.BytesIO(image_bytes)))
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    results = model(image)
    detections = results[0].boxes.data.tolist()

    remove_ids = set(map(int, remove_ids.split(",")))  # Convert input to set

    for idx, box in enumerate(detections):
        if idx in remove_ids:
            x1, y1, x2, y2, confidence, class_id = map(int, box)

            # Create a mask for the detected object
            mask = np.zeros(image.shape[:2], dtype=np.uint8)
            cv2.rectangle(mask, (x1, y1), (x2, y2), (255), thickness=-1)

            # Inpaint (remove object)
            image = cv2.inpaint(image, mask, inpaintRadius=5, flags=cv2.INPAINT_TELEA)

    output_path = "output.jpg"
    cv2.imwrite(output_path, image)

    return FileResponse(output_path, media_type="image/jpeg")
