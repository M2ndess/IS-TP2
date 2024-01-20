from .execute_query import execute_query
import psycopg2

class QueryFunctions:

    def get_players_by_team(server):
        team_name = input("Enter team name: ")

        query = f"SELECT xpath('/Crossfit/Teams/Team[@name=\"{team_name}\"]/Players/Player/@name', xml)::text AS player_name FROM public.imported_documents;"
        result = execute_query(query)

        # Verifica se há resultados antes de imprimir
        if result:

            for player_name_list in result:
                player_names = player_name_list[0]

                # Remover os caracteres especiais e quebras de linha do início e do final da string
                player_names = player_names.strip('{}').replace(',', '\n')

                print("\nPlayers Names:")
                print()
                print(player_names)
        else:
            print("Nenhum jogador encontrado para a equipe especificada.")
    def get_players_by_age(server):
        min_age = float(input("Enter minimum age: "))
        max_age = float(input("Enter maximum age: "))

        query = f"SELECT unnest(xpath('/Crossfit/Players/Player[@age >= {min_age} and @age <= {max_age}]/@name', xml)) AS player_name, unnest(xpath('/Crossfit/Players/Player[@age >= {min_age} and @age <= {max_age}]/@age', xml)) AS player_age FROM public.imported_documents;"

        result = execute_query(query)

        # Verifica se há resultados antes de imprimir
        if result:
            print("\nPlayers Names - Age")
            for player_data in result:
                player_name = player_data[0].strip('{}')
                player_age = int(float(player_data[1]))

                # Imprimir nome e idade do jogador
                print(f"{player_name} - Age: {player_age}")
        else:
            print("Nenhum jogador encontrado na faixa etária especificada.")
    def get_players_by_overall_rank(server):
        max_rank = float(input("Enter maximum overall rank: "))

        query = f"SELECT unnest(xpath('/Crossfit/Competitions/Competition/CompetitionPlayers/CompetitionPlayer[@overall_rank <= {max_rank}]/@competitor_name', xml)) AS competitor_name, unnest(xpath('/Crossfit/Competitions/Competition/CompetitionPlayers/CompetitionPlayer[@overall_rank <= {max_rank}]/@overall_rank', xml)) AS competitor_rank FROM public.imported_documents;"

        result = execute_query(query)

        # Verifica se há resultados antes de imprimir
        if result:
            print("\nPlayers Names - Overall Rank")
            for player_data in result:
                competitor_name = player_data[0].strip('{}')
                competitor_rank = int(float(player_data[1]))

                # Imprimir nome e classificação geral do jogador
                print(f"{competitor_name} - {competitor_rank}")
        else:
            print("Nenhum jogador encontrado com classificação geral abaixo ou igual à especificada.")

    def get_players_by_country(server):
        country = input("Enter country: ")

        query = f"SELECT unnest(xpath('/Crossfit/Players/Player[@country=\"{country}\"]/@name', xml)) AS player_name FROM public.imported_documents;"

        result = execute_query(query)

        # Verifica se há resultados antes de imprimir
        if result:
            print(f"\nPlayers from {country}:")
            for player_name_list in result:
                player_name = player_name_list[0].strip('{}')

                print(player_name)
        else:
            print(f"Nenhum jogador encontrado do país {country}.")

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

    def get_players_info_by_competitor_id(server):
        competitor_id = input("Enter player Competitor ID: ")
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

        # Check if there are results before printing
        if result:
            player_name = result[0][0].strip('{}')
            player_weight_kg = result[0][1].strip('{}')
            player_height_cm = result[0][2].strip('{}')
            team_name = result[0][3].strip('{}')
            competition_name = result[0][4].strip('{}')
            competition_year = result[0][5].strip('{}')

            print(f"\nPlayer Info for Competitor ID {competitor_id}:")
            print(f"Name: {player_name}")
            print(f"Weight: {player_weight_kg} kg")
            print(f"Height: {player_height_cm} cm")
            print(f"Team: {team_name}")
            print(f"Competition: {competition_name}")
            print(f"Competition Year: {competition_year}")
        else:
            print(f"No player found with Competitor ID {competitor_id}.")
