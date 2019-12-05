/* tslint:disable */
import { Facility } from './facility';
import { Resource } from './resource';
import { ResourceTag } from './resource-tag';
import { Vo } from './vo';
export interface RichResource extends Resource {
  facility?: Facility;
  resourceTags?: Array<ResourceTag>;
  vo?: Vo;
}
