/* tslint:disable */

/**
 * type of destination, i.e. way of delivery of service settings
 */
export enum DestinationType {
  Host = 'host',
  Email = 'email',
  Semail = 'semail',
  Url = 'url',
  UserHost = 'user@host',
  UserHostPort = 'user@host:port',
  ServiceSpecific = 'service-specific',
  UserHostWindows = 'user@host-windows',
  HostWindowsProxy = 'host-windows-proxy'
}
