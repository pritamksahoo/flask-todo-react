from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from utils import *
from db_sql_ops import *
import time

app = Flask(__name__)
CORS(app)

account = {
	'pks': {
		'password': 'pks',
		'is_active': False
		}
}

boards = {
	'pks': {
		'mapper': {
			'todo': {
				'django': {
					'desc': 'python3 django==2.2.1',
					'last_modified': 1588556528.45781,
					'is_completed': False
				},
				'flask': {
					'desc': 'python3 flask backend',
					'last_modified': 1588556579.2773438,
					'is_completed': True
				}
			},
			'created_at': 1588556421.1552515
		},
		'jarviss': {
			'todo': {
				'onboarding': {
					'desc': 'cloud gcp',
					'last_modified': 1588556549.8420935,
					'is_completed': True
				},
				'policy': {
					'desc': 'cloud gcp ingress egress',
					'last_modified': 1588556590.911627,
					'is_completed': False
				}
			},
			'created_at': 1588556466.8548198
		}
	}
}

@app.route("/", methods=["GET"])
def root():
	return "Hello, world"

@app.route("/check/", methods=["GET"])
def check():
	return jsonify('backend working')

@app.route("/signup/", methods=["POST"])
def signup():
	global account
	global boards
	data = request.get_json()
	
	username = data.get('username')
	password = data.get('password')

	is_user = does_user_exists(username)

	if is_user is None:
		return jsonify('Server Error! Try Again', 404)

	elif not does_user_exists(username):
		res = create_new_user(username, password)

		if res:
			return jsonify('Account created succesfully', 200)

		else:
			return jsonify('Server Error! Try Again', 404)

	else:
		return jsonify('Account creation failed! Username already exists', 400)


@app.route("/login/", methods=["POST"])
def login():
	global account
	data = request.get_json()
	# print(account)
	
	username = data.get('username')
	password = data.get('password')

	res = user_validation(username, password)

	if res == True:
		flag = activate_user(username)
		return jsonify('Successfull login', 200)

	elif res is None:
		return jsonify('Server Error! Try Again', 404)

	else:
		return jsonify('Login failed! Wrong Credentials', 400)


@app.route("/logout/", methods=["POST"])
def logout():
	global account
	data = request.get_json()
	
	username = data.get('username')

	res = deactivate_user(username)

	if res == True:
		return jsonify('Successfull logout', 200)

	else:
		return jsonify('Server Error! Try Again', 404)


@app.route("/get_all_boards/", methods=["POST"])
def get_all_boards():
	global account
	global boards

	data = request.get_json()
	username = data.get('username')
	# print(account[username])

	if user_validation(username) == True:
		res = fetch_all_boards(username)

		if res is not None:
			return jsonify(res, 200)

		else:
			return jsonify('Boards Retreival Failed! Server Error!', 400)

	else:
		return jsonify('Boards Retreival Failed!', 404)


@app.route("/get_all_todos/", methods=["POST"])
def get_all_todos():
	global account
	global boards

	data = request.get_json()
	username = data.get('username')
	board = data.get('board')
	# print(account[username])

	if user_validation(username) == True:
		res = find_existing_board(username, board, 0, 0, 1)

		if res is None:
			return jsonify('Todos Retreival Failed! No such board exists. Create One', 404)

		else:
			return jsonify(fetch_all_todos(res["boards"][board]), 200)

	else:
		return jsonify('Todos Retreival Failed!', 400)


@app.route("/create_new_board/", methods=["POST"])
def create_new_board():
	global account
	global boards

	data = request.get_json()
	username = data.get('username')
	board = data.get('board')

	if user_validation(username) == True:
		if find_existing_board(username, board) is None:
			res = create_new_empty_board(username, board, time.time())
			
			if res:
				return jsonify(fetch_all_boards(username), 200)

			else:
				return jsonify('Board creation failed! Server Error', 404)

		else:
			return jsonify('Board creation failed! Board already exists', 404)

	else:
		return jsonify('Board creation failed!', 400)


