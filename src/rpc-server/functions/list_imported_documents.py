import psycopg2

def get_database_connection():
    try:
        connection = psycopg2.connect(
            user="is",
            password="is",
            host="is-db",
            port="5432",
            database="is"
        )
        connection.autocommit = True
        return connection
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        raise

def close_database_connection(connection):
    if connection:
        connection.close()

def execute_query(query, parameters=None):
    connection = get_database_connection()
    cursor = connection.cursor()

    try:
        if parameters:
            cursor.execute(query, parameters)
        else:
            cursor.execute(query)

        result = cursor.fetchall()
        return result

    except Exception as e:
        print(f"Error executing query: {e}")
        raise

    finally:
        cursor.close()
        close_database_connection(connection)

def list_imported_documents():
    query = "SELECT id, file_name, created_on, updated_on, deleted FROM imported_documents"
    documents = execute_query(query)
    return documents
