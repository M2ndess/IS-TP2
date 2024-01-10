import xml.etree.ElementTree as ET

class Player:

    def __init__(self, name, last_name, gender, age, country, competitor_id, competitor_name, height, weight,  overall_rank, overall_score, year, competition, height_cm, weight_kg):
        Player.counter += 1
        self._id = Player.counter
        self._name = name
        self._last_name = last_name
        self._gender = gender
        self._age = age
        self._country = country
        self._competitor_id = competitor_id
        self._competitor_name = competitor_name
        self._height = height
        self._weight = weight
        self._overall_rank = overall_rank
        self._overall_score = overall_score
        self._year = year
        self._competition = competition
        self._height_cm = height_cm
        self._weight_kg = weight_kg

    def to_xml(self):
        el = ET.Element("Player")
        el.set("id", str(self._id))
        el.set("name", self._name)
        el.set("last_name", self._last_name)
        el.set("gender", self._gender)
        el.set("age", str(self._age))
        el.set("country", self._country)
        el.set("competitor_id", str(self._competitor_id))
        el.set("competitor_name", self._competitor_name)
        el.set("height", str(self._height))
        el.set("weight", str(self._weight))
        el.set("overall_rank", str(self._overall_rank))
        el.set("overall_score", str(self._overall_score))
        el.set("year", str(self._year))
        el.set("competition", self._competition)
        el.set("height_cm", str(self._height_cm))
        el.set("weight_kg", str(self._weight_kg))

        return el

    def __str__(self):
        return f"{self._name}, gender:{self._gender}, age:{self._age}, country:{self._country}"

Player.counter = 0