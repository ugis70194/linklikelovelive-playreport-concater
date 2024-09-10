import numpy as np
import cv2
from io import BytesIO
from flask import Response, make_response

def readFileFromStream(stream: BytesIO) -> np.ndarray:
  return np.asarray(bytearray(stream.read()), dtype=np.uint8)

def imgToBytes(img: np.ndarray) -> bytes:
  _, buffer = cv2.imencode(".png", img)
  return buffer.tobytes()

def makePngResponse(img: np.ndarray) -> Response:
  bytedata = imgToBytes(img)
  res = make_response(bytedata)
  res.headers["Content-Type"] = "image/png"
  res.headers["Content-Disposition"] = "attachment; filename=playreport"
  return res
