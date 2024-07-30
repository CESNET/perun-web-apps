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
 * input to inviteToGroupFromCsv
 */
export interface InputInviteToGroupFromCsv {
  /**
   * vo id
   */
  vo: number;
  /**
   * group id
   */
  group: number;
  /**
   * values separated with semicolons
   */
  invitationData: Array<string>;
  /**
   * language
   */
  language: string;
  /**
   * Date in format yyyy-MM-dd
   */
  expiration: string | null;
  /**
   * redirect url
   */
  redirectUrl?: string | null;
}
