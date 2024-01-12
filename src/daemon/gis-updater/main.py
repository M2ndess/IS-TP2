import sys
import time
import requests

POLLING_FREQ = int(sys.argv[1]) if len(sys.argv) >= 2 else 60
ENTITIES_PER_ITERATION = int(sys.argv[2]) if len(sys.argv) >= 3 else 10

GIS_API_BASE_URL = "http://your-gis-api-base-url"
EXTERNAL_COORDINATES_API = "http://external-coordinates-api"


def get_entities_without_coordinates():
    # TODO: Implement logic to fetch entities without coordinates using api-gis
    # For example: Make a request to your GIS API to get entities without coordinates
    entities_without_coordinates = requests.get(f"{GIS_API_BASE_URL}/entities/without-coordinates").json()
    return entities_without_coordinates


def get_coordinates_from_external_api(entity_info):
    # TODO: Implement logic to get coordinates from an external API using entity information
    # For example: Make a request to an external API with the entity information
    coordinates = requests.get(f"{EXTERNAL_COORDINATES_API}/get-coordinates", params=entity_info).json()
    return coordinates


def submit_changes(entity_id, new_coordinates):
    # TODO: Implement logic to submit changes (e.g., update coordinates) to api-gis
    # For example: Make a PUT request to your GIS API to update the entity with new coordinates
    payload = {"coordinates": new_coordinates}
    response = requests.put(f"{GIS_API_BASE_URL}/entities/{entity_id}", json=payload)
    return response.status_code == 200  # Assuming a successful response has HTTP status code 200


if __name__ == "__main__":
    while True:
        print(f"Getting up to {ENTITIES_PER_ITERATION} entities without coordinates...")

        entities_without_coordinates = get_entities_without_coordinates()

        for entity in entities_without_coordinates[:ENTITIES_PER_ITERATION]:
            entity_id = entity["id"]
            entity_info = {"entity_id": entity_id}

            # Get coordinates from external API
            new_coordinates = get_coordinates_from_external_api(entity_info)

            # Submit changes to GIS API
            success = submit_changes(entity_id, new_coordinates)

            if success:
                print(f"Updated coordinates for entity {entity_id}")

        time.sleep(POLLING_FREQ)
