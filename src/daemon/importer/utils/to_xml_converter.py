import csv
import xml.etree.ElementTree as ET
import xml.dom.minidom as md

from utils.reader import CSVReader
from entities.country import Country
from entities.team import Team
from entities.player import Player
from entities.competition import Competition
from entities.competition import CompetitionPlayer

class CSVtoXMLConverter:
    def __init__(self, path):
        self._reader = CSVReader(path)

    def to_xml(self):

        # read countries
        countries = self._reader.read_entities(
            attr="countryOfOriginName",
            builder=lambda row: Country(row["countryOfOriginName"])
        )

        # read teams
        teams = self._reader.read_entities(
            attr="affiliateName",
            builder=lambda row: Team(row["affiliateName"])
        )

        # read competitions
        competitions = self._reader.read_entities(
            attr="competition",
            builder=lambda row: Competition(row["year"], row["competition"])
        )

        # read players
        def after_creating_player(player, row):
            # add the player to the appropriate team
            teams[row["affiliateName"]].add_player(player)

        def after_creating_competition_player(comp_player, row):
            # add the competition player to the appropriate competition
            competitions[row["competition"]].add_player(comp_player)

        players = self._reader.read_entities(
            attr="firstName",
            builder=lambda row: Player(
                name=row["firstName"],
                last_name=row["lastName"],
                gender=row["gender"],
                age=row["age"],
                country=row["countryOfOriginName"],
                competitor_id=row["competitorId"],
                competitor_name=row["competitorName"],
                height=row["height"],
                weight=row["weight"],
                overall_rank=row["overallRank"],
                overall_score=row["overallScore"],
                year=row["year"],
                competition=row["competition"],
                height_cm=row["height_cm"],
                weight_kg=row["weight_kg"]
            ),
            after_create=after_creating_player
        )

        competition_players = self._reader.read_entities(
            attr="competitorName",
            builder=lambda row: CompetitionPlayer(
                competitor_id=row["competitorId"],
                competitor_name=row["competitorName"],
                overall_rank=row["overallRank"],
                overall_score=row["overallScore"],
            ),
            after_create=after_creating_competition_player
        )

        # generate the final xml
        root_el = ET.Element("Crossfit")

        countries_el = ET.Element("Countries")
        for country in countries.values():
            countries_el.append(country.to_xml())

        teams_el = ET.Element("Teams")
        for team in teams.values():
            teams_el.append(team.to_xml())

        competitions_el = ET.Element("Competitions")
        for competition in competitions.values():
            competitions_el.append(competition.to_xml())

        players_el = ET.Element("Players")
        for player in players.values():
            players_el.append(player.to_xml())

        competition_players_el = ET.Element("CompetitionPlayers")
        for comp_player in competition_players.values():
            competition_players_el.append(comp_player.to_xml())

        root_el.append(teams_el)
        root_el.append(players_el)
        root_el.append(countries_el)
        root_el.append(competitions_el)

        return root_el
    
    def to_xml_str(self):
        xml_str = ET.tostring(self.to_xml(), encoding='utf8', method='xml').decode()
        dom = md.parseString(xml_str)
        return dom.toprettyxml()