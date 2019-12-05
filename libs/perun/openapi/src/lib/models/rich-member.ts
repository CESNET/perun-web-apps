/* tslint:disable */
import { Attribute } from './attribute';
import { Member } from './member';
import { User } from './user';
import { UserExtSource } from './user-ext-source';
export interface RichMember extends Member {
  memberAttributes?: Array<Attribute>;
  user: User;
  userAttributes?: Array<Attribute>;
  userExtSources: Array<UserExtSource>;
}
