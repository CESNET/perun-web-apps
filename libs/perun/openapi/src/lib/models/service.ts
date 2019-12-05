/* tslint:disable */
import { Auditable } from './auditable';
export interface Service extends Auditable {
  delay?: number;
  description?: string;
  enabled?: boolean;
  name?: string;
  recurrence?: number;
  script?: string;
}
