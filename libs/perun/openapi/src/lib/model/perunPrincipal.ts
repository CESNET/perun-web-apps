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
import { User } from './user';


export interface PerunPrincipal { 
    actor?: string;
    extSourceName?: string;
    extSourceType?: string;
    extSourceLoa?: number;
    user: User;
    authzInitialized?: boolean;
    additionalInformations?: { [key: string]: string; };
    userId: number;
    roles?: { [key: string]: { [key: string]: Array<number>; }; };
}

