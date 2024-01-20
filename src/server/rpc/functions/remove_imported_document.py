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
        return None

    finally:
        cursor.close()
        close_database_connection(connection)


def remove_imported_document(document_id):
    query = "UPDATE imported_documents SET deleted = true, updated_on = NOW() WHERE id = %s"
    parameters = (document_id,)

    try:
        execute_query(query, parameters)
        return "Document soft-deleted successfully."

    except Exception as e:
        return f"Error soft-deleting document: {e}"
