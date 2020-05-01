from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/check/", methods=["GET"])
def check():
	return jsonify('backend working')


if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000, debug=True)