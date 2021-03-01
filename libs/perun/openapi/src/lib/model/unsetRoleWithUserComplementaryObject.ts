/**
 * Perun RPC API
 * Perun Remote Procedure Calls Application Programming Interface
 *
 * The version of the OpenAPI document: 3.19.0
 * Contact: perun@cesnet.cz
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PerunBean } from './perunBean';


/**
 * input to unsetRoleWithUserComplementaryObject
 */
export interface UnsetRoleWithUserComplementaryObject { 
    role: string;
    /**
     * List of user ids
     */
    users: Array<number>;
    complementaryObject?: PerunBean;
}

