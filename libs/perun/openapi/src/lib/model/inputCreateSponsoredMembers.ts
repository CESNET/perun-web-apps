/**
 * Perun RPC API
 * Perun Remote Procedure Calls Application Programming Interface
 *
 * The version of the OpenAPI document: 0.0.0
 * Contact: perun@cesnet.cz
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * input for createSponsoredMembers
 */
export interface InputCreateSponsoredMembers {
  /**
   * names of members to create, single name should have the format {firstName};{lastName} to be parsed well
   */
  guestNames: Array<string>;
  vo: number;
  sponsor: number;
  namespace: string;
  validityTo?: string;
  email?: string;
  sendActivationLink?: boolean;
}