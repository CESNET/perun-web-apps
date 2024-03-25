/// <reference types="cypress" />

describe('Group management with role Top group creator', () => {
  const dbVoName = 'test-e2e-vo-from-db-4';
  const groupName = 'test';

  before(() => {
    cy.login('TOP_GROUP_CREATOR', 'topGroupCreator');
  });

  beforeEach(() => {
    cy.visit('home')
      .get(`[data-cy=access-item-button]`)
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbVoName, {force: true})
    cy.get(`[data-cy=${dbVoName}]`)
      .click()
    cy.get(`[data-cy=groups]`)
      .click()
  })

  it( 'test create top group', () => {
    cy.intercept('**/groupsManager/createGroup/**').as('createGroup')
      .get('[data-cy=create-group-button]')
      .click()
    cy.get('[data-cy=group-name]')
      .type(groupName, {force: true})
    cy.get('[data-cy=create-group-button-dialog]')
      .click()
    cy.wait('@createGroup')
      .intercept('**/groupsManager/getAllRichGroupsWithAttributesByNames**').as('getRichGroups')
      .wait('@getRichGroups')

      // assert that top group was created
      .get('[data-cy=filter-input]')
      .type(groupName, {force: true})
    cy.get(`[data-cy=${groupName}-checkbox]`)
      .should('exist');
  });

})
