import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_email(userEmail):
    EMAIL_SENDER = os.getenv("STMP_SENDER_EMAIL")
    EMAIL_PASSWORD = os.getenv("STMP_SENDER_PASSWORD")

    msg = MIMEMultipart()
    msg["From"] = EMAIL_SENDER
    msg["To"] = userEmail
    msg["Subject"] = "Aviso de rastreador de precios"

    body = "👋¡Hola! Te avisaremos cuando el precio de tu producto haya cambiado"
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.send_message(msg)
