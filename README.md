# [![Perun](https://webcentrum.muni.cz/media/3153530/perun.svg)](https://perun-aai.org)

## PerunWebApps

This repository contains Perun web applications.

### Repository information

All development takes place in [public repository](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps) on our self-hosted GitLab instance. This repository is mirrored on [GitHub](https://github.com/CESNET/perun-web-apps) for visibility.

### Tools and dependencies

1) Install NVM (Node Version Manager) `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash` (check [NVM GitHub repository](https://github.com/nvm-sh/nvm) for the newest version)
2) Install NodeJS `nvm install node`
3) Install AngularCLI `npm install -g @angular/cli`
4) Run `npm install`
5) For end-to-end tests, install [docker](https://docs.docker.com/engine/install/) (includes `docker compose`)

### Configuration

Further documentation on how to configure the application is [here](https://perunaai.atlassian.net/wiki/external/3440714/ZTRlMzIyY2ZjNzk1NDE3MzhkMzVkZDNmODIwN2UyYmY?atlOrigin=eyJpIjoiZGI5YTc5ZjE4M2ExNDk4YWExNjQ4ZTIyMTU1N2RmZGQiLCJwIjoiYyJ9)

### Contributing

This repository uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). To construct a proper commit message, run:

```sh
npx cz
```

instead of `git commit`.

### End-to-end tests

Cypress is used for end-to-end testing and runs in CI in every merge request and on the main branch.

To run tests locally:

1. Prepare instance config:

    ```sh
    cp e2e/instanceConfig.json apps/admin-gui/src/assets/config/instanceConfig.json
    ```

2. Get a [personal access token](https://gitlab.ics.muni.cz/-/profile/personal_access_tokens) with the scope `read_registry`
3. Log in to GitLab registry:

    ```sh
    sudo docker login registry.gitlab.ics.muni.cz:443
    # enter your username (UČO)
    # paste the personal access token
    ```

4. Start the environment:

    ```sh
    sudo docker compose up -d --build
    sudo docker compose logs -f
    ```

5. Run admin GUI and tests (in a second terminal):

    ```sh
    npm run e2e
    ```

6. Stop the environment:

    ```sh
    sudo docker compose down
    ```
