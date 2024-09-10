from flask import Flask, Request, Response
from utils import *
from concater import Concater

app = Flask("playreport concat server")
concater = Concater()

@app.route('/concat', methods=["POST"])
def concat(request: Request) -> Response:
  if request.method != "POST":
    return Response("accept method is POST only", 400)
  
  playreports: list[np.ndarray] = []
  if "playreport_01" in request.files:
    playreport_01 = request.files["playreport_01"].stream
    playreports.append(readFileFromStream(playreport_01))
  if "playreport_02" in request.files:
    playreport_02 = request.files["playreport_02"].stream
    playreports.append(readFileFromStream(playreport_02))
  if "playreport_03" in request.files:
    playreport_03 = request.files["playreport_03"].stream
    playreports.append(readFileFromStream(playreport_03))

  try:
    concated = concater.concatPlayReport(playreports)
    res = makePngResponse(concated)
    return res
  except:
    return "Error", 500