from supabase import create_client, Client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def save_user(email, product_url, current_price):
    data = {"email": email, "product_url": product_url, "current_price": current_price}
    try:
        response = supabase.table("users").insert(data).execute()
        return response
    except Exception as e:
        print("Error al conectarse a supabase", e)
        return None
