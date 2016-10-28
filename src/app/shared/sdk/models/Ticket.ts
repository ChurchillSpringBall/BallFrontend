/* tslint:disable */
import {
  Order,
  TicketType
} from '../index';

declare var Object: any;
export interface TicketInterface {
  name?: string;
  email?: string;
  price?: number;
  barCode?: string;
  admittedAt?: any;
  id?: number;
  orderId?: number;
  ticketTypeId?: number;
  order?: Order;
  ticketType?: TicketType;
}

export class Ticket implements TicketInterface {
  name: string;
  email: string;
  price: number;
  barCode: string;
  admittedAt: any;
  id: number;
  orderId: number;
  ticketTypeId: number;
  order: Order;
  ticketType: TicketType;
  constructor(instance?: TicketInterface) {
    Object.assign(this, instance);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Ticket`.
   */
  public static getModelName() {
    return "Ticket";
  }
}
