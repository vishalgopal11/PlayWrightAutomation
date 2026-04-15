@Order
Feature: Place Order End to End
  As a logged in user
  I want to search for a product, add it to cart, and place an order
  So that I can purchase items from the Ecommerce application

  Background:
    Given I navigate to the Ecommerce application
    And I login with "anshika@gmail.com" and "Iamking@000"

  @Regression @E2E
  Scenario Outline: Place order and verify in order history
    When I add "<productName>" to the Cart
    Then I should see "<productName>" in the Cart
    When I proceed to checkout
    And I select country "<countryCode>" as "<countryName>"
    And I submit the order
    Then I should see order confirmation message
    When I navigate to Order History
    Then The order should be present in Order History

    Examples:
      | productName | countryCode | countryName |
      | ZARA COAT 3 | ind         | India       |

  @Smoke @DataDriven
  Scenario Outline: Add product to cart and verify
    When I add "<productName>" to the Cart
    Then I should see "<productName>" in the Cart

    Examples:
      | productName     |
      | ZARA COAT 3     |
      | ADIDAS ORIGINAL |
      | IPHONE 13 PRO   |
