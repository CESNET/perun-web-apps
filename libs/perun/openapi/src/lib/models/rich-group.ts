/* tslint:disable */
import { Attribute } from './attribute';
import { Group } from './group';
export interface RichGroup extends Group {
  attributes?: Array<Attribute>;
}
