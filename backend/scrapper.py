from bs4 import BeautifulSoup
import requests
from flask import jsonify, request
import random
import os

API_KEY = os.getenv("SCRAPER_API_KEY")
API_URL = os.getenv("SCRAPER_API_URL")


def web_scrapper(url):
    try:

        if not url.startswith("http"):
            url = "https://" + url

        params = {"api_key": API_KEY, "url": url, "country_code": "es", "render": True}

        response = requests.get(API_URL, params=params, timeout=30)

        if response.status_code != 200:
            return {"error": "Error al acceder a la página"}

        soup = BeautifulSoup(response.content, "html.parser")

        title = soup.find("span", {"id": "productTitle"})
        title = title.get_text(strip=True) if title else "Titulo no disponible"

        price_whole = soup.find("span", {"class": "a-price-whole"})
        price_whole = (
            price_whole.get_text(strip=True) if price_whole else "Precio no disponible"
        )

        price_fraction = soup.find("span", {"class": "a-price-fraction"})
        price_fraction = (
            price_fraction.get_text(strip=True)
            if price_fraction
            else "Precio no disponible"
        )

        img_url = soup.find("img", {"id": "landingImage"})
        img_url = img_url.get("src") if img_url else "Url de imagen no disponible"

        total_price = (price_whole + price_fraction).strip()
        if not total_price:
            total_price = "Precio no disponible"

        return {"title": title, "price": total_price, "img_url": img_url}
    except Exception as e:
        return {
            "error": str(e),
            "title": "Error al obtener datos",
            "price": "0",
            "img_url": "",
        }
