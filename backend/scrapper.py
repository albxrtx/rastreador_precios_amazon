from bs4 import BeautifulSoup
import requests
from flask import jsonify


def web_scrapper(url):
    if not url.startswith("http"):
        url = "https://" + url

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
    title = title.get_text(strip=True) if title else ""

    price_whole = soup.find("span", {"class": "a-price-whole"})
    price_whole = price_whole.get_text(strip=True) if price_whole else ""

    price_fraction = soup.find("span", {"class": "a-price-fraction"})
    price_fraction = price_fraction.get_text(strip=True) if price_fraction else ""

    img_url = soup.find("img", {"id": "landingImage"})
    img_url = img_url.get("src") if img_url else ""

    total_price = (price_whole + price_fraction).strip()
    if not total_price:
        total_price = "Precio no disponible"

    return {"title": title, "price": total_price, "img_url": img_url}
