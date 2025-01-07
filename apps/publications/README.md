# Configuration

The default config file is located at `publications/src/assets/config/defaultConfig.json`.

To configure an instance please create or modify the instance config file at `publications/src/assets/config/instanceConfig.json`.

## Configuration Properties
Properties common for the configuration of all applications are specified in [configuration.md](configuration.md)

Items marked with (*) are required.\
Items marked with (#) are likely relevant.

- (#)`link_to_admin_gui_by_roles`: list of available roles which have a link to admin GUI in “more applications”

- (#)`log_out_enabled`: if log out is enabled, this allows users to use the logout button, default: `true`

- (#)`other_apps`: on a first level maps a language (`en`, `cs`, …) to another property. This property defines the labels that are shown in the "more applications" menu as map `other_app: label`, where `other_app` is one of `admin`, `profile`, `pwdReset`, `consolidator`, `linker` (as defined in `AppType`) and the label is the label to be displayed in the menu

- (#)`supported_languages`: array of languages that are supported (for setting application form, sending emails, setting of notification, ...), default is only `en`, currently supported values: `en`, `cs`. If you want to add some new language the GUI team needs to be warned.

- `header_label_<language_shortcut>`: represents the name of app, located right next to the logo, usually represents the name of the app or additional text to the logo, if not filled default texts are used

- `auto_service_access_redirect`: automatically redirects users to `/service-access` to log in, use only when we don’t want users to use OIDC

- `allowed_owners_for_thanks`: owners that can be displayed in the table of acknowledgements

- `document_title`: An object containing the HTML document title (what will be shown on the tab of the browser, e.g., `Perun Web Gui`) for all supported languages. e.g.:
  `document_title: {en: "Example title"}`

- `export_limit`: Type number, maximum number of entities exportable in tables
  - default: 1000

### Styling

- (#)`logo`: an image which will be shown on the top of the website on the left corner as an image title of the page

- (#)`theme`: object, definition of color palette used

  - `content_bg_color`: background color of tab content, usually white

  - `nav_bg_color`: color of header (navbar at the top)

  - `nav_text_color`: text color in header

  - `nav_icon_color`: color of logo

  - `footer_bg_color`: color of footer

  - `footer_headers_text_color`: text color of first row in footer

  - `footer_links_text_color`: text color of all rows in footer except first one

  - `footer_copyright_text_color`: text color of copyright links

  - `sidemenu_text_color`: text color in sidemenu

  - `sidemenu_bg_color`: color of sidemenu

  - `sidemenu_hover_color`: color of highlight when hovering over sidemenu row

  - `sidemenu_active_color`: color of currently active tab in sidemenu

  - `sidemenu_active_text_color`: text color of currently active tab in sidemenu

  - `sidemenu_hover_text_color`: text color of hovered tab in sidemenu

  - `user_color`: color of spinners, input field highlights, etc.

