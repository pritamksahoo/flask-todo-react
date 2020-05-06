import pymysql
import pymysql.cursors
import pymongo

SQL_DB_HOST = "todo-mysql-backend.cpky6gdazsnm.ap-south-1.rds.amazonaws.com"
SQL_DB_PORT = 3306
SQL_DB_USER = "todo_pks"
SQL_DB_PASS = "todo_amrik"
SQL_DB_NAME = "todo"

sql_db = None

def sql_connect():
	global sql_db

	try:
		sql_db = pymysql.connect(host=SQL_DB_HOST, user=SQL_DB_USER, password=SQL_DB_PASS, db=SQL_DB_NAME, cursorclass=pymysql.cursors.DictCursor)
		return (sql_db, sql_db.cursor(), 200)

	except Exception as e:
		print(e)
		sql_db = None
		return (None, None, 404)

def sql_close():
	global sql_db

	if sql_db is not None:
		sql_db.close()
		sql_db = None


def mongo_connect():
	try:
		client = pymongo.MongoClient("mongodb+srv://todo_pks:todo_amrik@todo-cluster-4uxsp.mongodb.net/test?retryWrites=true&w=majority")
		db = client["user_board"]

		return (db, 200)

	except Exception as e:
		print(e)
		return (None, 404)


if __name__ == '__main__':
	print(mongo_connect())