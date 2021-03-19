/**
 * Perun RPC API
 * Perun Remote Procedure Calls Application Programming Interface
 *
 * The version of the OpenAPI document: 3.21.0
 * Contact: perun@cesnet.cz
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PerunBean } from './perunBean';
import { Authorship } from './authorship';
import { Attribute } from './attribute';


export interface Author extends PerunBean { 
    firstName?: string;
    lastName?: string;
    middleName?: string;
    titleBefore?: string;
    titleAfter?: string;
    attributes?: Array<Attribute>;
    authorships?: Array<Authorship>;
}

