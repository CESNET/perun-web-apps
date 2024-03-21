/// <reference types="cypress" />

describe('VO management with role Perun admin', () => {
  const dbVoName = 'test-e2e-vo-to-delete';

  before(() => {
    cy.login('', 'perun');
  });

  beforeEach(() => {
    cy.visit('home')
      .get(`[data-cy=access-item-button]`)
      .click()
  });

  it('test delete vo', () => {
    cy.intercept('**/vosManager/deleteVo**')
      .as('deleteVo')
      .get('[data-cy=filter-input]')
      .type(`${dbVoName}`, {force: true})
    cy.get(`[data-cy=${dbVoName}]`)
      .click({force: true}) // covered by toolbar (header)
    cy.get('[data-cy=delete-vo]')
      .click({force: true}) // covered by span
    cy.get('[data-cy=force-delete]')
      .click()
    cy.get('[data-cy=force-delete-control]')
      .type('DELETE', {force: true})
    cy.get('[data-cy=force-delete-button]')
      .click()
    cy.wait('@deleteVo')

      // assert that the delete action was successful
      .get('[data-cy=notification-message]')
      .contains('Organization was successfully removed')
      .should('exist');
  });

});
