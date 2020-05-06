import pymongo
from db_connect import *
import time

db = None
connection = None

def create_new_space(username):
	global db
	global connection

	try:
		if not db:
			connection = mongo_connect()

		if connection[1] == 200:
			db = connection[0]

			db["user_todo"].insert_one({
				"username": username,
				"boardnames": {

				},
				"boards": {

				}	
			})

			return True
		else:
			return False

	except Exception as e:
		print(e)
		return False


def create_new_empty_board(username, boardname, time_now):
	global db
	global connection

	try:
		if not db:
			connection = mongo_connect()

		if connection[1] == 200:
			db = connection[0]

			db["user_todo"].update_one(
				{
					"username": username
				},
				{
					"$set": {
						"boardnames.%s"%(boardname): time_now,
						"boards.%s"%(boardname): {}
					}
				}
			)

			return True
		else:
			return False

	except Exception as e:
		print(e)
		return False


def create_delete_update_todo(username, boards):
	global db
	global connection

	try:
		if not db:
			connection = mongo_connect()

		if connection[1] == 200:
			db = connection[0]

			db["user_todo"].update_one(
				{
					"username": username
				},
				{
					"$set": {
						"boards": boards
					}
				}
			)

			return True
		else:
			return False

	except Exception as e:
		print(e)
		return False


def delete_existing_board(username, boardname):
	global db
	global connection

	try:
		if not db:
			connection = mongo_connect()

		if connection[1] == 200:
			db = connection[0]

			res = find_existing_board(username, boardname, f_user=0, f_boardnames=1, f_boards=1)

			if res:
				boardnames = res["boardnames"]
				boards = res["boards"]

				boardnames.pop(boardname)
				boards.pop(boardname)

				db["user_todo"].update_one(
					{
						"username": username
					},
					{
						"$set": {
							"boardnames": boardnames,
							"boards": boards
						}
					}
				)

				return True

			else:
				return False

		else:
			return False

	except Exception as e:
		print(e)
		return False


def find_all_board(username):
	global db
	global connection

	try:
		if not db:
			connection = mongo_connect()

		if connection[1] == 200:
			db = connection[0]

			res = db["user_todo"].find_one(
				{
					"username": username
				},
				{
					"boardnames": 1
				}
			)

			return res

		else:
			return None
			pass

	except Exception as e:
		print(e)
		return None


def find_existing_board(username, boardname, f_user=1, f_boardnames=0, f_boards=0):
	global db
	global connection

	try:
		if not db:
			connection = mongo_connect()

		if connection[1] == 200:
			db = connection[0]

			retrieve_fields = {}

			if f_user:
				retrieve_fields["username"] = 1
			if f_boardnames:
				retrieve_fields["boardnames"] = 1
			if f_boards:
				retrieve_fields["boards"] = 1

			# print(retrieve_fields)

			res = db["user_todo"].find_one(
				{
					"username": username,
					"boardnames.%s"%(boardname): {"$exists": True}
				},
				retrieve_fields
			)

			# print(res)

			return res

		else:
			return None

	except Exception as e:
		print("Finding existing board : ", e)
		return None


if __name__ == '__main__':
	# create_new_space("test")
	# create_new_board("test", "test_board_2", time.time())
	# find_existing_board("test", "test_board_2")
	print(find_existing_board("pks", "jarviss", 1, 1, 1))
	pass