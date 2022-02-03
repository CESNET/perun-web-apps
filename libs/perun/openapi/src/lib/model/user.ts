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
import { Auditable } from './auditable';

export interface User extends Auditable {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  titleBefore?: string;
  titleAfter?: string;
  serviceUser?: boolean;
  sponsoredUser?: boolean;
  uuid?: string;
  specificUser?: boolean;
  majorSpecificType?: string;
}
