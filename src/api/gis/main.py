import sys
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
        country_name = data.get('name')
        coords = data.get('coords')

        if not country_name or not coords:
            return jsonify({"error": "Faltam dados obrigatórios"}), 400

        update_query = f"UPDATE country SET geom = jsonb_build_object('type', 'Point', 'coordinates', ARRAY{coords}::numeric[]) WHERE country_name = '{country_name}'"
        db.update(update_query)

        return jsonify({"message": "Coordenadas atualizadas com sucesso"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=PORT)
