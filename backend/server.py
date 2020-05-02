from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

account = {
	'pks': {
		'password': 'pks',
		'is_active': True
		},
}

boards = {
	'pks': {
		'mapper': {
			'todo': {
				'django': {
					'desc': 'python3 django==2.2.1',
					'is_completed': False
				},
				'flask': {
					'desc': 'python3 flask backend',
					'is_completed': True
				}
			}
		},
		'jarviss': {
			'todo': {
				'onboarding': {
					'desc': 'cloud gcp',
					'is_completed': True
				},
				'policy': {
					'desc': 'cloud gcp ingress egress',
					'is_completed': False
				}
			}
		}
	}
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
		account[username] = {'password': password, 'is_active': False}
		return jsonify('Account created succesfully', 200)

	else:
		return jsonify('Account creation failed! Username already exists', 400)

@app.route("/login/", methods=["POST"])
def login():
	global account
	data = request.get_json()
	print(account)
	
	username = data.get('username')
	password = data.get('password')

	if account.get(username, None) is not None and password == account[username]['password']:
		account[username]['is_active'] = True
		return jsonify('Successfull login', 200)

	else:
		return jsonify('Login failed! Wrong Credentials', 400)

@app.route("/logout/", methods=["POST"])
def logout():
	global account
	data = request.get_json()
	
	username = data.get('username')
	print("Log Out :-", username)

	if account.get(username, None) is not None:
		account[username]['is_active'] = False
		return jsonify('Successfull logout', 200)

	else:
		return jsonify('Logout Failed!', 400)

@app.route("/get_all_boards/", methods=["POST"])
def get_all_boards():
	global account
	global boards

	data = request.get_json()
	username = data.get('username')
	# print(account[username])

	if account.get(username, None) is not None and account[username]['is_active']:
		all_boards = list(boards[username].keys())
		return jsonify(all_boards, 200)

	else:
		return jsonify('Boards Retreival Failed!', 400)

@app.route("/get_all_todos/", methods=["POST"])
def get_all_todos():
	global account
	global boards

	data = request.get_json()
	username = data.get('username')
	board = data.get('board')
	# print(account[username])

	if account.get(username, None) is not None and account[username]['is_active'] and boards[username].get(board, None) is not None:
		all_todos = boards[username][board]["todo"]
		todos = [ {'name': k, 'desc': all_todos[k]['desc'], 'is_completed': all_todos[k]['is_completed']} for k in all_todos ]
		return jsonify(todos, 200)

	else:
		return jsonify('Todos Retreival Failed!', 400)


if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000, debug=True)