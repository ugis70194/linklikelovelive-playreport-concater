from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from utils import *
from concater import Concater
import os

app = initialize_app(name="playreport concat server")
concater = Concater()

@https_fn.on_request(
  region='asia-northeast2',
  cors=options.CorsOptions(
    cors_origins=[
      "https://school-idol-stage-supporter.web.app", 
      "https://school-idol-stage-supporter.firebaseapp.com"
    ],
    cors_methods=["post"]
  )
)
def concat(request: https_fn.Request) -> https_fn.Response:
  if request.method != "POST":
    return Response("accept method is POST only", 400)
  playreports: list[np.ndarray] = []
  if "playreport_0" in request.files:
    playreport_0 = request.files["playreport_0"].stream
    playreports.append(readFileFromStream(playreport_0))
  if "playreport_1" in request.files:
    playreport_1 = request.files["playreport_1"].stream
    playreports.append(readFileFromStream(playreport_1))
  if "playreport_2" in request.files:
    playreport_2 = request.files["playreport_2"].stream
    playreports.append(readFileFromStream(playreport_2))
  try:
    concated = concater.concatPlayReport(playreports)
    res = makePngResponse(concated)
    return res
  except:
    return "Error", 500
  
if __name__ == '__main__':
  app.run(port="5000")