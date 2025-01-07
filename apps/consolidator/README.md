# Configuration

The default config file is located at `consolidator/src/assets/config/defaultConfig.json`.

To configure an instance please create or modify the instance config file at `consolidator/src/assets/config/instanceConfig.json`.

## Configuration Properties
Properties common for the configuration of all applications are specified in [configuration.md](configuration.md)

Items marked with (*) are required.\
Items marked with (#) are likely relevant.

- (*)`config`: Name of the instance, used when submitting a bug report.

- (#)`other_apps`: on a first level maps a language (`en`, `cs`, …) to another property. This property defines the labels that are shown in the "more applications" menu as map `other_app: label`, where `other_app` is one of `admin`, `profile`, `pwdReset`, `consolidator`, `linker` (as defined in `AppType`) and the label is the label to be displayed in the menu

- (#)`log_out_enabled`: if log out is enabled, this allows users to use the logout button, default: `true`

- `application`: name of the application, don't change it

- `use_localhost_linker_url`: for testing purposes, when we want to test the consolidator and linker both at once, we set this to true, in any other case keep it false

- `path_to_idp_provider_userinfo`: array of paths that in user info leads to user friendly name of the IdP

- `path_to_idp_logo_userinfo`: array of paths that in user info leads to IdP logo

- `path_to_idp_logo_width_userinfo`: array of paths that in user info leads to IdP logo width

- `path_to_idp_logo_height_userinfo`: array of paths that in user info leads to IdP logo height

- `header_label_<language_shortcut>`: string, name of the application

### Styling

- (#)`logo`: SVG image which will be shown on the top of the website on the left corner as an image title of the page

- (#)`theme`: object, definition of color palette used

  - `content_bg_color`: background color of tab content.

  - `nav_bg_color`: background color of the header.

  - `nav_text_color`: text color in the header.

  - `nav_icon_color`: color of the logo.

  - `footer_bg_color`: background color of the footer.

  - `footer_headers_text_color`: text color of the first row in the footer.

  - `footer_links_text_color`: text color of other rows in the footer.

  - `footer_copyright_text_color`: text color of copyright links.

  - `user_color`: color for spinners, input field highlights, etc.


