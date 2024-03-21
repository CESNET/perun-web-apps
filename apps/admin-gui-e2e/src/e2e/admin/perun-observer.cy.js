/// <reference types="cypress" />

describe('Perun admin management with role Perun observer', () => {
  const dbServiceName = 'perun_observer_test';

  // the same data from perun admin tests
  const dbAttrFriendlyName = 'perunAdminTestAttr';
  const dbExtSourceName = 'test_ext_source_db';
  const dbConsentHubName = 'test-e2e-facility-from-db-3';
  const dbSearcherAttrDisplayName = 'login-namespace:einfra';
  const dbSearcherAttrValue = 'e2etestlogin';
  const dbSearcherUserFirstName = 'Test6';
  const dbOwnerName = 'DbOwnerTest';
  const dbBlockedLoginListOnly = "test_blocking_login_list"

  before(() => {
    cy.login('PERUN_OBSERVER', 'perunObserver');
  });

  beforeEach(() => {
    cy.visit('home')
      .get('[data-cy=admin-button]')
      .click();
  });

  it('test attribute detail', () => {
    cy.get('[data-cy=attribute-definitions]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbAttrFriendlyName, {force: true})
    cy.get(`[data-cy=${dbAttrFriendlyName.toLowerCase()}-friendly-name]`)
      .click()
    cy.get('[data-cy=display-name-input]')
      .should('have.value', dbAttrFriendlyName);
  });

  it('test user detail', () => {
    cy.get('[data-cy=users]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type('perunobservertest1', {force: true})
    cy.intercept('**/usersManager/getUsersPage')
      .as('getUsers')
      .wait('@getUsers')
      .get('[data-cy=perunobservertest1-td]')
      .click()
    cy.get('[data-cy=user-name-link]')
      .contains('PerunObserverTest1 PerunObserverTest1');
  });

  it('test list owners', () => {
    cy.get('[data-cy=owners]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbOwnerName, {force: true})
    cy.get(`[data-cy=${dbOwnerName}]`)
      .should('exist');
  });

  it('test service detail', () => {
    cy.get('[data-cy=services]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbServiceName, {force: true})
    cy.get(`[data-cy=${dbServiceName.toLowerCase()}-name-td]`)
      .click()
    cy.get(`[data-cy=service-name-link]`)
      .contains(dbServiceName);
  });

  it('test list ext sources', () => {
    cy.get('[data-cy=external-sources]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbExtSourceName, {force: true})
    cy.get(`[data-cy=${dbExtSourceName.toLowerCase()}-name-td]`)
      .should('exist');
  });

  it('test audit message detail', () => {
    cy.get('[data-cy=audit-log]')
      .click()
    cy.get(`[data-cy=audit-message-detail-button]`)
      .first()
      .click({force: true})
    cy.get('#mat-tab-label-0-1') // click on Message tab
      .click()
    cy.get(`[data-cy=audit-message-text]`)
      .should('not.be.empty');
  });

  it('test list consent hubs', () => {
    cy.get('[data-cy=consent-hubs]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbConsentHubName, {force: true})
    cy.get(`[data-cy=${dbConsentHubName.toLowerCase()}-name-td]`)
      .should('exist');
  });

  it('test search attribute', () => {
    cy.get('[data-cy=searcher]')
      .click()
    cy.get(`[data-cy=filter-input]`)
      .type(dbSearcherAttrValue, {force: true})
    cy.get(`[data-cy=search-select-input]`)
      .click()
    cy.get('[data-cy=find-input] > div > div > input')
      .type(dbSearcherAttrDisplayName, {force: true})
    cy.get('mat-option')
      .contains(dbSearcherAttrDisplayName)
      .click()
    cy.get('[data-cy=searcher-search-button]')
      .click()
    cy.get(`[data-cy=${dbSearcherUserFirstName.toLowerCase()}-firstName-td]`)
      .should('exist');
  });

  it("test get blocked login", () => {
    cy.get('[data-cy=blocked-logins]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbBlockedLoginListOnly, {force: true})
    cy.get(`[data-cy=${dbBlockedLoginListOnly}-checkbox]`)
      .should('exist');
  });
});
