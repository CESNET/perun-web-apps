import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  e2e: {
    ...nxE2EPreset(__filename),
    fileServerFolder: '.',
    fixturesFolder: './src/fixtures',
    video: true,
    videosFolder: '../../dist/cypress/apps/admin-gui-e2e/videos',
    screenshotsFolder: '../../dist/cypress/apps/admin-gui-e2e/screenshots',
    chromeWebSecurity: false,
    baseUrl: 'http://localhost:4200',
    testIsolation: false, // true means local/session storage and cookies are cleared before each test - it causes log out
    experimentalRunAllSpecs: true,
    defaultCommandTimeout: 10000, // default value is 4000ms, but it was not sufficient in our CI
    env: {
      BA_USERNAME: 'perun',
      BA_PASSWORD: 'test',
      BA_USERNAME_VO_MANAGER: 'voManager',
      BA_PASSWORD_VO_MANAGER: 'test',
      BA_USERNAME_GROUP_MANAGER: 'groupManager',
      BA_PASSWORD_GROUP_MANAGER: 'test',
      BA_USERNAME_FACILITY_MANAGER: 'facilityManager',
      BA_PASSWORD_FACILITY_MANAGER: 'test',
      BA_USERNAME_RESOURCE_MANAGER: 'resourceManager',
      BA_PASSWORD_RESOURCE_MANAGER: 'test',
      BA_USERNAME_TOP_GROUP_CREATOR: 'topGroupCreator',
      BA_PASSWORD_TOP_GROUP_CREATOR: 'test',
      BA_USERNAME_RESOURCE_SELF_SERVICE: 'resourceSelfService',
      BA_PASSWORD_RESOURCE_SELF_SERVICE: 'test',
      BA_USERNAME_TRUSTED_FACILITY_ADMIN: 'trustedFacilityAdmin',
      BA_PASSWORD_TRUSTED_FACILITY_ADMIN: 'test',
      BA_USERNAME_GROUP_OBSERVER: 'groupObserver',
      BA_PASSWORD_GROUP_OBSERVER: 'test',
      BA_USERNAME_FACILITY_OBSERVER: 'facilityObserver',
      BA_PASSWORD_FACILITY_OBSERVER: 'test',
      BA_USERNAME_RESOURCE_OBSERVER: 'resourceObserver',
      BA_PASSWORD_RESOURCE_OBSERVER: 'test',
      BA_USERNAME_VO_OBSERVER: 'voObserver',
      BA_PASSWORD_VO_OBSERVER: 'test',
      BA_USERNAME_PERUN_OBSERVER: 'perunObserver',
      BA_PASSWORD_PERUN_OBSERVER: 'test',
      BA_USERNAME_SPONSOR: 'sponsor',
      BA_PASSWORD_SPONSOR: 'test',
    },
    specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
