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
import { PerunBean } from './perunBean';

/**
 * input to setRoleWithUserComplementaryObjects
 */
export interface SetRoleWithUserComplementaryObjects {
  role: string;
  /**
   * user id
   */
  user: number;
  /**
   * List of complementary objects (supported objects: Group | RichGroup | Vo | Resource | Facility)
   */
  complementaryObjects?: Array<PerunBean>;
}
