/* tslint:disable */
import { Auditable } from './auditable';
import { ExtSource } from './ext-source';
export interface UserExtSource extends Auditable {
  extSource: ExtSource;
  lastAccess?: string;
  loa?: number;
  login: string;
  persistent?: boolean;
  userId?: number;
}
