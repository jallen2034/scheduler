describe('Navigation', () => {
  it('should visit root', () => {
    cy.visit('/');
  });

  // Create a new test in the navigation.spec.js file.
  // Give it the name "should navigate to Tuesday".
  // The first step will be to visit the root of our web server.
  it('should navigate to Tuesday', () => {
    cy.visit('/');

    // old worse way targeting the entire list item and trying to target a day with "tuesday"
    cy.contains('li', 'Tuesday')
      .click()
      .should('have.css', 'background-color', 'rgb(242, 242, 242)');

    // new way - targeting data-testid which is more precise and accurate
    cy.contains('[data-testid=day]', 'Tuesday')
      .click()
      .should('have.class', 'day-list__item--selected');
  });
});
