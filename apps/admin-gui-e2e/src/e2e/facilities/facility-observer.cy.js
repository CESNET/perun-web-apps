/// <reference types="cypress" />

describe('Facility management with role Facility observer', () => {
  const dbFacilityName = 'f-o-test-facility';
  const dbResourceName = 'f-o-test-resource';
  const dbUserFirstName = 'f-o-assigned-user-firstname';
  const dbGroupName = 'f-o-test-group';
  const dbServiceName = 'f-o-test-service';
  const dbDestinationName = 'test-destination-hostname-cz';
  const dbDestinationNameSearch = 'test-destination.hostname.cz';
  const dbHostName = 'test-hostname-cz';
  const dbManagerFirstName = 'f-o-facility-manager-firstname';
  const dbAttributeName = 'uid-namespace';

  before(() => {
    cy.login('FACILITY_OBSERVER', 'facilityObserver');
  });

  beforeEach(() => {
    cy.visit('home')
      .get(`[data-cy=facilities-button]`)
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbFacilityName)
    cy.get(`[data-cy=${dbFacilityName}]`)
      .click();
  });

  it('test list resources', () => {
    cy.get('[data-cy=resources]')
      .click({ force: true })
    cy.get('[data-cy=filter-input]')
      .type(dbResourceName, {force: true})
    cy.get(`[data-cy=${dbResourceName}]`)
      .should('exist')
  });

  it('test list assigned users', () => {
    cy.get('[data-cy=assigned-users]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbUserFirstName, {force: true})
    cy.intercept('**/usersManager/getUsersPage')
      .as('getUsers')
      .wait('@getUsers')
      .get(`[data-cy=${dbUserFirstName}-td]`)
      .should('exist')
  });

  it('test list allowed groups', () => {
    cy.get('[data-cy=allowed-groups]')
      .click()
      // TODO: remove the comment below, if the test will be working
      // .reload()
    cy.get('[data-cy=filter-input]')
      .type(dbGroupName, {force: true})
    cy.get(`[data-cy=${dbGroupName}]`)
      .should('exist')
  });

  it('test get service status detail', () => {
    cy.get('[data-cy=services-status]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbServiceName, {force: true})
    cy.get(`[data-cy=${dbServiceName}]`)
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbDestinationNameSearch, {force: true})
    cy.get(`[data-cy=${dbDestinationName}]`)
      .should('exist')
  });

  it('test list destinations', () => {
    cy.get('[data-cy=services-destinations]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type('hostname.cz', {force: true})
    cy.get(`[data-cy=${dbDestinationName}]`)
      .should('exist')
  });

  // FIXME: in route-policiy.service.ts is the check for isFacilityAdmin();
  it.skip('test get host detail', () => {
    cy.get('[data-cy=hosts]')
      .click()
    cy.get(`[data-cy=${dbHostName}]`)
      .should('exist')
  });

  it('test list attributes', () => {
    cy.get('[data-cy=attributes]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type(dbAttributeName, {force: true})
    cy.get(`[data-cy=${dbAttributeName}-friendlyName]`)
      .should('exist')
  });

  context('Advanced settings', () => {

    it('test list managers', () => {
      cy.get('[data-cy=managers]')
        .click()
      cy.get(`[data-cy=${dbManagerFirstName}-td]`)
        .should('exist')
    });
  });
});
