/// <reference types="cypress" />

describe('Resource management with role Resource self service', () => {
  const dbVoName = 'test-e2e-vo-from-db-6';
  const dbResourceName = 'test-e2e-resource-from-db-4';

  const dbGroupToAssign = 'test-e2e-group-from-db-9';
  const dbGroupToRemove = 'test-e2e-group-from-db-8';
  const dbGroupToActivate = 'test-e2e-group-from-db-7';
  const dbGroupToDeactivate = 'test-e2e-group-from-db-6';


  before(() => {
    cy.login('RESOURCE_SELF_SERVICE', 'resourceSelfService');
  });

  beforeEach(() => {
    cy.visit('home')
      .get(`[data-cy=access-item-button]`)
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbVoName, {force: true})
    cy.get(`[data-cy=${dbVoName}]`)
      .click()
    cy.get(`[data-cy=resource-list]`)
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbResourceName, {force: true})
    cy.get(`[data-cy=${dbResourceName}]`)
      .click()
    cy.get('[data-cy=assigned-groups]')
      .click();
  });

  it('test assign group to resource', () => {
    cy.get('[data-cy=add-group-button]')
      .should('have.attr', 'color', 'accent') // check if the button is enabled (due to the force click below)
      .click({ force: true })
    cy.get(`[data-cy=${dbGroupToAssign}-checkbox]`)
      .click()
    cy.get('[data-cy=next-button]')
      .click()
    cy.intercept('**/resourcesManager/getGroupAssignments**')
      .as('getGroupAssignments')
      .get('[data-cy=assign-button]')
      .click()
    cy.wait('@getGroupAssignments')

      //  assert that group was added
      .get('[data-cy=filter-input]')
      .type(dbGroupToAssign, {force: true})
    cy.get(`[data-cy=${dbGroupToAssign}-checkbox]`)
      .should('exist');
  });

  it('test remove group from resource', () => {
    cy.get('[data-cy=filter-input]')
      .type(dbGroupToRemove, {force: true})
    cy.get(`[data-cy=${dbGroupToRemove}-checkbox]`)
      .click()
    cy.get('[data-cy=remove-group-button]')
      .click()
    cy.intercept('**/resourcesManager/getGroupAssignments**')
      .as('getGroupAssignments')
      .get('[data-cy=delete-button]')
      .click()
    cy.wait('@getGroupAssignments')

      //  assert that group was removed
      .get(`[data-cy=${dbGroupToRemove}-checkbox]`)
      .should('not.exist');
  });

  it('test activate group resource assignment', () => {
    cy.get('[data-cy=filter-input]')
      .type(dbGroupToActivate, {force: true})
    cy.get(`[data-cy=${dbGroupToActivate}-inactive]`)
      .click()
    cy.intercept('**/resourcesManager/activateGroupResourceAssignment**')
      .as('activateGroupResourceAssignment')
      .get('[data-cy=change-status-button]')
      .click()
    cy.wait('@activateGroupResourceAssignment')

      //  assert that group is active
      .get(`[data-cy=${dbGroupToActivate}-active]`)
      .should('exist');
  });

  it('test deactivate group resource assignment', () => {
    cy.get('[data-cy=filter-input]')
      .type(dbGroupToDeactivate, {force: true})
    cy.get(`[data-cy=${dbGroupToDeactivate}-active]`)
      .click()
    cy.intercept('**/resourcesManager/deactivateGroupResourceAssignment**')
      .as('deactivateGroupResourceAssignment')
      .get('[data-cy=change-status-button]')
      .click()
    cy.wait('@deactivateGroupResourceAssignment')

      //  assert that group is inactive
      .get(`[data-cy=${dbGroupToDeactivate}-inactive]`)
      .should('exist');
  });
});
