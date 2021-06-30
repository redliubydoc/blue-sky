import requests
import os

from flask import Flask, render_template, request, send_from_directory
from credentials import appid

if appid == '':
    appid = os.environ.get('APPID')

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/img/<file>')
def imgs(file):
    return send_from_directory('static/img', path=file)

@app.route('/api')
def api():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    q = request.args.get('q')    
    
    if lat is not None and lon is not None:
        params = {
            'appid': appid,
            'lat': lat,
            'lon': lon,
            'units': 'metric',
            'lang': 'us'
        }
        response = requests.get('https://api.openweathermap.org/data/2.5/weather', params=params)
        response.close()
        return response.json()

    elif q is not None:
        params = {
            'appid': appid,
            'q': q,
            'units': 'metric',
            'lang': 'us'
        }
        response = requests.get('https://api.openweathermap.org/data/2.5/weather', params=params)
        response.close()
        return response.json()

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000))
        debug=False
    )