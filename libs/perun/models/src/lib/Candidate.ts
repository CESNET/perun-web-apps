import {UserExtSource} from './UserExtSource';
import { User } from '@perun-web-apps/perun/models';

export interface Candidate extends User{
  userExtSource: UserExtSource;
  attributes: Map<string, string>;
  additionalUserExtSource: UserExtSource[];
}
