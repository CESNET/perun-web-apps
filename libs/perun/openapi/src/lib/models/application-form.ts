/* tslint:disable */
import { Group } from './group';
import { Vo } from './vo';
export interface ApplicationForm  {
  automaticApproval?: boolean;
  automaticApprovalExtension?: boolean;
  group?: Group;
  id?: number;
  moduleClassName?: string;
  vo?: Vo;
}
