/* tslint:disable */
import { Facility } from './facility';
import { Owner } from './owner';
export interface RichFacility extends Facility {
  facilityOwners: Array<Owner>;
}
