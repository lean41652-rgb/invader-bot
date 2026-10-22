from flask import Flask, request
import requests

app = Flask(__name__)

TOKEN = "TU_TOKEN_NUEVO_AQUÍ" # El nuevo que regeneraste
PHONE_ID = "1421015734426375"
VERIFY_TOKEN = "invader123"

def enviar_mensaje(to, texto):
    url = f"https://graph.facebook.com/v20.0/{PHONE_ID}/messages"
    headers = {"Authorization": f"Bearer {TOKEN}"}
    data = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": texto}
    }
    requests.post(url, headers=headers, json=data)

@app.route('/webhook', methods=['GET'])
def verificar():
    if request.args.get("hub.verify_token") == VERIFY_TOKEN:
        return request.args.get("hub.challenge")
    return "Error", 403

@app.route('/webhook', methods=['POST'])
def recibir():
    data = request.get_json()
    try:
        mensaje = data['entry'][0]['changes'][0]['value']['messages'][0]
        de = mensaje['from']
        texto = mensaje['text']['body'].lower()
        
        if "hola" in texto or "menu" in texto:
            enviar_mensaje(de, "👾 INVADER HARDWARE 👾\n\n1️⃣ Ver productos\n2️⃣ Armar PC\n3️⃣ Hablar con asesor\n\nEscribí el número")
        else:
            enviar_mensaje(de, f"Recibí: {texto}. Escribí MENU para ver opciones.")
    except:
        pass
    return "OK", 200

if __name__ == '__main__':
    app.run(port=10000)