/* tslint:disable */
import { Attribute } from './attribute';
import { User } from './user';
import { UserExtSource } from './user-ext-source';
export interface RichUser extends User {
  userAttributes: Array<Attribute>;
  userExtSources: Array<UserExtSource>;
}
