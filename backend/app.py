from flask import Flask, request, jsonify
from flask_cors import CORS
from scrapper import web_scrapper

app = Flask(__name__)
CORS(app)


@app.route("/api/scrape", methods=["POST"])
def scrape_product():
    data = request.get_json()
    url = data.get("url")

    product_data = web_scrapper(url)
    return jsonify(product_data)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
