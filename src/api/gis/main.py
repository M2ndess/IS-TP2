from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
from psycopg2 import OperationalError
import xml.etree.ElementTree as ET

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

def connectToDB():
    return psycopg2.connect(user="is", password="is", host="db-rel", database="is")

# GET that returns the points that are contained by the bounds in frontend
@app.route('/api/tile/<string:swLng>/<string:swlAT>/<string:neLng>/<string:neLat>', methods=['GET'])
def get_entities_by_tile():

    connection = connectToDB()
    cursor = connection.cursor()

    cursor.execute(f"WITH crossfit_data as ( "
                   f"    SELECT "
                   f"        t.id AS team_id, t.name AS team_name, "
                   f"        p.id AS player_id, p.name AS player_name, "
                   f"        p.gender, p.age, p.country, p.competitor_id, "
                   f"        p.competitor_name, p.height, p.weight, "
                   f"        p.overall_rank, p.overall_score, p.year, "
                   f"        p.competition, p.height_cm, p.weight_kg "
                   f"    FROM "
                   f"        teams t "
                   f"        JOIN players p ON t.id = p.team_id "
                   f") "
                   f"SELECT jsonb_build_object(  "
                   f"    'type', 'feature', "
                   f"    'geometry', ST_AsGeoJSON(ST_MakePoint(cast(cd.longitude as double precision), cast(cd.latitude as double precision)))::json, "
                   f"    'properties', to_jsonb(cd.*) -'geom' "
                   f") AS json "
                   f"FROM crossfit_data cd "
                   f"WHERE ST_Contains(ST_MakeEnvelope({neLng},{swLat},{swLng},{neLat}, 4326), ST_MakePoint(cast(cd.longitude as double precision), cast(cd.latitude as double precision)));"
                   )

    res = cursor.fetchall()
    connection.close()

    return jsonify([entity for entity in res])

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9000)
