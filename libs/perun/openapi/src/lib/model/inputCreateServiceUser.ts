/**
 * Perun RPC API
 * Perun Remote Procedure Calls Application Programming Interface
 *
 * The version of the OpenAPI document: 3.20.0
 * Contact: perun@cesnet.cz
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Candidate } from './candidate';
import { User } from './user';


/**
 * input to createServiceUser
 */
export interface InputCreateServiceUser { 
    candidate: Candidate;
    specificUserOwners: Array<User>;
}

