from .execute_query import execute_query
import psycopg2

class QueryFunctions:

    def get_players_by_team(team_name):
        query = f"SELECT xpath('/Crossfit/Teams/Team[@name=\"{team_name}\"]/Players/Player/@name', xml)::text AS player_name FROM public.imported_documents;"
        result = execute_query(query)
        return result

    def get_players_by_age(min_age, max_age):
        query = f"SELECT unnest(xpath('/Crossfit/Players/Player[@age >= {min_age} and @age <= {max_age}]/@name', xml)) AS player_name, unnest(xpath('/Crossfit/Players/Player[@age >= {min_age} and @age <= {max_age}]/@age', xml)) AS player_age FROM public.imported_documents;"
        result = execute_query(query)
        return result

    def get_players_by_overall_rank(max_rank):
        query = f"SELECT unnest(xpath('/Crossfit/Competitions/Competition/CompetitionPlayers/CompetitionPlayer[@overall_rank <= {max_rank}]/@competitor_name', xml)) AS competitor_name, unnest(xpath('/Crossfit/Competitions/Competition/CompetitionPlayers/CompetitionPlayer[@overall_rank <= {max_rank}]/@overall_rank', xml)) AS competitor_rank FROM public.imported_documents;"
        result = execute_query(query)
        return result

    def get_players_by_country(country):
        query = f"SELECT unnest(xpath('/Crossfit/Players/Player[@country=\"{country}\"]/@name', xml)) AS player_name FROM public.imported_documents;"
        result = execute_query(query)
        return result

    def group_players_by_weight_height():
        query = """
            SELECT 
                unnest(xpath('/Crossfit/Players/Player/@weight_kg', xml))::text AS weight_kg,
                unnest(xpath('/Crossfit/Players/Player/@height_cm', xml))::text AS height_cm,
                unnest(xpath('/Crossfit/Players/Player/@name', xml))::text AS player_name
            FROM public.imported_documents
            GROUP BY weight_kg, height_cm, player_name
            ORDER BY weight_kg, height_cm, player_name;
        """
        result = execute_query(query)
        return result

    def get_players_info_by_competitor_id(competitor_id):
        competitor_id = float(competitor_id)
        query = f"""
            SELECT 
                xpath('/Crossfit/Players/Player[@competitor_id="{competitor_id}"]/@name', xml)::text AS player_name,
                xpath('/Crossfit/Players/Player[@competitor_id="{competitor_id}"]/@weight_kg', xml)::text AS player_weight_kg,
                xpath('/Crossfit/Players/Player[@competitor_id="{competitor_id}"]/@height_cm', xml)::text AS player_height_cm,
                xpath('/Crossfit/Teams/Team[Players/Player[@competitor_id="{competitor_id}"]]/@name', xml)::text AS team_name,
                xpath('/Crossfit/Players/Player[@competitor_id="{competitor_id}"]/@competition', xml)::text AS competition_name,
                xpath('/Crossfit/Competitions/Competition[CompetitionPlayers/CompetitionPlayer[@competitor_id="{competitor_id}"]]/@year', xml)::text AS competition_year
            FROM public.imported_documents
        """
        result = execute_query(query)
        competitor_id = int(competitor_id)
        return result
