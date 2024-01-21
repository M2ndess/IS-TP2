import sys
import time
import pika
import json
import urllib.parse
import urllib.request
import psycopg2

POLLING_FREQ = int(sys.argv[1]) if len(sys.argv) >= 2 else 60
ENTITIES_PER_ITERATION = int(sys.argv[2]) if len(sys.argv) >= 3 else 10

RabbitMQURL = "amqp://is:is@rabbitMQ:5672/is"
CoordsQueue = "coords_queue"
DB_URL = "postgresql://is:is@db-rel:543/is"


def callback(ch, method, properties, body):
    try:
        message_str = body.decode()

        if "Get coordinates for Country:" in message_str:
            country_name = message_str.split("Get coordinates for Country:")[1].strip()

            latitude, longitude = fetch_coordinates(country_name)
            print(f"Received message for country: {country_name}, Coordinates: {latitude}, {longitude}")

            store_coordinates(country_name, latitude, longitude)

        else:
            country_name = "Unknown Country"

        print(f"Received message for country: {country_name}")

    except Exception as e:
        print(f"Error processing message: {e}")


def fetch_coordinates(country_name):
    endpoint = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": country_name,
        "format": "json",
        "limit": 1,
    }
    url = f"{endpoint}?{urllib.parse.urlencode(params)}"

    with urllib.request.urlopen(url) as response:
        data = json.load(response)
        if data:
            location = data[0]
            latitude = float(location.get("lat"))
            longitude = float(location.get("lon"))
            return latitude, longitude
    return None


def store_coordinates(country_name, latitude, longitude):
    try:
        api_gis_url = 'http://api-gis:8080/update_country_coords'

        data = {
            'country_name': country_name,
            'latitude': longitude,
            'longitude': latitude,
        }

        response = requests.patch(api_gis_url, json=data)

        if response.status_code == 200:
            print(f"Coordenadas atualizadas com sucesso para o país: {country_name}")
        else:
            print(
                f"Falha ao atualizar coordenadas para o país: {country_name}. Resposta da API GIS: {response.text}")

    except requests.RequestException as e:
        print(f"Erro ao enviar dados para a API GIS: {e}")

finally:
    cursor.close()
    connection.close()


if __name__ == "__main__":

    # Establish a connection to RabbitMQ
    connection = pika.BlockingConnection(pika.URLParameters(RabbitMQURL))
    channel = connection.channel()

    # Declare the queue
    channel.queue_declare(queue=CoordsQueue)
    channel.basic_consume(queue=CoordsQueue, on_message_callback=callback, auto_ack=True)

    print(f"Waiting for messages from {CoordsQueue}...")

    while True:
        channel.start_consuming()

        time.sleep(POLLING_FREQ)