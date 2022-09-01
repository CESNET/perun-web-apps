context('Actions', () => {
  const dbVoName = 'test-e2e-vo-from-db-5';
  const dbResourceName = 'test-e2e-resource-from-db-3';

  const dbGroupToAssign = 'test-e2e-group-from-db-3';
  const dbGroupToRemove = 'test-e2e-group-from-db-4';
  const dbGroupToActivate = 'test-e2e-group-from-db-4';
  const dbGroupToDeactivate = 'test-e2e-group-from-db-5';
  const dbUserToAssignRoles = 'test7';
  const dbUserToRemoveRoles = 'test8';

  before(() => {
    if (Cypress.env('BA_USERNAME_TRUSTED_FACILITY_ADMIN')) {
      sessionStorage.setItem('baPrincipal', '{"name": "trustedFacilityAdmin"}');
      sessionStorage.setItem('basicUsername', Cypress.env('BA_USERNAME_TRUSTED_FACILITY_ADMIN'));
      sessionStorage.setItem('basicPassword', Cypress.env('BA_PASSWORD_TRUSTED_FACILITY_ADMIN'));
      cy.visit('service-access');
    }
  });

  beforeEach(() => {
    cy.visit('organizations')
      .get(`[data-cy=${dbVoName}]`)
      .click()
      .get('[data-cy=resources]')
      .click()
      .get('[data-cy=resource-list]')
      .click()
      .get(`[data-cy=${dbResourceName}]`)
      .click()
  })

  it( 'test assign group to resource', () => {

    cy.intercept('**/groupsManager/getAllGroups**').as('getAllGroups')
      .get('[data-cy=assigned-groups]')
      .click()
      .get('[data-cy=add-group-button]')
      .click()
      .wait('@getAllGroups')
      .get(`[data-cy=${dbGroupToAssign}-checkbox]`)
      .click()
      .get('[data-cy=next-button]')
      .click()
      .intercept('**/resourcesManager/getGroupAssignments**').as('getGroupAssignments')
      .get('[data-cy=assign-button]')
      .click()
      .wait('@getGroupAssignments')

      //  assert that group was added
      .get(`[data-cy=${dbGroupToAssign}-checkbox]`)
      .should('exist')

  })

  it('test activate group assignment', () => {

    cy.get('[data-cy=assigned-groups]')
      .click()
      .get(`[data-cy=${dbGroupToActivate}-inactive]`)
      .click()
      .get('[data-cy=change-status-button]')
      .click()
      .intercept('**/resourcesManager/getGroupAssignments**').as('getGroupAssignments')
      .wait('@getGroupAssignments')

      // assert that group was activated
      .get(`[data-cy=${dbGroupToActivate}-active]`)
      .should('exist')

  })


  it( 'test remove group from resource', () => {

    cy.get('[data-cy=assigned-groups]')
      .click()
      .get(`[data-cy=${dbGroupToRemove}-checkbox]`)
      .click()
      .get('[data-cy=remove-group-button]')
      .click()
      .intercept('**/resourcesManager/getGroupAssignments**').as('getGroupAssignments')
      .get('[data-cy=delete-button]')
      .click()
      .wait('@getGroupAssignments')

      //  assert that group was removed
      .get(`[data-cy=${dbGroupToRemove}-checkbox]`)
      .should('not.exist')
  })

  it('test deactivate group assignment', () => {

    cy.get('[data-cy=assigned-groups]')
      .click()
      .get(`[data-cy=${dbGroupToDeactivate}-active]`)
      .click()
      .get('[data-cy=change-status-button]')
      .click()
      .intercept('**/resourcesManager/getGroupAssignments**').as('getGroupAssignments')
      .wait('@getGroupAssignments')

      // assert that group was deactivated
      .get(`[data-cy=${dbGroupToDeactivate}-inactive]`)
      .should('exist')

  })

  it('test add resource manager', () => {

    cy.get('[data-cy=advanced-settings]')
      .click()
      .get('[data-cy=managers]')
      .click()
      .get('[data-cy=add-manager-button]')
      .click()
      .get('[data-cy=search-manager-input]')
      .type(`${dbUserToAssignRoles}`)
      .get('[data-cy=search-manager-button]')
      .click()
      .get(`[data-cy=${dbUserToAssignRoles}-checkbox]`)
      .click()
      .intercept('**/authzResolver/getRichAdmins**').as('getRichAdmins')
      .get('[data-cy=add-manager-button-dialog]')
      .click()
      .wait('@getRichAdmins')

      // assert that manager was added
      .get(`[data-cy=${dbUserToAssignRoles}-checkbox]`)
      .should('exist')
  })

  it('test add resource observer', () => {

    cy.get('[data-cy=advanced-settings]')
      .click()
      .get('[data-cy=managers]')
      .click()
      .get('[data-cy=role-filter]')
      .click()
      .get('[data-cy=resourceobserver]')
      .click()
      .get('[data-cy=add-manager-button]')
      .click()
      .get('[data-cy=search-manager-input]')
      .type(`${dbUserToAssignRoles}`)
      .get('[data-cy=search-manager-button]')
      .click()
      .get(`[data-cy=${dbUserToAssignRoles}-checkbox]`)
      .click()
      .intercept('**/authzResolver/getRichAdmins**').as('getRichAdmins')
      .get('[data-cy=add-manager-button-dialog]')
      .click()
      .wait('@getRichAdmins')

      // assert that manager was added
      .get(`[data-cy=${dbUserToAssignRoles}-checkbox]`)
      .should('exist')
  })

  it('test add resource self service', () => {

    cy.get('[data-cy=advanced-settings]')
      .click()
      .get('[data-cy=managers]')
      .click()
      .get('[data-cy=role-filter]')
      .click()
      .get('[data-cy=resourceselfservice]')
      .click()
      .get('[data-cy=add-manager-button]')
      .click()
      .get('[data-cy=search-manager-input]')
      .type(`${dbUserToAssignRoles}`)
      .get('[data-cy=search-manager-button]')
      .click()
      .get(`[data-cy=${dbUserToAssignRoles}-checkbox]`)
      .click()
      .intercept('**/authzResolver/getRichAdmins**').as('getRichAdmins')
      .get('[data-cy=add-manager-button-dialog]')
      .click()
      .wait('@getRichAdmins')

      // assert that manager was added
      .get(`[data-cy=${dbUserToAssignRoles}-checkbox]`)
      .should('exist')
  })

  it('test remove resource manager', () => {

    cy.get('[data-cy=advanced-settings]')
      .click()
      .get('[data-cy=managers]')
      .click()
      .get(`[data-cy=${dbUserToRemoveRoles}-checkbox]`)
      .click()
      .get('[data-cy=remove-manager-button]')
      .click()
      .intercept('**/authzResolver/getRichAdmins**').as('getRichAdmins')
      .get('[data-cy=remove-manager-button-dialog]')
      .click()
      .wait('@getRichAdmins')

      // assert that manager was removed
      .get(`[data-cy=${dbUserToRemoveRoles}-checkbox]`)
      .should('not.exist')
  })

  it('test remove resource observer', () => {

    cy.get('[data-cy=advanced-settings]')
      .click()
      .get('[data-cy=managers]')
      .click()
      .get('[data-cy=role-filter]')
      .click()
      .get('[data-cy=resourceobserver]')
      .click()
      .get(`[data-cy=${dbUserToRemoveRoles}-checkbox]`)
      .click()
      .get('[data-cy=remove-manager-button]')
      .click()
      .intercept('**/authzResolver/getRichAdmins**').as('getRichAdmins')
      .get('[data-cy=remove-manager-button-dialog]')
      .click()
      .wait('@getRichAdmins')
      .get('[data-cy=role-filter]')
      .click()
      .get('[data-cy=resourceobserver]')
      .click()
      .intercept('**/authzResolver/getRichAdmins**').as('getRichAdmins')
      .wait('@getRichAdmins')

      // assert that manager was removed
      .get(`[data-cy=${dbUserToRemoveRoles}-checkbox]`)
      .should('not.exist')
  })

  it('test remove resource self service', () => {

    cy.get('[data-cy=advanced-settings]')
      .click()
      .get('[data-cy=managers]')
      .click()
      .get('[data-cy=role-filter]')
      .click()
      .get('[data-cy=resourceselfservice]')
      .click()
      .get(`[data-cy=${dbUserToRemoveRoles}-checkbox]`)
      .click()
      .get('[data-cy=remove-manager-button]')
      .click()
      .intercept('**/authzResolver/getRichAdmins**').as('getRichAdmins')
      .get('[data-cy=remove-manager-button-dialog]')
      .click()
      .wait('@getRichAdmins')
      .get('[data-cy=role-filter]')
      .click()
      .get('[data-cy=resourceselfservice]')
      .click()
      .intercept('**/authzResolver/getRichAdmins**').as('getRichAdmins')
      .wait('@getRichAdmins')


      // assert that manager was removed
      .get(`[data-cy=${dbUserToRemoveRoles}-checkbox]`)
      .should('not.exist')
  })



})
