Feature: Application connectivity

  Scenario: Application responds '200' to 'GET' request
    Given app is started
    And endpoint is set to "/login"
    And given 60 seconds as maximum waiting period for app port connectivity
    When GET request is sent
    Then status code is 200