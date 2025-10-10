/// <reference types="cypress" />

describe('VO management with role VO admin', () => {
  const dbVoName = 'test-e2e-vo-from-db';
  const dbGroupName = 'test-group-from-db';
  const dbApplicationItemTextFieldName = 'input-test';
  const dbVoManager = 'vo-manager-2';
  const dbUser = 'test';

  const addedAttribute = 'notification-default-language';

  before(() => {
    cy.login('VO_MANAGER', 'voManager');
  });

  beforeEach(() => {
    cy.visit('home')
      .get(`[data-cy=access-item-button]`)
      .click()
  });
  // TODO CREATE TESTS FOR VO CREATOR AND MOVE THIS THERE
  // it('test create vo', () => {
  //   cy.intercept('**/vosManager/createVo/**')
  //     .as('createVo')
  //     .intercept('**/vosManager/getEnrichedVoById**')
  //     .as('getVoById')
  //     .get('[data-cy=new-vo-button]')
  //     .click()
  //   cy.get('[data-cy=vo-name-input]')
  //     .type('test-e2e-vo', {force: true})
  //   cy.get('[data-cy=vo-shortname-input]')
  //     .type('test-e2e-vo', {force: true})
  //   cy.get('[data-cy=create-vo-button]')
  //     .click()
  //   cy.wait('@createVo')
  //     .wait('@getVoById')
  //     // assert that the vo was created
  //     .get('[data-cy=notification-message]')
  //     .contains('New organization was successfully created')
  //     .should('exist');
  // });

  it('test add attribute', () => {
    cy.intercept('**/attributesManager/setAttributes/vo')
      .as('setAttributes')
      .get('[data-cy=filter-input]')
      .type(dbVoName, {force: true})
    cy.get(`[data-cy=${dbVoName}]`)
      .click()
    cy.get('[data-cy=attributes]')
      .click()
    cy.get('[data-cy=add-attributes]')
      .click({ force: true })
    // get attribute Notification default language
    cy.get(`[data-cy=${addedAttribute}-value]`)
      .type('en', {force: true})
    cy.intercept('**/attributesManager/getAttributes/vo**')
      .as('getAttributes')
      .get('[data-cy=save-selected-attributes]')
      .click()
    cy.wait('@setAttributes')
      .wait('@getAttributes')
      // assert that attribute exists
      .get('[data-cy=filter-input]')
      .type('notification default language', {force: true})
    cy.get(`[data-cy=${addedAttribute}-value]`)
      .should('exist');
  });

  it('test delete attribute', () => {
    cy.intercept('**/attributesManager/removeAttributes/**')
      .as('removeAttributes')
      .get('[data-cy=filter-input]')
      .type(dbVoName, {force: true})
    cy.get(`[data-cy=${dbVoName}]`)
      .click()
    cy.get('[data-cy=attributes]')
      .click()
    // get attribute Link to AUP
    cy.get('[data-cy=filter-input]')
      .type('link to aup', {force: true})
    cy.get('[data-cy=link-to-aup-checkbox]')
      .click()
    cy.get('[data-cy=remove-attributes]')
      .click({ force: true })
    cy.intercept('**/attributesManager/getAttributes/vo**')
      .as('getAttributes')
      .get('[data-cy=delete-attributes]')
      .click()
    cy.wait('@removeAttributes')
      .wait('@getAttributes')
      // assert that attribute exists
      .get('[data-cy=link-to-aup-checkbox]')
      .should('not.exist');
  });

  it('test add vo member', () => {
    cy.intercept('**/membersManager/addMemberCandidates')
      .as('addMemberCandidates')
      .get('[data-cy=filter-input]')
      .type(dbVoName, {force: true})
    cy.get(`[data-cy=${dbVoName}]`)
      .click()
    cy.get('[data-cy=members]')
      .click()
    cy.get('[data-cy=add-members]')
      .should('have.attr', 'color', 'accent') // check if the button is enabled (due to the force click below)
      .click({ force: true })
    cy.get('[data-cy=search-members]')
      .find('[data-cy=filter-input]')
      .type(`${dbUser}`, {force: true})
    cy.get(`[data-cy=${dbUser}-checkbox]`)
      .click()
    cy.intercept('**/membersManager/getMembersPage')
      .as('getMembers')
      .get('[data-cy=add-button]')
      .click()
    cy.wait('@addMemberCandidates')
      .wait('@getMembers')
      // assert that member was created
      .get('[data-cy=filter-input]')
      .type(dbUser, {force: true})
    cy.get(`[data-cy=${dbUser}-checkbox]`)
      .should('exist');
  });

  it('test remove vo member', () => {
    cy.intercept('**/membersManager/deleteMembers**')
      .as('deleteMembers')
      .get('[data-cy=filter-input]')
      .type(dbVoName, {force: true})
    cy.get(`[data-cy=${dbVoName}]`)
      .click()
    cy.get('[data-cy=members]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbVoManager, {force: true})
    cy.intercept('**/membersManager/getMembersPage')
      .as('getMembers')
      .wait('@getMembers')
      .get(`[data-cy=${dbVoManager}-checkbox]`)
      .click()
    cy.get('[data-cy=remove-members]')
      .should('have.attr', 'color', 'warn') // check if the button is enabled (due to the force click below)
      .click({ force: true })
    cy.get('[data-cy=remove-members-dialog]')
      .click()
    cy.wait('@deleteMembers')
      .wait('@getMembers')
      // assert that member was removed
      .get(`[data-cy=${dbVoManager}-checkbox]`)
      .should('not.exist');
  });

  it('test add group', () => {
    cy.intercept('**/groupsManager/createGroup/**')
      .as('createGroup')
      .get('[data-cy=filter-input]')
      .type(dbVoName, {force: true})
    cy.get(`[data-cy=${dbVoName}]`)
      .click()
    cy.get('[data-cy=groups]')
      .click()
    cy.get('[data-cy=create-group-button]')
      .click()
    cy.get('[data-cy=group-name]')
      .type('test-group', {force: true})
    cy.get('[data-cy=group-description]')
      .type('test-group-description', {force: true})
    cy.get('[data-cy=create-group-button-dialog]')
      .click()
    cy.wait('@createGroup')
      .intercept('**/groupsManager/getAllRichGroupsWithAttributesByNames**')
      .as('getGroups')
      .wait('@getGroups')
      // assert that group was created
      .get('[data-cy=filter-input]')
      .type('test-group', {force: true})
    cy.get('[data-cy=test-group-checkbox]')
      .should('exist');
  });

  it('test remove group', () => {
    cy.intercept('**/groupsManager/deleteGroups')
      .as('deleteGroups')
      .get('[data-cy=filter-input]')
      .type(dbVoName, {force: true})
    cy.get(`[data-cy=${dbVoName}]`)
      .click()
    cy.get('[data-cy=groups]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbGroupName, {force: true})
    cy.get(`[data-cy=${dbGroupName}-checkbox]`)
      .click()
    cy.get('[data-cy=delete-group-button]')
      .click()
    cy.get('[data-cy=delete-button-dialog]')
      .click()
    cy.wait('@deleteGroups')
      .intercept('**/groupsManager/getAllRichGroupsWithAttributesByNames**')
      .as('getGroups')
      .wait('@getGroups')
      // assert that group was deleted
      .get(`[data-cy=${dbGroupName}-checkbox]`)
      .should('not.exist');
  });

  context('Advanced settings', () => {
    beforeEach(() => {
      cy.get('[data-cy=filter-input]')
        .type(dbVoName, {force: true})
      cy.get(`[data-cy=${dbVoName}]`)
        .click()
    })

    it('test create vo application form item', () => {
      cy.intercept('**/registrarManager/updateFormItems/**')
        .as('addFormItem')
        .get('[data-cy=application-form]')
        .click()
      cy.get('[data-cy=add-form-item]')
        .click()
      cy.get('[data-cy=item-short-name]')
        .type('Header', {force: true})
      cy.get('[data-cy=add-form-item-button-dialog]')
        .click()
      cy.get('[data-cy=edit-form-item-button-dialog]')
        .click()
      cy.intercept('**/registrarManager/getFormItems/vo**')
        .as('getFormItems')
        .get('[data-cy=save-application-form]')
        .click()
      cy.wait('@addFormItem')
        .wait('@getFormItems')
        .get('[data-cy=refresh-button]')
        .click()
      cy.wait('@getFormItems')
        // assert that form item exists
        .get('[data-cy=header-delete]')
        .should('exist');
    });

    it('test delete vo application form item', () => {
      cy.intercept('**/registrarManager/updateFormItems/**')
        .as('deleteFormItem')
        .intercept('**/registrarManager/getFormItems/vo**')
        .as('getFormItems')
        .get('[data-cy=application-form]')
        .click()
      cy.wait('@getFormItems')
        .get(`[data-cy=${dbApplicationItemTextFieldName}-delete]`)
        .click()
      cy.get('[data-cy=delete-application-form-item-dialog]')
        .click()
      cy.get('[data-cy=save-application-form]')
        .click()
      cy.wait('@deleteFormItem')
        .get('[data-cy=refresh-button]')
        .click()
        // assert that form item doesn't exist
      cy.get(`[data-cy=${dbApplicationItemTextFieldName}-delete]`)
        .should('not.exist');
    });

    it('test add vo manager', () => {
      cy.intercept('**/authzResolver/setRole/**')
        .as('setRole')
        .get('[data-cy=managers]')
        .click()
      cy.get('[data-cy=add-manager-button]')
        .click()
      cy.get('[data-cy=search-manager-input]')
        .type(`${dbUser}`, {force: true})
      cy.get('[data-cy=search-manager-button]')
        .click()
      cy.get(`[data-cy=${dbUser}-checkbox]`)
        .click()
      cy.get('[data-cy=add-manager-button-dialog]')
        .click()
      cy.intercept('**/authzResolver/getRichAdmins**')
        .as('getRichAdmins')
        .wait('@setRole')
        .wait('@getRichAdmins')
        // assert that manager was added
        .get(`[data-cy=${dbUser}-checkbox]`)
        .should('exist');
    });

    it('test remove vo manager', () => {
      cy.intercept('**/authzResolver/unsetRole/**')
        .as('unsetRole')
        .get('[data-cy=managers]')
        .click()
      cy.get(`[data-cy=${dbVoManager}-checkbox]`)
        .click()
      cy.get('[data-cy=remove-manager-button]')
        .click()
      cy.intercept('**/authzResolver/getRichAdmins**')
        .as('getRichAdmins')
        .get('[data-cy=remove-manager-button-dialog]')
        .click()
      cy.wait('@unsetRole')
        .wait('@getRichAdmins')
        // assert that manager doesn't exist
        .get(`[data-cy=${dbVoManager}-checkbox]`)
        .should('not.exist');
    });
  });
});
