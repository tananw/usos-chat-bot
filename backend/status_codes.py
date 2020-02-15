from enum import Enum


class HTTPSStatusCodes(Enum):
    OK = 200
    CREATED = 200
    ACCEPTED = 202
    BadRequest = 400
    UNAUTHORIZED = 401
    InternalServerError = 500
    ServiceUnavailable = 503
    BadGateway = 502
