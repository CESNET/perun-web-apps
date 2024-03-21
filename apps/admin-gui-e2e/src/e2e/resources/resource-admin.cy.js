/// <reference types="cypress" />

describe('Resource management with role Resource admin', () => {
  const dbVoName = 'test-e2e-vo-from-db-3';
  const dbResourceName = 'test-e2e-resource-from-db-2';

  const dbAddManager = 'test4';
  const dbRemoveManager = 'resource-admin-2';

  const dbAttributeToAdd = 'user-settings-name';
  const dbAttributeToDelete = 'user-settings-description';

  const dbGroupToAssign = 'test-e2e-group-from-db-2';
  const dbGroupToRemove = 'test-e2e-group-from-db-1';

  before(() => {
    cy.login('RESOURCE_MANAGER', 'resourceManager');
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
      .click();
  });

  it('test add attribute', () => {
    cy.get('[data-cy=attributes]')
      .click()
    cy.get('[data-cy=add-attributes]')
      .click()
    cy.get(`[data-cy=${dbAttributeToAdd}-value]`)
      .type('test', {force: true})
    cy.intercept('**/attributesManager/getAttributes/r**')
      .as('getAttributes')
      .get('[data-cy=save-selected-attributes]')
      .click()
    cy.wait('@getAttributes')

      // check that attribute was added
      .get('[data-cy=filter-input]')
      .type('user settings name', {force: true})
    cy.get(`[data-cy=${dbAttributeToAdd}-value]`)
      .should('exist');
  });

  it('test delete attribute', () => {
    cy.get('[data-cy=attributes]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type('user settings description', {force: true})
    cy.get(`[data-cy=${dbAttributeToDelete}-checkbox]`)
      .click()
    cy.get('[data-cy=remove-attributes]')
      .click()
    cy.intercept('**/attributesManager/getAttributes/r**')
      .as('getAttributes')
      .get('[data-cy=delete-attributes]')
      .click()
    cy.wait('@getAttributes')

      // check that attribute was deleted
      .get(`[data-cy=${dbAttributeToDelete}-checkbox]`)
      .should('not.exist');
  });

  it('test assign group to resource', () => {
    cy.get('[data-cy=assigned-groups]')
      .click()
    cy.get('[data-cy=add-group-button]')
      .click()
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
    cy.get('[data-cy=assigned-groups]')
      .click()
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

  context('Advanced settings', () => {

    it('test add resource manager', () => {
      cy.get('[data-cy=managers]')
        .click()
      cy.get('[data-cy=add-manager-button]')
        .click()
      cy.get('[data-cy=search-manager-input]')
        .type(`${dbAddManager}`, {force: true})
      cy.get('[data-cy=search-manager-button]')
        .click()
      cy.get(`[data-cy=${dbAddManager}-checkbox]`)
        .click()
      cy.intercept('**/authzResolver/getRichAdmins**')
        .as('getRichAdmins')
        .get('[data-cy=add-manager-button-dialog]')
        .click()
      cy.wait('@getRichAdmins')

        // assert that manager was added
        .get(`[data-cy=${dbAddManager}-checkbox]`)
        .should('exist');
    });

    it('test remove resource manager', () => {
      cy.get('[data-cy=managers]')
        .click()
      cy.get(`[data-cy=${dbRemoveManager}-checkbox]`)
        .click()
      cy.get('[data-cy=remove-manager-button]')
        .click()
      cy.intercept('**/authzResolver/getRichAdmins**')
        .as('getRichAdmins')
        .get('[data-cy=remove-manager-button-dialog]')
        .click()
      cy.wait('@getRichAdmins')

        // assert that manager was removed
        .get(`[data-cy=${dbRemoveManager}-checkbox]`)
        .should('not.exist');
    });
  });
});
