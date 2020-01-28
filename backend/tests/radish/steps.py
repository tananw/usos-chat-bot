from radish import given, when, then, world
import subprocess
import os
import time
import socket
import requests
from requests.exceptions import InvalidURL


class ConnectionException(Exception):
    def __init__(self, message):
        super().__init__(message)
        self.message = message


@given("app is started")
def flask_run(step):
    """ Set FLASK_APP env variable and starting process which runs the app. """
    world.config.user_data["host"] = "localhost"
    world.config.user_data["port"] = 5000
    os.environ['FLASK_APP'] = "../src/main.py"
    world.config.user_data['process'] = subprocess.Popen(["flask", "run"], shell=False,
                                                         stdout=subprocess.PIPE)


@given("endpoint is set to {endpoint:QuotedString}")
def set_endpoint_name(step, endpoint):
    step.context.request_url = f"http://{world.config.user_data['host']}:{world.config.user_data['port']}{endpoint}"


@given("given {period:d} seconds as maximum waiting period for app port connectivity")
def wait_for_port_connectivity(step, period):
    for tries in range(period):
        time.sleep(1)
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex((world.config.user_data["host"], world.config.user_data["port"]))
        if result == 0:
            step.context.is_port_opened = True
            break
    else:
        raise ConnectionException(f"Port is closed. Tried to connect for: {period} seconds")


@when("GET request is sent")
def send_get_request(step):
    """  Try to get response from previously provided endpoint.  """
    try:
        step.context.response = requests.get(step.context.request_url)
    except InvalidURL:
        raise InvalidURL("Can't get connection from endpoint")


@then("status code is {status_code:d}")
def check_if_status_code_is_valid(step, status_code):
    assert step.context.response.status_code == status_code, "Actual status code: %d \n Expected status code: %d" % \
                                                             (step.context.response.status_code, status_code)
