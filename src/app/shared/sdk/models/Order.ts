/* tslint:disable */
import {
  Ticket
} from '../index';

declare var Object: any;
export interface OrderInterface {
  date: any;
  total: number;
  userId: number;
  id?: number;
  tickets?: Array<Ticket>;
}

export class Order implements OrderInterface {
  date: any;
  total: number;
  userId: number;
  id: number;
  tickets: Array<Ticket>;
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
