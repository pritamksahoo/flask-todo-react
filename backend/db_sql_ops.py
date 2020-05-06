import pymysql
import pymysql.cursors
from db_connect import *
from db_mongo_ops import *

def does_user_exists(username):
	try:
		connection = sql_connect()

		if connection[2] == 200:
			cursor = connection[1]

			query = "SELECT * from user_account where username='%s'" %(username)
			cursor.execute(query)

			result = cursor.fetchall()

			sql_close()

			if len(result) == 0:
				return False

			else:
				return True
		else:
			sql_close()
			return None

	except Exception as e:
		print(e)
		sql_close()
		return None

def create_new_user(username, password):
	try:
		connection = sql_connect()

		if connection[2] == 200:
			cursor = connection[1]
			db = connection[0]

			if create_new_space(username) == True:
				query = "INSERT INTO user_account (username, password, is_active) VALUES ('%s', '%s', '%d')" % (username, password, 0)
				cursor.execute(query)
				db.commit()

				sql_close()
				return True

			else:
				return False

		else:
			sql_close()
			return False

	except Exception as e:
		print(e)
		sql_close()
		return False


def user_validation(username, password=None):
	try:
		connection = sql_connect()

		if connection[2] == 200:
			cursor = connection[1]
			db = connection[0]

			query = "SELECT * from user_account where username='%s' AND password='%s'" % (username, password)

			if password is None:
				query = "SELECT * from user_account where username='%s'" % (username)

			cursor.execute(query)

			result = cursor.fetchall()
			sql_close()

			if len(result) == 1:
				return True

			else:
				return False

		else:
			sql_close()
			return None

	except Exception as e:
		print(e)
		sql_close()
		return None


def activate_user(username):
	try:
		connection = sql_connect()

		if connection[2] == 200:
			cursor = connection[1]
			db = connection[0]

			query = "UPDATE user_account SET is_active = True where username='%s'" % (username)
			cursor.execute(query)
			sql_close()

			return True

		else:
			sql_close()
			return False

	except Exception as e:
		print(e)
		sql_close()
		return False


def deactivate_user(username):
	try:
		connection = sql_connect()

		if connection[2] == 200:
			cursor = connection[1]
			db = connection[0]

			query = "UPDATE user_account SET is_active = False where username='%s'" % (username)
			cursor.execute(query)
			sql_close()

			return True

		else:
			sql_close()
			return False

	except Exception as e:
		print(e)
		sql_close()
		return False


if __name__ == '__main__':
	create_new_user("amrik", "amrik")