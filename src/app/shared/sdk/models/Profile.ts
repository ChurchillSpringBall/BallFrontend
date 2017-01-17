/* tslint:disable */
import {
  User
} from '../index';

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
  constructor(instance?: Profile) {
    Object.assign(this, instance);
  }
}
