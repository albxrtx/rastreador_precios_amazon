from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/api/scrape", methods=["POST"])
def scrape_product():
    data = request.get_json()
    url = data.get("url")

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/123.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
    }

    response = requests.get(url, headers=headers)

    soup = BeautifulSoup(response.content, "html.parser")

    title = soup.find("span", {"id": "productTitle"})
    if title:
        title = title.get_text(strip=True)

    price = soup.find("span", {"class": "a-price-whole"})
    if price:
        price = price.get_text(strip=True)

    price_fraction = soup.find("span", {"class": "a-price-fraction"})
    if price_fraction:
        price_fraction = price_fraction.get_text(strip=True)

    img_url = soup.find("img", {"id": "landingImage"})
    if img_url:
        img_url = img_url.get("src")

    total_price = price + price_fraction
    return jsonify({"title": title, "price": total_price, "img_url": img_url})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
