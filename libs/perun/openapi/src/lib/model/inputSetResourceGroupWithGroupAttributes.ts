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
import { Attribute } from './attribute';

/**
 * input to setResourceGroupWithGroupAttributes
 */
export interface InputSetResourceGroupWithGroupAttributes {
  /**
   * resource id
   */
  resource: number;
  /**
   * group id
   */
  group: number;
  attributes: Array<Attribute>;
  workWithGroupAttributes: boolean;
}
