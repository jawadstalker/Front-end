import requests
import os


API_KEY = os.getenv("SMS_API_KEY")


def send_sms(phone, code):

    url = f"https://api.kavenegar.com/v1/{API_KEY}/verify/lookup.json"


    data = {
        "receptor": phone,
        "token": code,
        "template": "otp"
    }


    response = requests.post(
        url,
        data=data
    )


    return response.json()