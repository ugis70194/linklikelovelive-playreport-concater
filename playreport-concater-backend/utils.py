import numpy as np
import cv2
from io import BytesIO
from flask import Response, make_response

def readFileFromStream(stream: BytesIO) -> np.ndarray:
  return cv2.imdecode(np.asarray(bytearray(stream.read()), dtype=np.uint8), 1)

def _imgToBytes(img: np.ndarray) -> bytes:
  height, width, depth = np.shape(img)
  new_height = 1024
  new_width = int((new_height / height) * width)
  resized = cv2.resize(img, (new_width, new_height))
  _, buffer = cv2.imencode(".png", resized, [int(cv2.IMWRITE_PNG_COMPRESSION), 80])
  return buffer.tobytes()

def makePngResponse(img: np.ndarray) -> Response:
  bytedata = _imgToBytes(img)
  res = make_response(bytedata)
  res.headers["Content-Type"] = "image/png"
  res.headers["Content-Disposition"] = "attachment; filename=playreport"
  return res
