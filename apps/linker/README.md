# Configuration

The default config file is located at `linker/src/assets/config/defaultConfig.json`.

To configure an instance please create or modify the instance config file at `linker/src/assets/config/instanceConfig.json`.

## Configuration Properties
Properties common for the configuration of all applications are specified in [configuration.md](configuration.md)

Items marked with (*) are required.\
Items marked with (#) are likely relevant.

- (*)`config`: Name of the instance, used when submitting a bug report.

- `application`: name of the application, don't change it

- `support_mail`: email to user support

### Styling

- (#)`theme`: object, definition of color palette used

  - `user_color`: color of spinners, input field highlights, etc.
