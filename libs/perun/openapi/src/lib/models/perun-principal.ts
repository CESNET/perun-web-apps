/* tslint:disable */
import { User } from './user';
export interface PerunPrincipal  {
  actor?: string;
  additionalInformations?: { [key: string]: string };
  authzInitialized?: boolean;
  extSourceLoa?: number;
  extSourceName?: string;
  extSourceType?: string;
  roles?: { [key: string]: { [key: string]: Array<number> } };
  user: User;
  userId: number;
}
