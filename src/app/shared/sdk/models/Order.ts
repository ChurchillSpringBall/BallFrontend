/* tslint:disable */
import {
  Ticket,
  User
} from '../index';

export interface OrderInterface {
  created?: any;
  paymentMethod: string;
  paymentFee?: number;
  paymentToken?: string;
  total: number;
  id?: number;
  userId?: number;
  tickets?: Array<Ticket>;
  user?: User;
}

export class Order implements OrderInterface {
  created?: any;
  paymentMethod: string;
  paymentFee?: number;
  paymentToken?: string;
  total: number;
  id?: number;
  userId?: number;
  tickets?: Array<Ticket>;
  user?: User;
  constructor(instance?: Order) {
    Object.assign(this, instance);
  }
}
