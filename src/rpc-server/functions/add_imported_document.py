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

def add_imported_document(file_name):
    try:
        # Assume que os documentos XML estão na pasta /data/
        xml_file_path = f"/data/{file_name}"
        with open(xml_file_path, 'r') as xml_file:
            xml_content = xml_file.read()

        query = "INSERT INTO imported_documents (file_name, xml, created_on, updated_on) VALUES (%s, %s, NOW(), NOW())"
        parameters = (file_name, xml_content)

        execute_query(query, parameters)
        return "Document imported successfully."

    except FileNotFoundError:
        return f"Error: File '{file_name}' not found."
    except Exception as e:
        return f"Error importing document: {e}"
