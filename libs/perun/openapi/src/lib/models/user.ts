/* tslint:disable */
import { Auditable } from './auditable';
export interface User extends Auditable {
  firstName?: string;
  lastName?: string;
  majorSpecificType?: string;
  middleName?: string;
  serviceUser?: boolean;
  specificUser?: boolean;
  sponsoredUser?: boolean;
  titleAfter?: string;
  titleBefore?: string;
}
