from flask import Flask, jsonify, send_from_directory
from data import BY_ID, BY_NAME_KEY, sanitize_query

app = Flask(__name__, static_folder=None)


@app.route('/pokemon/<query>', methods=['GET'])
def get_pokemon(query):
    qstr = str(query)
    if qstr.isdigit():
        pid = int(qstr)
        if pid in BY_ID:
            return jsonify(BY_ID[pid])
        return jsonify({"error": "Pokemon no encontrado"}), 404
    key = sanitize_query(qstr)
    if key in BY_NAME_KEY:
        return jsonify(BY_NAME_KEY[key])
    return jsonify({"error": "Pokemon no encontrado"}), 404


@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('images', filename)


@app.route('/')
def index():
    return send_from_directory('web', 'index.html')


@app.route('/web/<path:filename>')
def web_static(filename):
    return send_from_directory('web', filename)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)