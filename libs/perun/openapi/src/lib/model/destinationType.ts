/**
 * Perun RPC API
 * Perun Remote Procedure Calls Application Programming Interface
 *
 * The version of the OpenAPI document: 3.24.0
 * Contact: perun@cesnet.cz
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * type of destination, i.e. way of delivery of service settings
 */
export type DestinationType = 'host' | 'email' | 'semail' | 'url' | 'user@host' | 'user@host:port' | 'service-specific' | 'user@host-windows' | 'host-windows-proxy';

export const DestinationType = {
    Host: 'host' as DestinationType,
    Email: 'email' as DestinationType,
    Semail: 'semail' as DestinationType,
    Url: 'url' as DestinationType,
    Userhost: 'user@host' as DestinationType,
    Userhostport: 'user@host:port' as DestinationType,
    ServiceSpecific: 'service-specific' as DestinationType,
    UserhostWindows: 'user@host-windows' as DestinationType,
    HostWindowsProxy: 'host-windows-proxy' as DestinationType
};

