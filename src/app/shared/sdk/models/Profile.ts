/* tslint:disable */
import {
  User
} from '../index';

declare var Object: any;
export interface ProfileInterface {
  name?: string;
  crsid?: string;
  institution?: string;
  email?: string;
  isChurchill?: boolean;
  id?: number;
  userId?: number;
  user?: User;
}

export class Profile implements ProfileInterface {
  name: string;
  crsid: string;
  institution: string;
  email: string;
  isChurchill: boolean;
  id: number;
  userId: number;
  user: User;
  constructor(instance?: ProfileInterface) {
    Object.assign(this, instance);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Profile`.
   */
  public static getModelName() {
    return "Profile";
  }
}
