/* tslint:disable */
import { Auditable } from './auditable';
export interface Resource extends Auditable {
  description?: string;
  facilityId?: number;
  name?: string;
  voId?: number;
}
