from flask import Flask, request
from flask_restplus import Api, Resource
from status_codes import HTTPSStatusCodes
from dotenv import load_dotenv
from usosapi import USOSAPIConnection
import os

load_dotenv()

usosApi = USOSAPIConnection(os.getenv("USOS_BASE_URL"), os.getenv("USOS_CONSUMER_KEY"),
                            os.getenv("USOS_CONSUMER_SECRET"))
app = Flask(__name__)
api = Api(app)


@api.route('/login')
class LoginHandler(Resource):
    def get(self):
        return {'response': usosApi.get_authorization_url()}


@api.route('/authorize')
class AuthorizeHandler(Resource):
    def post(self):
        try:
            req = request.get_json()
            print('req {}'.format(req))
            pin = req['pin']
            usosApi.authorize_with_pin(pin)
            return {'success': True}, HTTPSStatusCodes.OK.value
        except Exception:
            return {'error': 'Internal Server Error'}, HTTPSStatusCodes.InternalServerError.value
