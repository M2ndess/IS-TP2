import sys
import time

from pip._vendor import requests

POLLING_FREQ = int(sys.argv[1]) if len(sys.argv) >= 2 else 60
ENTITIES_PER_ITERATION = int(sys.argv[2]) if len(sys.argv) >= 3 else 10
URL_API_ENTITIES = 'http://api-entities:8080'

def generate_coords(region: str):
    url = "https://nominatim.openstreetmap.org/"

    params = {
        'q': region,
        'limit': '1',
        'format': 'json'
    }

    r = requests.get(url=url, params=params)

    data = r.json()

    return [
        data[0]["lat"],
        data[0]["lon"]
    ]

def getCoordsWithoutUpdate():
    url = f"{URL_API_ENTITIES}/api/countries/to_update/{ENTITIES_PER_ITERATION}"

    r = requests.get(url=url)

    data = r.json()

    return data
#test
if __name__ == "__main__":
    while True:
        print(f"Getting up to {ENTITIES_PER_ITERATION} entities without coordinates...")
        # !TODO: 1- Use api-entities to retrieve a fixed amount of entities without coordinates (e.g. 100 entities per iteration, use ENTITIES_PER_ITERATION)
        # !TODO: 2- Use the entity information to retrieve coordinates from an external API
        # !TODO: 3- Submit the changes

        for data in getCoordsWithoutUpdate():
            #Because Sometimes the api of nominatim crashes. When their api crashes, we can retry the request
            while True:
                found = False
                try:
                    coords = generate_coords(data['name'])
                    found = True
                except requests.exceptions.ConnectionError:
                    found = False
                if found:
                    break
                else:
                    time.sleep(POLLING_FREQ)
                    continue

            url = f"{URL_API_ENTITIES}/api/countries/update"
            myobj = {
                'id': data['id'][0],
                'name':data['name'],
                'lat' : coords[0],
                'lon' : coords[1]
            }

            x = requests.post(url, json=myobj)


        time.sleep(POLLING_FREQ)