@app.route("/delete_board/", methods=["POST"])
def delete_board():
	global account
	global boards

	data = request.get_json()
	username = data.get('username')
	board = data.get('board')

	if user_validation(username) == True:
		if find_existing_board(username, board) is not None:
			
			res = delete_existing_board(username, board)

			if res:
				return jsonify("Board successfully deleted", 200)

			else:
				return jsonify('Board deletion failed! Server Error!', 400)

		else:
			return jsonify('Board deletion failed! No such board exists', 404)

	else:
		return jsonify('Board deletion failed!', 400)


@app.route("/create_new_todo/", methods=["POST"])
def create_new_todo():
	global account
	global boards

	data = request.get_json()
	username = data.get('username')
	board = data.get('board')
	todo = data.get('todo')
	description = data.get('description')

	if user_validation(username) == True:
		res = find_existing_board(username, board, 0, 0, 1)

		if res is not None:
			todos = res["boards"][board]
			boards = res["boards"]
			# print(todos)
			if todos.get(todo, None) is None:
				todos[todo] = {
					"desc": description,
					"last_modified": time.time(),
					"is_completed": False
				}

				boards[board] = todos

				res_todo = create_delete_update_todo(username, boards)

				if res_todo:
					return jsonify(fetch_all_todos(todos), 200)

				else:
					return jsonify('Task creation failed! Server Error!', 400)

			else:
				# print("jj")
				return jsonify('Task creation failed! It already exists', 400)

		else:
			return jsonify('Task creation failed! Board does not exist', 404)

	else:
		return jsonify('Task creation failed!', 400)


@app.route("/delete_todo/", methods=["POST"])
def delete_todo():
	global account
	global boards

	data = request.get_json()
	username = data.get('username')
	board = data.get('board')
	todo = data.get('todo')

	if user_validation(username) == True:
		res = find_existing_board(username, board, 0, 0, 1)

		if res is not None:
			boards = res["boards"]
			todos = boards[board]

			if todos.get(todo, None) is not None:
				todos.pop(todo)
				boards[board] = todos

				res_todo = create_delete_update_todo(username, boards)

				if res_todo:
					return jsonify(fetch_all_todos(todos), 200)

				else:
					return jsonify('Task deletion failed! Server Error!', 400)

			else:
				return jsonify('Task deletion failed! It does not exist!', 404)

		else:
			return jsonify('Task deletion failed! Invalid board!', 404)

	else:
		return jsonify('Task deletion failed!', 400)


@app.route("/complete_task/", methods=["POST"])
def complete_task():
	global account
	global boards

	data = request.get_json()
	username = data.get('username')
	board = data.get('board')
	todo = data.get('task')

	if user_validation(username) == True:
		res = find_existing_board(username, board, 0, 0, 1)

		if res is not None:
			todos = res["boards"][board]
			boards = res["boards"]
			# print(todos)
			if todos.get(todo, None) is not None:
				todos[todo]["is_completed"] = True

				boards[board] = todos

				res_todo = create_delete_update_todo(username, boards)

				if res_todo:
					return jsonify(fetch_all_todos(todos), 200)

				else:
					return jsonify('Task completion failed! Server Error!', 400)

			else:
				# print("jj")
				return jsonify('Task completion failed! It does not exists', 400)

		else:
			return jsonify('Task completion failed! Board does not exist', 404)

	else:
		return jsonify('Task completion failed!', 400)

@app.route("/incomplete_task/", methods=["POST"])
def incomplete_task():
	global account
	global boards

	data = request.get_json()
	username = data.get('username')
	board = data.get('board')
	todo = data.get('task')

	if user_validation(username) == True:
		res = find_existing_board(username, board, 0, 0, 1)

		if res is not None:
			todos = res["boards"][board]
			boards = res["boards"]
			# print(todos)
			if todos.get(todo, None) is not None:
				todos[todo]["is_completed"] = False

				boards[board] = todos

				res_todo = create_delete_update_todo(username, boards)

				if res_todo:
					return jsonify(fetch_all_todos(todos), 200)

				else:
					return jsonify('Operation failed! Server Error!', 400)

			else:
				# print("jj")
				return jsonify('Operation failed! It does not exists', 400)

		else:
			return jsonify('Operation failed! Board does not exist', 404)

	else:
		return jsonify('Operation failed!', 400)


if __name__ == '__main__':
	# app.run(host='0.0.0.0', port=8000, debug=True)
	app.run(debug=False)
