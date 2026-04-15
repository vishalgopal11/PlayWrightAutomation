@Login
Feature: Login Functionality
  As a user of the Ecommerce application
  I want to be able to login with valid credentials
  So that I can access the application features

  @Smoke @Positive
  Scenario Outline: Successful login with valid credentials
    Given I navigate to the Ecommerce application
    When I login with "<username>" and "<password>"
    Then I should see the Dashboard page

    Examples:
      | username          | password    |
      | anshika@gmail.com | Iamking@000 |

  @Negative
  Scenario Outline: Login with invalid credentials on Practice page
    Given I navigate to the Practice login page
    When I enter invalid username "<username>" and password "<password>"
    And I click the Sign In button
    Then I should see error message containing "<expectedError>"

    Examples:
      | username    | password | expectedError |
      | rahulshetty | learning | Incorrect     |
