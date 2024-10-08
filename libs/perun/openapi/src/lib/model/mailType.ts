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

export type MailType =
  | 'APP_CREATED_USER'
  | 'APPROVABLE_GROUP_APP_USER'
  | 'APP_CREATED_VO_ADMIN'
  | 'MAIL_VALIDATION'
  | 'APP_APPROVED_USER'
  | 'APP_REJECTED_USER'
  | 'APP_ERROR_VO_ADMIN'
  | 'USER_INVITE'
  | 'USER_PRE_APPROVED_INVITE';

export const MailType = {
  APP_CREATED_USER: 'APP_CREATED_USER' as MailType,
  APPROVABLE_GROUP_APP_USER: 'APPROVABLE_GROUP_APP_USER' as MailType,
  APP_CREATED_VO_ADMIN: 'APP_CREATED_VO_ADMIN' as MailType,
  MAIL_VALIDATION: 'MAIL_VALIDATION' as MailType,
  APP_APPROVED_USER: 'APP_APPROVED_USER' as MailType,
  APP_REJECTED_USER: 'APP_REJECTED_USER' as MailType,
  APP_ERROR_VO_ADMIN: 'APP_ERROR_VO_ADMIN' as MailType,
  USER_INVITE: 'USER_INVITE' as MailType,
  USER_PRE_APPROVED_INVITE: 'USER_PRE_APPROVED_INVITE' as MailType,
};
