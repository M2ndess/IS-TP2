import psycopg2
import json
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
import xml.dom.minidom as md

class Country:

    def __init__(self, name):
        Country.counter += 1
        self._id = Country.counter
        self._name = name
        self._latitude = None
        self._longitude = None
        self.fetch_coordinates()

    def fetch_coordinates(self):
        endpoint = "https://nominatim.openstreetmap.org/search"
        params = {
            "q": self._name,
            "format": "json",
            "limit": 1,
        }
        url = f"{endpoint}?{urllib.parse.urlencode(params)}"
        
        with urllib.request.urlopen(url) as response:
            data = json.load(response)
            if data:
                location = data[0]
                self._latitude = location.get("lat")
                self._longitude = location.get("lon")

    def to_xml(self):
        el = ET.Element("Country")
        el.set("id", str(self._id))
        el.set("name", self._name)
        el.set("latitude", str(self._latitude))
        el.set("longitude", str(self._longitude))
        return el

Country.counter = 0