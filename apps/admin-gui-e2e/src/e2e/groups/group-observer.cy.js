/// <reference types="cypress" />

describe('Group management with role Group observer', () => {
  const dbGroupName = 'g-o-test-group';
  const dbGroupMember = 'g-o-testgroupmember';
  const dbGroupAdmin = 'g-o-testgroupadmin';
  const dbVoName = 'g-o-test-vo';
  const dbApplicationItemTextFieldName = 'g-o-input-test';
  const dbExtsource = 'internal';

  before(() => {
    cy.login('GROUP_OBSERVER', 'groupObserver');
  });

  beforeEach(() => {
    cy.visit('home')
      .get(`[data-cy=access-item-button]`)
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbVoName)
    cy.get(`[data-cy=${dbVoName}]`)
      .click()
    cy.get(`[data-cy=groups]`)
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbGroupName, {force: true})
    cy.get(`[data-cy=${dbGroupName}]`)
      .click();
  });

  it('test get member', () => {
    cy.get('[data-cy=members]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbGroupMember, {force: true})
    cy.intercept('**/membersManager/getMembersPage')
      .as('getMembers')
      .wait('@getMembers')
      .get(`[data-cy=${dbGroupMember}-firstName-td]`)
      .click()
    cy.get('[data-cy=search-select-input]')
      .should('exist')
  });

  it('test list vo members', () => {
    cy.get('[data-cy=vo-link]')
      .click({force: true})
    cy.get('[data-cy=members]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbGroupMember, {force: true})
    cy.intercept('**/membersManager/getMembersPage')
      .as('getMembers')
      .wait('@getMembers')
      .get(`[data-cy=${dbGroupMember}-firstName-td]`)
      .should('exist')
  });

  it('test list applications', () => {
    cy.get('[data-cy=applications]')
      .click()
    cy.get(`[data-cy=${dbGroupName}-id-td]`)
      .click()
    cy.get(`[data-cy=${dbExtsource}-application-extsource]`)
      .should('exist')
  });

  context('Advanced settings', () => {

    it('test list managers', () => {
      cy.get('[data-cy=managers]')
        .click()
      cy.get(`[data-cy=${dbGroupAdmin}-td]`)
        .should('exist')
    });

    it('test list extsources', () => {
      cy.get('[data-cy=external-sources]')
        .click()
      cy.get('[data-cy=filter-input]')
        .type(dbExtsource, {force: true})
      cy.get(`[data-cy=${dbExtsource}-name-td]`)
        .should('exist')
    });

    it('test get application form', () => {
      cy.get('[data-cy=application-form]')
        .click()
      cy.get(`[data-cy=${dbApplicationItemTextFieldName}-shortname-td]`)
        .should('exist')
    });
  });
});
