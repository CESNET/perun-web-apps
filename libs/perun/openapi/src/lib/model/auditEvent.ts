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
import { Group } from './group';
import { User } from './user';
import { UserExtSource } from './userExtSource';
import { Resource } from './resource';
import { AttributeDefinition } from './attributeDefinition';
import { Service } from './service';
import { Vo } from './vo';
import { ExtSource } from './extSource';
import { Facility } from './facility';
import { Member } from './member';


export interface AuditEvent { 
    attribute?: AttributeDefinition;
    extSource?: ExtSource;
    source?: ExtSource;
    facility?: Facility;
    group?: Group;
    parentGroup?: Group;
    member?: Member;
    resource?: Resource;
    service?: Service;
    user?: User;
    userExtSource?: UserExtSource;
    vo?: Vo;
    name?: string;
    message?: string;
}

