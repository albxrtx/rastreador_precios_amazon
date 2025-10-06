from flask import Flask, request, jsonify
from flask_cors import CORS
from scrapper import web_scrapper
from email_sender import send_email
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route("/api/scrape", methods=["POST"])
def scrape_product():
    data = request.get_json()
    url = data.get("url")

    product_data = web_scrapper(url)
    return jsonify(product_data)


@app.route("/api/email_sender", methods=["POST"])
def email_sender():
    data = request.get_json()
    user_email = data.get("userEmail")
    try:
        send_email(user_email)
        return {"message": "Email enviado con éxito"}, 200
    except Exception as e:
        return {"error": str(e)}, 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
