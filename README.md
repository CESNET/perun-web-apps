# [![Perun](https://webcentrum.muni.cz/media/3153530/perun.svg)](https://perun-aai.org)

## PerunWebApps

This repository contains Perun web applications.

### Repository information

All development takes place in [public repository](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps) on our self-hosted GitLab instance. This repository is mirrored on [GitHub](https://github.com/CESNET/perun-web-apps) for visibility.

See also other related repositories in the [Perun IdM](https://gitlab.ics.muni.cz/perun/perun-idm) group.

### Tools and dependencies

1) Install NVM (Node Version Manager) `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash` (check [NVM GitHub repository](https://github.com/nvm-sh/nvm) for the newest version)
2) Install NodeJS `nvm install node`
3) Install AngularCLI `npm install -g @angular/cli`
4) Run `npm install`
5) For end-to-end tests, install [docker](https://docs.docker.com/engine/install/) (includes `docker compose`)

### Configuration

To deploy an application for production environment:

1) Configure web server `Apache`/`Nginx` with certificate
2) Register oidc client for each application at the service provider
3) Register and configure also backend as an OIDC client, if needed (set client id and client secret)
4) Create instance configuration file located at `perun-web-apps/apps/<app_name>/src/assets/config/instanceConfig.json` and configure the deployed application

To register an app to an SP contact the manager of the given instance.

The common configuration properties of **all** applications are specified in:

- [Common configuration](configuration.md)

For specific application configuration please refer to the README files in their respective folders:

- [Admin GUI](apps/admin-gui/README.md)
- [Consolidator](apps/consolidator/README.md)
- [Linker](apps/linker/README.md)
- [Password Reset](apps/password-reset/README.md)
- [Publications](apps/publications/README.md)
- [User profile](apps/user-profile/README.md)


### Contributing

If you want to contribute, you can check [CONTRIBUTING.md](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/-/blob/main/CONTRIBUTING.md) for more details.
