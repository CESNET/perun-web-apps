import {UserExtSource} from './UserExtSource';

export interface Candidate {
  userExtSource: UserExtSource;
  attributes: Map<string, string>;
  additionalUserExtSource: UserExtSource[];
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  titleBefore: string;
  titleAfter: string;
}
