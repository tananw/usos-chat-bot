from flask import Flask, request
from flask_restplus import Api, Resource
from status_codes import HTTPSStatusCodes
from dotenv import load_dotenv
from usosapi import USOSAPIConnection
from flask_cors import CORS
import os

load_dotenv()

usosApi = USOSAPIConnection(os.getenv("USOS_BASE_URL"), os.getenv("USOS_CONSUMER_KEY"),
                            os.getenv("USOS_CONSUMER_SECRET"))
app = Flask(__name__)
CORS(app)
api = Api(app)


@api.route('/login')
class LoginHandler(Resource):
    def get(self):
        return {'url': usosApi.get_authorization_url()}


@api.route('/authorize')
class AuthorizeHandler(Resource):
    def post(self):
        try:
            req = request.get_json()
            pin = req['pin']
            return {'success': True, 'access_token': usosApi.authorize_with_pin(pin)}, HTTPSStatusCodes.OK.value
        except Exception:
            return {'error': 'Internal Server Error'}, HTTPSStatusCodes.InternalServerError.value


@api.route('/user')
class UserHandler(Resource):
    def get(self):
        if usosApi.is_authorized():
            return usosApi.get_user_information(), HTTPSStatusCodes.OK.value
        else:
            return {'error': 'Unauthorized'}, HTTPSStatusCodes.UNAUTHORIZED.value
        # try:
        # req = request.get_json()


@api.route('/schedule')
class ScheduleHandler(Resource):
    def get(self):
        if usosApi.is_authorized():
            return usosApi.get_user_schedule(), HTTPSStatusCodes.OK.value
        else:
            return {'error': 'Unauthorized'}, HTTPSStatusCodes.UNAUTHORIZED.value


@api.route('/grades')
class GradesHandler(Resource):
    def get(self):
        if usosApi.is_authorized():
            return usosApi.get_user_grades(), HTTPSStatusCodes.OK.value
        else:
            return {'error': 'Unauthorized'}, HTTPSStatusCodes.UNAUTHORIZED.value

@api.route('/authorized')
class AuthorizedHandler(Resource):
    def get(self):
        return usosApi.is_authorized(), HTTPSStatusCodes.OK.value

@api.route('/logout')
class LogoutHandler(Resource):
    def get(self):
        return usosApi.logout(), HTTPSStatusCodes.OK.value
        