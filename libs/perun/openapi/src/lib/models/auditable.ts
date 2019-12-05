/* tslint:disable */
import { PerunBean } from './perun-bean';
export interface Auditable extends PerunBean {
  createdAt?: string;
  createdBy?: string;
  createdByUid?: number;
  modifiedAt?: string;
  modifiedBy?: string;
  modifiedByUid?: number;
}
