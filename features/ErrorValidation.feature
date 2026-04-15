@ErrorValidation
Feature: Error Validation
  As a user of the Ecommerce application
  I want to validate error scenarios
  So that the application handles errors gracefully

  @Negative @Practice
  Scenario Outline: Validate error on incorrect login
    Given I navigate to the Practice login page
    When I enter invalid username "<username>" and password "<password>"
    And I click the Sign In button
    Then I should see error message containing "<expectedError>"

    Examples:
      | username    | password | expectedError |
      | rahulshetty | learning | Incorrect     |
