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
import { RichUser } from './richUser';

export interface PaginatedRichUsers {
  offset: number;
  pageSize: number;
  totalCount: number;
  data: Array<RichUser>;
}
