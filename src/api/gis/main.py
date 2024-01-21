import sys
import binascii
import struct
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.database import Database

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 9000

app = Flask(__name__)
app.config["DEBUG"] = True

db = Database()

CORS(app)


@app.route('/update_country_coords', methods=['PATCH'])
def update_country_coords():
    try:
        data = request.json
        country_name = data.get('country_name')
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        if not country_name or not latitude or not longitude:
            return jsonify({"error": "Faltam dados obrigatórios"}), 400

        update_query = f"UPDATE countries SET coords = ST_SetSRID(ST_MakePoint({longitude}, {latitude}), 4326) WHERE name = '{country_name}'"
        db.update(update_query)

        return jsonify({"message": "Coordenadas atualizadas com sucesso"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_countries', methods=['GET'])
def get_countries():
    try:
        limit = int(request.args.get('limit', 70))

        countries = db.selectCountries(limit)

        if countries is None:
            # Handle the case where data retrieval was unsuccessful
            return jsonify({"error": "Failed to retrieve countries data"}), 500

        result = []
        for country in countries:
            result.append({
                "id": country[0],
                "name": country[1],
                "coordinates": country[2]
            })

        return jsonify(result), 200

    except Exception as e:
        # Handle other exceptions
        return jsonify({"error": str(e)}), 500

@app.route('/get_text_coordinates', methods=['GET'])
def get_text_coordinates():
    try:
        # Use request.args to get the 'country_id' query parameter
        country_id = request.args.get('country_id')

        # Check if 'country_id' is provided
        if not country_id:
            return jsonify({"error": "Missing 'country_id' parameter"}), 400

        # Use parameterized query to avoid SQL injection
        query = "SELECT ST_AsText(coords) FROM countries WHERE id = %s"
        result = db.selectAll(query, (country_id,))
        text_coordinates = result[0] if result else 'N/A'

        return jsonify({"textCoordinates": text_coordinates}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=PORT)
