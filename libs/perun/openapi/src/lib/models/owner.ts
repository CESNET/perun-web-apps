/* tslint:disable */
import { Auditable } from './auditable';
export interface Owner extends Auditable {
  contact?: string;
  name?: string;
  type?: 'technical' | 'administrative';
}
