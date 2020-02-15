import hashlib
import os
import os.path
import tempfile
import urllib.request
import shutil
import rauth
import warnings
import re
import requests.exceptions
import logging
import time
from datetime import datetime

VERSION = '1.0.0'

_REQUEST_TOKEN_SUFFIX = 'services/oauth/request_token'
_AUTHORIZE_SUFFIX = 'services/oauth/authorize'
_ACCESS_TOKEN_SUFFIX = 'services/oauth/access_token'

SCOPES = 'offline_access|studies|grades'

_LOGGER = logging.getLogger('usos-chat-bot')
_DOWNLOAD_LOGGER = logging.getLogger('usos-chat-bot.download')


class USOSAPIException(Exception):
    pass


def download_file(url: str) -> str:
    md5 = hashlib.md5()
    file_name, extension = os.path.splitext(url)
    md5.update(url.encode())
    file_name = md5.hexdigest() + extension
    file_dir = os.path.join(tempfile.gettempdir(), 'usos-chat-bot')

    if not os.path.exists(file_dir):
        os.mkdir(file_dir)
    else:
        if not os.path.isdir(file_dir):
            shutil.rmtree(file_dir)
            os.mkdir(file_dir)

    file_name = os.path.join(file_dir, file_name)

    if os.path.exists(file_name):
        if os.path.isfile(file_name):
            return file_name
        else:
            shutil.rmtree(file_name)

    with urllib.request.urlopen(url) as resp, open(file_name, 'wb') as out:
        shutil.copyfileobj(resp, out)

    _DOWNLOAD_LOGGER.info('File from {} saved as {}.'.format(url, file_name))

    return file_name


class USOSAPIConnection():
    def __init__(self, api_base_address: str, consumer_key: str, consumer_secret: str):
        self.base_address = str(api_base_address)
        if not self.base_address:
            raise ValueError('Empty USOS API address.')
        if not self.base_address.startswith('https'):
            warnings.warn('Insecure protocol in USOS API address. '
                          'The address should start with https.')
        if not self.base_address.endswith('/'):
            self.base_address += '/'

        self.consumer_key = str(consumer_key)
        self.consumer_secret = str(consumer_secret)

        req_token_url = self.base_address + _REQUEST_TOKEN_SUFFIX
        authorize_url = self.base_address + _AUTHORIZE_SUFFIX
        access_token_url = self.base_address + _ACCESS_TOKEN_SUFFIX

        self._service = rauth.OAuth1Service(consumer_key=consumer_key,
                                            consumer_secret=consumer_secret,
                                            name='usos-chat-bot',
                                            request_token_url=req_token_url,
                                            authorize_url=authorize_url,
                                            access_token_url=access_token_url,
                                            base_url=self.base_address)

        self._request_token_secret = ''
        self._request_token = ''

        self._authorized_session = None
        _LOGGER.info('New connection to {} created with key: {} '
                     'and secret: {}'.format(api_base_address,
                                             consumer_key, consumer_secret))

    def _generate_request_token(self):
        params = {'oauth_callback': 'oob', 'scopes': SCOPES}
        token_tuple = self._service.get_request_token(params=params)
        self._request_token, self._request_token_secret = token_tuple
        _LOGGER.info("New request token generated: {}".format(token_tuple[0]))
        return

    def is_anonymous(self) -> bool:
        return self._authorized_session is None

    def is_authorized(self) -> bool:
        if self._authorized_session is None:
            return False
        try:
            identity = self.get('services/users/user')
            return bool(identity['id'])
        except USOSAPIException:
            return False

    def test_connection(self) -> bool:
        time_re = '^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6}$'
        try:
            anonymous_session = self._service.get_session()
            now = anonymous_session.get('/services/apisrv/now')
            now = now.json()
            return bool(re.match(time_re, now))
        except Exception as e:
            _LOGGER.debug('Connection test failed: {}'.format(e))
            return False

    def get_authorization_url(self) -> str:
        self._generate_request_token()
        url = self._service.get_authorize_url(self._request_token)
        _LOGGER.info('New authorization URL generated: {}'.format(url))
        return url

    def authorize_with_pin(self, pin: str):
        if not (self._request_token and self._request_token_secret):
            raise USOSAPIException('Request token not initialized. '
                                   'Use get_authorization_url to generate '
                                   'the token.')
        rt = self._request_token
        rts = self._request_token_secret
        params = {'oauth_verifier': pin}

        _LOGGER.debug('Trying to authorize request token {} '
                      'with PIN code: {}'.format(self._request_token, pin))

        try:
            self._authorized_session = \
                self._service.get_auth_session(rt, rts, params=params)
        except KeyError:
            response = self._service.get_raw_access_token(rt, rts,
                                                          params=params)
            text = response.json()
            if isinstance(text, dict) and 'message' in text:
                text = text['message']
            _LOGGER.info('Authorization failed, response message: ' + text)
            raise USOSAPIException(text)
        at = self.get_access_data()[0]
        _LOGGER.info('Authorization successful, received access token: ' + at)
        return at

    def get_user_information(self):
        try:
            identity = self.get('/services/users/user',
                                fields="id|first_name|last_name|has_photo|photo_urls|student_programmes|email")
            return identity
        except USOSAPIException:
            return False

    def get_user_schedule(self):
        try:
            schedule = self.get('/services/tt/student')
            return schedule
        except USOSAPIException:
            return False

    def get_user_grades(self):
        grades = self.get('/services/grades/latest',
                          fields="value_symbol|passes|value_description|exam_session_number|exam_id|comment|grade_type_id|date_modified|modification_author",
                          days=720)
        return grades

    def get_access_data(self) -> tuple:
        if self.is_anonymous():
            raise USOSAPIException('Connection not yet authorized.')
        at = self._authorized_session.access_token
        ats = self._authorized_session.access_token_secret
        return at, ats

    def set_access_data(self, access_token: str,
                        access_token_secret: str) -> bool:
        if not self.is_authorized():
            self._authorized_session = None
            _LOGGER.info("Access token {} is invalid,".format(access_token))
            return False

        _LOGGER.info('New access token ({}) and secret ({}) '
                     'set.'.format(access_token, access_token_secret))
        return True

    def get(self, service: str, **kwargs):
        session = self._service.get_session()
        if self._authorized_session is not None:
            session = self._authorized_session

        start = time.time()
        response = session.post(service, params=kwargs, data={})
        ex_time = time.time() - start

        if not response.ok:
            try:
                _LOGGER.info('{} ({}) FAILED: [{}] {}'
                             ''.format(service, repr(kwargs),
                                       response.status_code, response.text))
                response.raise_for_status()
            except requests.exceptions.HTTPError as e:
                if response.status_code == 401:
                    raise USOSAPIException('HTTP 401: Unauthorized. Your '
                                           'access key probably expired.')
                if response.status_code == 400:
                    msg = response.text
                    raise USOSAPIException('HTTP 400: Bad request: ' + msg)
                raise e

        _LOGGER.info("{} ({}) {:f}s".format(service, repr(kwargs),
                                            ex_time))
        _LOGGER.debug("{} ({}) -> {}".format(response.url, repr(kwargs),
                                             response.text))

        return response.json()

    def logout(self):
        if self._authorized_session is None:
            return

        at = self.get_access_data()[0]
        self.get('/services/oauth/revoke_token')
        _LOGGER.debug('Access token {} revoked.'.format(at))
        self._authorized_session = None

    def current_identity(self):
        try:
            data = self.get('services/users/user')
            return data
        except USOSAPIException:
            raise USOSAPIException('Trying to get identity of an unauthorized'
                                   ' session.')
