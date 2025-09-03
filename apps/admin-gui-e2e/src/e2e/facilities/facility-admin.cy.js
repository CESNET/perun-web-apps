/// <reference types="cypress" />

describe('Facility management with role Facility admin', () => {
  const dbFacilityName1 = 'test-e2e-facility-from-db';
  const dbFacilityName2 = 'test-e2e-facility-from-db-2';
  const dbVoName = 'test-e2e-vo-from-db-for-facility';
  const dbResourceName = 'test-e2e-resource-from-db';

  const addedAttribute = 'login-namespace';
  const deleteAttribute = 'gid-namespace';
  const addManagerUser = 'facility-manager-2';
  const removeManagerUser = 'test3';

  before(() => {
    cy.login('FACILITY_MANAGER', 'facilityManager');
  });

  beforeEach(() => {
    cy.visit('home')
      .get(`[data-cy=facilities-button]`)
      .click();
  });
  // TODO CREATE TESTS FOR FACILITY CREATOR AND MOVE THIS THERE
  // it('test create facility', () => {
  //   cy.intercept('**/facilitiesManager/getFacilities')
  //     .as('getFacilities')
  //     .get('[data-cy=new-facility-button]')
  //     .click()
  //   cy.wait('@getFacilities')
  //     .get('[data-cy=facility-name-input]')
  //     .type('test-e2e-facility', {force: true})
  //   cy.get('[data-cy=facility-description-input]')
  //     .type('test-e2e-facility-description', {force: true})
  //   cy.get('[data-cy=create-facility-button]')
  //     .click()
  //   cy.intercept('**/facilitiesManager/getEnrichedFacilities')
  //     .as('getEnrichedFacilities')
  //     .wait('@getEnrichedFacilities')
  //     // assert that the facility was created
  //     .get('[data-cy=filter-input]')
  //     .type('test-e2e-facility', {force: true})
  //   cy.get('[data-cy=test-e2e-facility-checkbox]')
  //     .should('exist');
  // });

  it('test delete facility', () => {
    cy.intercept('**/facilitiesManager/getEnrichedFacilities')
      .as('getEnrichedFacilities')
      // .wait('@getEnrichedFacilities')
      .get('[data-cy=filter-input]')
      .type(dbFacilityName1, {force: true})
    cy.get(`[data-cy=${dbFacilityName1}-checkbox]`)
      .click()
    cy.get('[data-cy=delete-facility-button]')
      .click()
    cy.get('[data-cy=delete-button-dialog]')
      .click()
    cy.wait('@getEnrichedFacilities')
      .get(`[data-cy=${dbFacilityName1}-checkbox]`)
      .should('not.exist');
  });

  it('test create resource', () => {
    cy.intercept('**/facilitiesManager/getEnrichedFacilities')
      .as('getEnrichedFacilities')
      .intercept('**/vosManager/getAllVos')
      .as('getAllVos')
      // .wait('@getEnrichedFacilities')
      .get('[data-cy=filter-input]')
      .type(dbFacilityName2, {force: true})
    cy.get(`[data-cy=${dbFacilityName2}]`)
      .click()
    cy.get('[data-cy=resources]')
      .click()
    cy.get('[data-cy=create-resource-button]')
      .click()
    cy.wait('@getAllVos')
      .get('[data-cy=create-resource-select-vo]')
      .click()
    cy.get('[data-cy=find-input] > div > div > input')
      .type(dbVoName, {force: true})
    cy.get('mat-option')
      .contains(dbVoName)
      .click({ force: true })
    cy.get('[data-cy=create-resource-name-input]')
      .type('test-e2e-resource', {force: true})
    cy.get('[data-cy=create-resource-dialog-button]')
      .click()
    cy.intercept('**/facilitiesManager/getAssignedRichResources?**')
      .as('getAssignedResources')
      .wait('@getAssignedResources')
      .get('[data-cy=filter-input]')
      .type('test-e2e-resource', {force: true})
    cy.get('[data-cy=test-e2e-resource-checkbox]')
      .should('exist');
  });

  it('test delete resource', () => {
    cy.intercept('**/facilitiesManager/getEnrichedFacilities')
      .as('getEnrichedFacilities')
      .intercept('**/facilitiesManager/getAssignedRichResources?**')
      .as('getAssignedResources')
      // .wait('@getEnrichedFacilities')
      .get('[data-cy=filter-input]')
      .type(dbFacilityName2, {force: true})
    cy.get(`[data-cy=${dbFacilityName2}]`)
      .click()
    cy.get('[data-cy=resources]')
      .click()
    cy.wait('@getAssignedResources')
      .get('[data-cy=filter-input]')
      .type(dbResourceName, {force: true})
    cy.get(`[data-cy=${dbResourceName}-checkbox]`)
      .click()
    cy.get('[data-cy=delete-resource-button]')
      .click()
    cy.get('[data-cy=delete-button-dialog]')
      .click()
    cy.wait('@getAssignedResources')
      .get(`[data-cy=${dbResourceName}-checkbox]`)
      .should('not.exist');
  });

  it('test add attribute', () => {
    cy.intercept('**/facilitiesManager/getEnrichedFacilities')
      .as('getEnrichedFacilities')
      // .wait('@getEnrichedFacilities')
      .get('[data-cy=filter-input]')
      .type(dbFacilityName2, {force: true})
    cy.get(`[data-cy=${dbFacilityName2}]`)
      .click()
    cy.get('[data-cy=attributes]')
      .click()
    cy.get('[data-cy=add-attributes]')
      .click({ force: true })
    cy.get('.mat-mdc-dialog-container')
      .find('[data-cy=filter-input]') // finds the data-cy attribute inside the dialog container
      .type('Login namespace', {force: true})
    cy.get(`[data-cy=${addedAttribute}-value]`)
      .type('einfra', {force: true})
    cy.get('[data-cy=save-selected-attributes]')
      .click()
    cy.intercept('**/attributesManager/getAttributes/**')
      .as('getAttributes')
      .wait('@getAttributes')
      // assert that attribute exists
      .get('[data-cy=filter-input]')
      .type(addedAttribute, {force: true})
    cy.get(`[data-cy=${addedAttribute}-value]`)
      .should('exist');
  });

  it('test delete attribute', () => {
    cy.intercept('**/facilitiesManager/getEnrichedFacilities')
      .as('getEnrichedFacilities')
      // .wait('@getEnrichedFacilities')
      .get('[data-cy=filter-input]')
      .type(dbFacilityName2, {force: true})
    cy.get(`[data-cy=${dbFacilityName2}]`)
      .click()
    cy.get('[data-cy=attributes]')
      .click()
    cy.get('[data-cy=filter-input]')
      .type(deleteAttribute, {force: true})
    cy.get(`[data-cy=${deleteAttribute}-checkbox]`)
      .click()
    cy.get('[data-cy=remove-attributes]')
      .click({ force: true })
    cy.get('[data-cy=delete-attributes]')
      .click()
    cy.intercept('**/attributesManager/getAttributes/**')
      .as('getAttributes')
      .wait('@getAttributes')
      // assert that attribute exists
      .get(`[data-cy=${deleteAttribute}-checkbox]`)
      .should('not.exist');
  });

  context('Advanced settings', () => {

    it('test add facility manager', () => {
      cy.intercept('**/facilitiesManager/getEnrichedFacilities')
        .as('getEnrichedFacilities')
        .intercept('**/usersManager/findRichUsersWithAttributes?**')
        .as('findRichUsers')
        // .wait('@getEnrichedFacilities')
        .get('[data-cy=filter-input]')
        .type(dbFacilityName2, {force: true})
      cy.get(`[data-cy=${dbFacilityName2}]`)
        .click()
      cy.get('[data-cy=managers]')
        .click()
      cy.get('[data-cy=add-manager-button]')
        .click()
      cy.get('[data-cy=search-manager-input]')
        .type(addManagerUser, {force: true})
      cy.get('[data-cy=search-manager-button]')
        .click()
      cy.wait('@findRichUsers')
        .get(`[data-cy=${addManagerUser}-checkbox]`)
        .click()
      cy.get('[data-cy=add-manager-button-dialog]')
        .click()
      cy.intercept('**/authzResolver/getRichAdmins?**')
        .as('getRichAdmins')
        .wait('@getRichAdmins')
        // assert that manager was added
        .get(`[data-cy=${addManagerUser}-checkbox]`)
        .should('exist');
    });

    it('test remove facility manager', () => {
      cy.intercept('**/facilitiesManager/getEnrichedFacilities')
        .as('getEnrichedFacilities')
        // .wait('@getEnrichedFacilities')
        .get('[data-cy=filter-input]')
        .type(dbFacilityName2, {force: true})
      cy.get(`[data-cy=${dbFacilityName2}]`)
        .click()
      cy.get('[data-cy=managers]')
        .click()
      cy.get(`[data-cy=${removeManagerUser}-checkbox]`)
        .click()
      cy.get('[data-cy=remove-manager-button]')
        .should('have.attr', 'color', 'warn') // check if the button is enabled (due to the force click below)
        .click({ force: true })
      cy.get('[data-cy=remove-manager-button-dialog]')
        .click()
      cy.intercept('**/authzResolver/getRichAdmins?**')
        .as('getRichAdmins')
        .wait('@getRichAdmins')
        // assert that manager doesn't exist
        .get(`[data-cy=${removeManagerUser}-checkbox]`)
        .should('not.exist');
    });
  });
});
