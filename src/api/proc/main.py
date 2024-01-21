import sys
import xmlrpc.client
from flask import Flask,request,jsonify
from flask_cors import CORS

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 9000
app = Flask(__name__)
CORS(app)

@app.route('/api/players_team', methods=['GET'])
def get_players_by_team():
    server_url = 'http://rpc-server:9000'
    server = xmlrpc.client.ServerProxy(server_url)
    nome_team = request.args.get("nome_team")
    players = server.get_players_by_team(nome_team)

    return players

@app.route('/api/players_age', methods=['GET'])
def get_players_by_age():
    server_url = 'http://rpc-server:9000'
    server = xmlrpc.client.ServerProxy(server_url)
    max_age = request.args.get("max_age")
    min_age=request.args.get("min_age")
    players = server.get_players_by_age(min_age, max_age)

    return players

@app.route('/api/players_overall_rank', methods=['GET'])
def get_players_by_overall_rank():
    server_url = 'http://rpc-server:9000'
    server = xmlrpc.client.ServerProxy(server_url)
    overall_rank=request.args.get("overall_rank")
    players = server.get_players_by_overall_rank(overall_rank)

    return players

@app.route('/api/players_country', methods=['GET'])
def get_players_by_country():
    server_url = 'http://rpc-server:9000'
    server = xmlrpc.client.ServerProxy(server_url)
    country = request.args.get("country")
    players = server.get_players_by_country(country)

    return players

@app.route('/api/players_weight_height', methods=['GET'])
def group_players_by_weight_height():
    server_url = 'http://rpc-server:9000'
    server = xmlrpc.client.ServerProxy(server_url)
    players = server.group_players_by_weight_height();

    return players

@app.route('/api/players_competitor_id', methods=['GET'])
def get_players_info_by_competitor_id():
    server_url = 'http://rpc-server:9000'
    server = xmlrpc.client.ServerProxy(server_url)
    competitor_id=request.args.get("competitor_id")
    players = server.get_players_info_by_competitor_id(competitor_id)

    return players


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=PORT)