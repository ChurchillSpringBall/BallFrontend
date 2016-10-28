/* tslint:disable */
import {
  Order,
  Ticket,
  Profile
} from '../index';

declare var Object: any;
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
  tickets?: Array<Ticket>;
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
  tickets: Array<Ticket>;
  profile: Profile;
  identities: Array<any>;
  credentials: Array<any>;
  constructor(instance?: UserInterface) {
    Object.assign(this, instance);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `User`.
   */
  public static getModelName() {
    return "User";
  }
}
