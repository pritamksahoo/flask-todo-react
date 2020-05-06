import time
from db_sql_ops import *
from db_mongo_ops import *

def fetch_all_boards(username):
	res = find_all_board(username)

	if res is not None:
		temp_boards = res["boardnames"]

		all_boards = [ [k, temp_boards[k]] for k in temp_boards ]
		all_boards = sorted(all_boards, key = lambda x: x[1], reverse=True)

		all_boards = list(map(lambda item: [item[0], time.ctime(item[1])], all_boards))

		return all_boards

	else:
		return res

def fetch_all_todos(todos):
	temp_todos = todos

	all_todos = [ [k, temp_todos[k]['desc'], temp_todos[k]['last_modified'], temp_todos[k]['is_completed']] for k in temp_todos ]
	all_todos = sorted(all_todos, key = lambda x: x[2], reverse=True)

	all_todos = list(map(lambda item: [item[0], item[1], time.ctime(item[2]), item[3]], all_todos))

	return all_todos