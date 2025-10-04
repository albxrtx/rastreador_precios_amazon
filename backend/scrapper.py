from bs4 import BeautifulSoup
import requests
from flask import jsonify, request
import random


def web_scrapper(url):
    if not url.startswith("http"):
        url = "https://" + url

    USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    ]

    headers = {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "DNT": "1",
        "Connection": "keep-alive",
    }

    response = requests.get(url, headers=headers)

    # print(response.status_code)
    # print(response.text[:500])

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
