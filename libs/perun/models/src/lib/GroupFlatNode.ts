import { Attribute } from '@perun-web-apps/perun/openapi';

export interface GroupFlatNode {
  expandable: boolean;
  parentGroupId: number;
  name: string;
  level: number;
  id: number;
  voId: number;
  groupAttributes: Attribute[];
  beanName: string;
}
