from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

account = {
	'pks': 'pks',
}

@app.route("/check/", methods=["GET"])
def check():
	return jsonify('backend working')

@app.route("/signup/", methods=["POST"])
def signup():
	global account
	data = request.get_json()
	
	username = data.get('username')
	password = data.get('password')

	if account.get(username, None) is None:
		account[username] = password
		return jsonify('Account created succesfully', 200)

	else:
		return jsonify('Account creation failed! Username already exists', 400)

@app.route("/login/", methods=["POST"])
def login():
	global account
	data = request.get_json()
	
	username = data.get('username')
	password = data.get('password')

	if account.get(username, None) is not None and password == account[username]:
		return jsonify('Successfull login', 200)

	else:
		return jsonify('Login failed! Wrong Credentials', 400)


if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000, debug=True)