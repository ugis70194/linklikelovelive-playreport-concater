from flask import Flask, Response, request
from flask_cors import cross_origin
from utils import *
from concater import Concater

app = Flask("playreport concat server")
concater = Concater()

@app.route('/concat', methods=["POST"])
@cross_origin(origins=["http://localhost:5173"], methods=["POST"])
def concat() -> Response:
  if request.method != "POST":
    return Response("accept method is POST only", 400)
  print(request.files)
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