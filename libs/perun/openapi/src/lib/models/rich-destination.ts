/* tslint:disable */
import { Destination } from './destination';
import { Facility } from './facility';
import { Service } from './service';
export interface RichDestination extends Destination {
  facility?: Facility;
  service?: Service;
}
