/* tslint:disable */
import { Auditable } from './auditable';
export interface AttributeDefinition extends Auditable {
  description?: string;
  displayName?: string;
  friendlyName?: string;
  namespace?: string;
  type?: string;
  unique?: boolean;
  writable?: boolean;
}
