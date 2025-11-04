# Configuration

The default config file is located at `user-profile/src/assets/config/defaultConfig.json`.

To configure an instance please create or modify the instance config file at `user-profile/src/assets/config/instanceConfig.json`.

## Configuration Properties
Properties common for the configuration of all applications are specified in [configuration.md](configuration.md)

Items marked with (*) are required.\
Items marked with (#) are likely relevant.

- (*)`displayed_tabs`: array of strings, contains all the tabs that are accessible on this instance in the order, they will be listed in side menu

  - `"profile"`, `"identities"`, `"services"`, `"groups"`, `"vos"`, `"privacy"`, `"consents"`, `"authentication"`, `"settings"`, `"data_quotas"`, `"ssh_keys"`, `"mfa"`, `"opt_out"`, `"samba"`, `"alt_passwords"`, `"pref_shells"`, `"pref_group_names"`, `"password_reset"`, `"external"`, `"local_acc"`, `"anti_phishing"`, `"accountActivation"`

- (#)`header_label_<language_shortcut>`: represents the name of app, located right next to the logo, usually represents the name of the app or additional text to the logo, if not filled default texts are used

- (#)`supported_languages`: array of languages that are supported (for setting application form, sending emails, setting of notification, ...), default is only `en`, currently supported values: `en`, `cs`. If you want to add some new language the GUI team needs to be warned.

- (#)`password_help`: map `namespace: text (allows also use of HTML)`, has to contain at least `default` as a namespace, serves as a hint about what criteria the password have to meet

- (#)`password_help_cs`: map `namespace: text (allows also use of HTML)`, has to contain at least `default` as a namespace, serves as a hint about what criteria the password have to meet

- (#)`log_out_enabled`: if log out is enabled, this allows users to use the logout button, default: `true`

- (#)`other_apps`: on a first level maps a language (`en`, `cs`, …) to another property. This property defines the labels that are shown in the "more applications" menu as map `other_app: label`, where `other_app` is one of `admin`, `profile`, `pwdReset`, `consolidator`, `linker` (as defined in `AppType`) and the label is the label to be displayed in the menu

- (#)`link_to_admin_gui_by_roles`: list of available roles which have a link to admin GUI in “more applications”

- (#)`local_account_namespace`: namespace of user local account

- (#)`gui_settings_panel`: whether to display settings panel, where user can change table size
  - recommended to set to `true`

- `auto_service_access_redirect`: automatically redirects users to `/service-access` to log in, use only when we don’t want users to use OIDC

- `profile_page_attributes`: an array of objects containing info about user attributes displayed on “profile” page

  - `friendly_name`: friendlyName of a user attribute, this specifies the displayed attribute (e.g. `login-namespace:einfra`)

  - `display_name_<language_shortcut>`: custom display name for this attribute; if left empty, current displayName of an attribute is used

  - `tooltip_<language_shortcut>`: tooltip that is displayed when hovering over the name of an attribute

  - `is_virtual`: boolean, whether an attribute is virtual or not, used only when getting attribute definition in case, the user does not have that specific user-attribute

- `external_services`: array of objects - links to external services which can be accessed through the side menu of the app

  - `url`: URL of the service

  - `label_<language_shortcut>`: label shown in the side menu, when the app uses specified translation

- `custom_labels`: array of objects for instance-specific translations for every label in the app

  - `label`: string representing a label in the code (e.g. `"PREFERRED_SHELLS.TITLE"`)

  - `<language_shortcut>`: new translation in specified language

- `brandings`: map of specific domain configs, this allows setting multiple brandings+configs on a single instance (e.g. for running on different domains), (key=hostname, value=object of config properties)

  - `<example_domain>`: this property can contain any config properties (even whole new instanceConfig) for each branding

- `export_limit`: type number, maximum number of entities to be exportable in tables

  - default: `1000`

### If tabs ‘auth’ AND ‘identities’ are present:

- `consolidator_url`: URL of old Consolidator

- `consolidator_url_cert`: URL of old Consolidator for certificate identities

- `use_new_consolidator`: set to true if you want to use new consolidator applications

- `use_localhost_linker_url`: for testing purposes, when we want to test the consolidator/user-profile and linker both at once, we set this to true, in any other case keep it false

- `display_identity_certificates`: boolean, whether to display at “Identities” page identities that are obtained through certificates

### If tab 'orcid' is present:

- `consolidator_url_orcid`: URL of old Consolidator for ORCID identities,
- (*)`orcid_ext_source_name`: The name of the ORCID external source

### If tab/s ‘vos’ and/or ‘groups’ are present:

- (*)`registrar_base_url`: URL of Registrar (for extending memberships)

### If tab ‘auth’ AND ‘password_reset’ are present:

- (*)`password_namespace_attributes`: an array of urns of login-namespace attributes, specifies namespaces where the password can be changed through Perun

### If tabs ‘auth’ AND 'mfa' are present:

- (*)`mfa`: an object containing information needed for MFA

  - `api_url`: URL for MFA API

  - `security_text_attribute`: string, urn of an attribute containing anti-phishing text (e.g. `urn:perun:user:attribute-def:def:securityText:mu`)

  - `step_up_available`: boolean, whether frontend will initiate step-up when backend requires MFA. default: `true`

  - `mfa_instance`: string, the definition of the instance name to get categories from the entityless attribute `urn:perun:entityless:attribute-def:def:mfaCategories` - `mfa_instance` used as a key for this attribute (e.g. mu)

  - `auth_validity`: number, defines for how long MFA will not be required since the last valid MFA (only for MFA settings)

  - `url_<language_shortcut>`: URL for privacyIDEA

### If tabs 'setting' AND ‘pref_group_names’ are present:

- (*)`preferred_unix_group_names`: array of strings, set only when `pref_group_names` is among displayed tabs, namespaces where the user can have a preferred name for a unix group

### Styling:

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
