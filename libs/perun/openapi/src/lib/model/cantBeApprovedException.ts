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
import { PerunException } from './perunException';

/**
 * thrown by Registrar modules when application shouldn\'t be approved
 */
export interface CantBeApprovedException {
  affiliation?: string | null;
  applicationId?: number;
  category?: string | null;
  reason?: string | null;
  soft?: boolean;
  errorId?: string;
  name?: string;
  message?: string;
}