/* tslint:disable */
import {
  Order,
  Profile
} from '../index';

export interface UserInterface {
  realm?: string;
  username?: string;
  password: string;
  email: string;
  emailVerified?: boolean;
  verificationToken?: string;
  id?: number;
  accessTokens?: Array<any>;
  orders?: Array<Order>;
  profile?: Profile;
  identities?: Array<any>;
  credentials?: Array<any>;
}

export class User implements UserInterface {
  realm: string;
  username: string;
  password: string;
  email: string;
  emailVerified: boolean;
  verificationToken: string;
  id: number;
  accessTokens: Array<any>;
  orders: Array<Order>;
  profile: Profile;
  identities: Array<any>;
  credentials: Array<any>;
  constructor(instance?: User) {
    Object.assign(this, instance);
  }
}
