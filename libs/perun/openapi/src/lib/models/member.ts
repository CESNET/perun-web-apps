/* tslint:disable */
import { Auditable } from './auditable';
export interface Member extends Auditable {
  groupStatus?: string;
  groupStatuses?: { [key: string]: string };
  membershipType?: string;
  sourceGroupId?: number;
  sponsored?: boolean;
  status?: string;
  suspended?: boolean;
  suspendedTo?: string;
  userId?: number;
  voId?: number;
}
