/* tslint:disable */
import {
  Ticket,
  User
} from '../index';

declare var Object: any;
export interface OrderInterface {
  created?: any;
  paymentMethod: string;
  paymentFee?: number;
  total: number;
  id?: number;
  userId?: number;
  tickets?: Array<Ticket>;
  user?: User;
}

export class Order implements OrderInterface {
  created: any;
  paymentMethod: string;
  paymentFee: number;
  total: number;
  id: number;
  userId: number;
  tickets: Array<Ticket>;
  user: User;
  constructor(instance?: OrderInterface) {
    Object.assign(this, instance);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Order`.
   */
  public static getModelName() {
    return "Order";
  }
}
