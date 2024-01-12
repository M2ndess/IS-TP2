import sys
import time
import requests
import xml.etree.ElementTree as ET
import pika

POLLING_FREQ = int(sys.argv[1]) if len(sys.argv) >= 2 else 60

API_BASE_URL = "http://api-entities-base-url"


def print_psycopg2_exception(ex):
    err_type, err_obj, traceback = sys.exc_info()
    line_num = traceback.tb_lineno
    print("\npsycopg2 ERROR:", ex, "on line number:", line_num)
    print("psycopg2 traceback:", traceback, "-- type:", err_type)
    print("\nextensions.Diagnostics:", ex.diag)
    print("pgerror:", ex.pgerror)
    print("pgcode:", ex.pgcode, "\n")


def get_task_from_broker():
    try:
        rabbitmq_params = pika.ConnectionParameters(
            host='rabbitmq',
            port=5672,
            virtual_host='is',
            credentials=pika.PlainCredentials(username='is', password='is')
        )

        connection = pika.BlockingConnection(rabbitmq_params)
        channel = connection.channel()
        method_frame, header_frame, body = channel.basic_get(queue='xmlFiles')

        if method_frame:
            channel.basic_ack(method_frame.delivery_tag)
            connection.close()
            return body.decode('utf-8')
        else:
            connection.close()
            return None
    except pika.exceptions.AMQPError as amqp_error:
        print(f"AMQPError: {amqp_error}")
        return None
    except Exception as e:
        print(f"Error getting task from broker: {e}")
        return None

def consume_messages():
    while True:
        task = get_task_from_broker()

        if task:
            processed_data = process_xml_data(task)
            send_data_to_api(processed_data)

        time.sleep(POLLING_FREQ)


def process_xml_data(xml_data):
    root = ET.fromstring(xml_data)

    teams = []
    for team_element in root.findall('.//Team'):
        team_id = team_element.get('id')
        team_name = team_element.get('name')

        players = []
        for player_element in team_element.findall('.//Player'):
            player_data = {attr: player_element.get(attr) for attr in player_element.attrib}
            players.append(player_data)

        teams.append({
            "team_id": team_id,
            "team_name": team_name,
            "players": players
        })

    players = []
    for player_element in root.findall('.//Players/Player'):
        player_data = {attr: player_element.get(attr) for attr in player_element.attrib}
        players.append(player_data)

    countries = []
    for country_element in root.findall('.//Countries/Country'):
        country_data = {attr: country_element.get(attr) for attr in country_element.attrib}
        countries.append(country_data)

    competitions = []
    for competition_element in root.findall('.//Competitions/Competition'):
        competition_id = competition_element.get('id')
        competition_year = competition_element.get('year')
        competition_name = competition_element.get('competition_name')

        competition_players = []
        for competition_player_element in competition_element.findall('.//CompetitionPlayers/CompetitionPlayer'):
            competition_player_data = {attr: competition_player_element.get(attr) for attr in
                                       competition_player_element.attrib}
            competition_players.append(competition_player_data)

        competitions.append({
            "competition_id": competition_id,
            "year": competition_year,
            "competition_name": competition_name,
            "competition_players": competition_players
        })

    return {
        "teams": teams,
        "players": players,
        "countries": countries,
        "competitions": competitions
    }


def send_data_to_api(data):
    try:
        response = requests.post(f"{API_BASE_URL}/migration_endpoint", json=data)
        response.raise_for_status()
        print("Data sent successfully to API.")
    except requests.exceptions.RequestException as e:
        print(f"Error sending data to API: {e}")


if __name__ == "__main__":
    consume_messages()
