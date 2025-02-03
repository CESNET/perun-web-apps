# Configuration

The default config file is located at `admin-gui/src/assets/config/defaultConfig.json`.

To configure an instance please create or modify the instance config file at `admin-gui/src/assets/config/instanceConfig.json`.

## Configuration Properties
Properties common for the configuration of all applications are specified in [configuration.md](configuration.md)

Items marked with (*) are required.\
Items marked with (#) are likely relevant.

- (*)`config`: name of the instance, used when submitting a bug report.

- (*)`password_namespace_attributes`: an array of urns of login-namespace attributes, specifies namespaces where the password can be changed through Perun

- (#)`supported_languages`: array of languages that are supported (for setting application form, sending emails, setting of notification, ...), default is only `en`, currently supported values: `en`, `cs`. If you want to add some new language the GUI team needs to be warned.

- (#)`password_help`: map `namespace: text (allows also use of HTML)`, has to contain at least `default` as a namespace, serves as a hint about what criteria the password have to meet

- (#)`login_namespace_attributes`: array of URNs of `login-namespace` attributes shown in user tables. Default URNs for
namespaces: `einfra`, `einfra-services`, `cesnet`, `mu`.

- (#)`log_out_enabled`: if log out is enabled, this allows users to use the logout button, default: `true`

- (#)`other_apps`: on a first level maps a language (`en`, `cs`, …) to another property. This property defines the labels that are shown in the "more applications" menu as map `other_app: label`, where `other_app` is one of `admin`, `profile`, `pwdReset`, `consolidator`, `linker` (as defined in `AppType`) and the label is the label to be displayed in the menu

- `display_search`: enables the experimental global search feature if true. Relevant policies on backend have to also be set up. Disabled by default.
- `auto_service_access_redirect`: automatically redirects users to `/service-access` to log in, use only when we don’t want users to use OIDC

- `enforce_consents`: boolean indicating if global consent enforcement is enabled. Default: `false`.

- `user_deletion_forced`: boolean, enables user deletion if `true`. Otherwise, default anonymization is used.

- `allow_empty_sponsor_namespace`: type: boolean, if the instance supports empty sponsor namespace

- `member_profile_attributes_friendly_names`: array of attribute friendly names which are displayed in "Personal info" in the member-overview page

- `brandings`: map of specific domain configs, this allows setting multiple brandings+configs on a single instance (e.g. for running on different domains), (key=hostname, value=object of config properties)
  - `<example_domain>`: this property can contain any config properties (even whole new instanceConfig) for each branding

- `group_name_error_message`: type string, a custom error message which is shown when the group name doesn’t match any criteria during a creating new group

- `group_name_secondary_regex`: type string, custom regex for group name when creating new group (furthermore the name cannot start/end with the whitespace - this can't be overwritten)

- `bulk_bug_report_max_items`: type number, maximum number of exceptions to be displayed verbosely in the bulk bug report mail

- `header_label_<language_shortcut>`: string, name of the application

- `export_limit`: type number, maximum number of entities to be exportable in tables
  - default: 1000

### Notification tags
- (*)`notification_tags`: A map of available tags for each type of notification for administrator to use. The keys are
notification types and values are an arrays of allowed tags. The available tags are `appId`, `actor`, `extSource`, `voName`, `groupName`, `mailFooter`, `htmlMailFooter`, `errors`, `customMessage`, `autoApproveError`, `fromApp-itemName`, `firstName`, `lastName`, `displayName`, `mail`, `phone`, `login-namespace`, `membershipExpiration`, `validationLink`, `validationLink-krb`, `validationLink-fed`, `validationLink-cert`, `validationLink-non`, `redirectUrl`, `appGuiUrl`, `appGuiUrl-krb`, `appGuiUrl-fed`, `appGuiUrl-cert`, `appGuiUrl-non`, `appDetailUrl`, `appDetailUrl-krb`, `appDetailUrl-fed`, `appDetailUrl-cert`, `appDetailUrl-newGUI`, `perunGuiUrl`, `perunGuiUrl-krb`, `perunGuiUrl-fed`, `perunGuiUrl-cert`, `perunGuiUrl-newGUI`, `voName`, `groupName`, `displayName`, `mailFooter`, `htmlMailFooter`, `invitationLink`, `invitationLink-krb`, `invitationLink-fed`, `invitationLink-cert`, `invitationLink-non`, `voName`, `groupName`, `displayName`, `mailFooter`, `htmlMailFooter`, `preapprovedInvitationLink`, `expirationDate`, `senderName`.

  - `APP_CREATED_USER`: An array of tags available for created application user notification.
  - `APPROVABLE_GROUP_APP_USER`: An array of tags available for approvable group application user notification.
  - `APP_CREATED_VO_ADMIN`: An array of tags available for created application admin notification.
  - `MAIL_VALIDATION`: An array of tags available for validate mail user notification.
  - `APP_APPROVED_USER`: An array of tags available for approved application user notification.
  - `APP_REJECTED_USER`: An array of tags available for rejected application user notification.
  - `APP_ERROR_VO_ADMIN`: An array of tags available for application error admin notification.
  - `USER_INVITE`: An array of tags available for invite user notification.
  - `USER_PRE_APPROVED_INVITE`: An array of tags available for preapproved invite user notification.

### Styling
- (#)`logo`: SVG image shown on the top left corner of the website.

- (#)`theme`: Color settings for the admin GUI:

  - `sidemenu_text_color`: text color in sidemenu

  - `sidemenu_bg_color`: color of sidemenu

  - `sidemenu_hover_color`: color of highlight when hovering over sidemenu row

  - `sidemenu_active_color`: color of currently active tab in sidemenu

  - `sidemenu_active_text_color`: text color of currently active tab in sidemenu

  - `sidemenu_hover_text_color`: text color of hovered tab in sidemenu

  - `sidemenu_submenu_text_color`: text color of submenu in sidemenu

  - `sidemenu_submenu_bg_color`: background color of submenu in sidemenu

  - `sidemenu_submenu_active_color`: color of item in submenu when active

  - `sidemenu_submenu_hover_color`: color of item in submenu when hovered

  - `sidemenu_submenu_active_text_color`: color of text in submenu on active item

  - `sidemenu_submenu_hover_text_color`: color of text in submenu on hovered item

  - `...`



