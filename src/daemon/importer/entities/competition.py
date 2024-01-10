import xml.etree.ElementTree as ET

class CompetitionPlayer:
    def __init__(self, competitor_id, competitor_name, overall_rank, overall_score):
        self._competitor_id = competitor_id
        self._competitor_name = competitor_name
        self._overall_rank = overall_rank
        self._overall_score = overall_score

    def to_xml(self):
        el = ET.Element("CompetitionPlayer")
        el.set("competitor_id", str(self._competitor_id))
        el.set("competitor_name", self._competitor_name)
        el.set("overall_rank", str(self._overall_rank))
        el.set("overall_score", str(self._overall_score))

        return el

class Competition:
    counter = 0  # Inicializando o contador de competições

    def __init__(self, year, competition_name):
        Competition.counter += 1
        self._id = Competition.counter
        self._year = year
        self._competition_name = competition_name
        self._players = []

    def add_player(self, player: 'CompetitionPlayer'):
        self._players.append(player)

    def to_xml(self):
        el = ET.Element("Competition")
        el.set("id", str(self._id))
        el.set("year", str(self._year))
        el.set("competition_name", self._competition_name)

        players_el = ET.Element("CompetitionPlayers")
        for player in self._players:
            players_el.append(player.to_xml())

        el.append(players_el)

        return el

    def __str__(self):
        return f"{self._competition_name} ({self._year})"
