import time

def fetch_all_boards(boards, username):
	temp_boards = boards[username]

	all_boards = [ [k, temp_boards[k]['created_at']] for k in temp_boards ]
	all_boards = sorted(all_boards, key = lambda x: x[1], reverse=True)

	all_boards = list(map(lambda item: [item[0], time.ctime(item[1])], all_boards))

	return all_boards

def fetch_all_todos(boards, username, board_name):
	temp_todos = boards[username][board_name]["todo"]

	all_todos = [ [k, temp_todos[k]['desc'], temp_todos[k]['last_modified'], temp_todos[k]['is_completed']] for k in temp_todos ]
	all_todos = sorted(all_todos, key = lambda x: x[2], reverse=True)

	all_todos = list(map(lambda item: [item[0], item[1], time.ctime(item[2]), item[3]], all_todos))

	return all_todos