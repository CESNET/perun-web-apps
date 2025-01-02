## Configuration Properties

Items marked with (*) are required.\
Items marked with (#) are likely relevant.

- (*)`api_url`: URL of Perun RPC, e.g. `https://perun-dev.cesnet.cz/oauth/rpc`

- `oidc_client`: Necessary information needed for `oidc_client`

  - (*)`oauth_authority`:
    - Entity that issues a set of Claims
    - Case-sensitive URL using the HTTPS scheme that contains scheme, host, and optionally, port number and path components and no query or fragment components
    - e.g. `https://login.cesnet.cz/oidc/`

  - (*)`oauth_callback`: URL of the app, has to end with `/api-callback`

  - (*)`oauth_client_id`: Get this by registering the app to SP

  - (*)`oauth_post_logout_redirect_uri`: URL where the user is redirected after log out, by default this is empty

  - (*)`oauth_redirect_uri`:
    - Redirection URI to which the response will be sent after the user signs in
    - Usually same as `oauth_callback`
    - Has to end with `/api-callback`

  - `oauth_scopes`:
    - Defines scopes of the app as defined in [spec](https://openid.net/specs/openid-connect-basic-1_0.html#Scopes)
      - `openid`: Includes the identifier of the user (required for RPC and GUI)
      - `profile`: Includes other information about the user, e.g. name (required just for GUI)
      - `perun_api`: For accessing Perun API
      - `perun_admin`: Allows full access when the user is a Perun admin
      - `offline_access`: Allows usage of refresh tokens (required just for GUI which should use refresh tokens)
    - Default: `openid profile perun_api perun_admin`

  - `oauth_response_type`:
    - `id_token token` for implicit flow (now deprecated); [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.2)
    - `code` for code flow with PKCE; [RFC 6819](https://datatracker.ietf.org/doc/html/rfc6819#section-3.4)
    - Depends on proxy
    - Default: `code`

  - (#)`filters`: Shortcuts for values that are added to `acr_values` during authentication
    - `default`: Default value, which is added unless the query parameter `idpFilter` is set
    - When `idpFilter` is set, the long value corresponding to the short value sent in `idpFilter` is added to `acr_values`
    - This can be used, for example, with the CESNET proxy to send IdP filters. See [Podpora autentizačního filtru v novém GUI (restricted)](https://docs.google.com/document/d/1xsOk7oQIsiNDC79_3weupYVrTGuL0XXNcejEZaSL3XA/edit#heading=h.c64eub1gy3gt)

  - `oauth_offline_access_consent_prompt`:
    - If `offline_access` is contained in authorization scopes and this property is set to `true`, `prompt=consent` query parameter is added in client configuration

  - (*)`oauth_acr_value`:
    - Default `acr_value`
    - Default value (`urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport https://refeds.org/profile/sfa https://refeds.org/profile/mfa`) of this property enables correctly handling information about already performed MFA. If the IdP requires MFA by itself, Perun applications should skip its own MFA logic because the user already has a valid MFA session on the proxy.

- (*)`proxy_logout`: Boolean, if the logout process (including post-logout redirect) is handled by proxy or just locally, default: `true`

- (*)`mfa`: An object containing information needed for MFA
  - `url_<language_shortcut>`: URL for PrivacyIDEA
  - `step_up_available`: Boolean, whether the frontend will initiate step-up when the backend requires MFA
  - Default: `true`

- (#)`auto_auth_redirect`: boolean, whether the user will be automatically redirected to proxy for authentication after entering the GUI, if set to false, the user will be redirected to the login screen, default: `true`

- `document_title`: An object containing Html Document Title (what will be shown on the tab of the browser e.g.: `Perun Web Gui`) for all supported languages, e.g. `document_title`: `{ "en": "Example title" }`

- (#)`footer`: an object containing all the columns and copyright, if not filled default configuration is used

  - `columns`: array of objects representing each column in the footer

    - `title_<language_shortcut>`: title of the column in specified language

    - `logos`: boolean, flag whether the column contains logos

    - `elements`: array of links in this column

      - `logo`: string, name of the file or path to the file with logo, when using just name, the path to the directory is `/assets/config/`

      - `icon`: (optional) material icon displayed next to the label

      - `dialog`: (optional) short name of dialog that will be opened after clicking on the label (currently supported just value `reportIssue`)

      - `link_<language_shortcut>`: URL

      - `label_<language_shortcut>`: label of the link in a specific language, irrelevant when `logos` is set to `true`

  - `copyright_items`: array of objects for each party

    - `name`: string, name of a party

    - `url`: string, can be empty, URL to the website of a party

  - `gitlab_releases`: URL to the GitLab Releases page of the GUI

  - `gitlab_backend_releases`: URL to the GitLab Releases page of the backend

- `display_warning`: boolean, if there should be some sort of warning text that's always present on top of the GUI
  - If `display_warning` is set to true:
    - `warning_message`: type: string, text that will be shown on top of the GUI

- `instance_favicon`: if set to `true`, uses `instanceFavicon.ico` located in the directory of the configuration file (`/assets/config/instanceFavicon.ico`), the default option is `false`
