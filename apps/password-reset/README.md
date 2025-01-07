# Configuration

The default config file is located at `password-reset/src/assets/config/defaultConfig.json`.

To configure an instance please create or modify the instance config file at `password-reset/src/assets/config/instanceConfig.json`.

## Configuration Properties

Items marked with (*) are required.\
Items marked with (#) are likely relevant.

- (*)`config`: name of the instance, used when submitting a bug report.

- (#)`log_out_enabled`: if log out is enabled, this allows users to use the logout button, default: `true`

- (#)`supported_languages`: array of languages that are supported (for setting application form, sending emails, setting of notification, ...), default is only `en`, currently supported values: `en`, `cs`. If you want to add some new language the GUI team needs to be warned.

- (#)`password_help`: map containing namespaces, at least default namespace has to be presented; each namespace then contains one object for `reset` and one object for `activation` - inside these objects are custom labels for success, errors, etc.

- (#)`password_help_cs`: map containing namespaces, at least default namespace has to be presented; each namespace then contains one object for `reset` and one object for `activation` - inside these objects are custom labels for success, errors, etc.

- (#)`default_namespace`: string, name of the default namespace

- `header_label_<language_shortcut>`: string, name of the application.

- `auto_service_access_redirect`: automatically redirects users to `/service-access` to log in, use only when we don’t want users to use OIDC

### Styling
Properties common for the configuration of all applications are specified in [configuration.md](configuration.md)

- (#)`logo`: SVG image displayed on the top-left corner of the website.

- (#)`password_reset_logo`: image displayed between the header and password reset form.

- (#)`theme`: object defining the color palette used.

  - `content_bg_color`: Background color of tab content.

  - `nav_bg_color`: Color of the header (navbar at the top).

  - `nav_text_color`: Text color in the header.

  - `nav_icon_color`: Color of the logo.

  - `footer_bg_color`: Background color of the footer.

  - `footer_headers_text_color`: Text color of the first row in the footer.

  - `footer_links_text_color`: Text color of rows in the footer (except the first one).

  - `footer_copyright_text_color`: Text color of copyright links.

  - `user_color`: Color of spinners, input field highlights, etc.
