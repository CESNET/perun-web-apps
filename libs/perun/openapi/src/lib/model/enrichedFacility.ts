/**
 * Perun RPC API
 * Perun Remote Procedure Calls Application Programming Interface
 *
 * The version of the OpenAPI document: 3.25.0
 * Contact: perun@cesnet.cz
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Destination } from './destination';
import { Owner } from './owner';
import { Host } from './host';
import { Facility } from './facility';


export interface EnrichedFacility { 
    facility?: Facility;
    owners?: Array<Owner>;
    destinations?: Array<Destination>;
    hosts?: Array<Host>;
}

