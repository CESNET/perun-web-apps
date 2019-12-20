/* tslint:disable */
import { Auditable } from './auditable';
import { DestinationPropagationType } from './destination-propagation-type';
import { DestinationType } from './destination-type';
export interface Destination extends Auditable {
  destination?: string;
  propagationType?: DestinationPropagationType;
  type?: DestinationType;
}
