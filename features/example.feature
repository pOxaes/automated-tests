Feature: As a user, I can find manomano

  Scenario: I search on google.com
    Given I am on google.com
    When I search for "manomano"
    Then I can see "ManoMano : Achat en ligne bricolage, rénovation et jardinage" in the results