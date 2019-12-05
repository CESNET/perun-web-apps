/* tslint:disable */
import { Auditable } from './auditable';
export interface Group extends Auditable {
  description?: string;
  name?: string;
  parentGroupId?: number;
  shortName?: string;
  voId?: number;
}
