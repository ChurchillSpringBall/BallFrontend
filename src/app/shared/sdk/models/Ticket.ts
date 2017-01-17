/* tslint:disable */
import {
  Order,
  TicketType
} from '../index';

export interface TicketInterface {
  name?: string;
  email?: string;
  price?: number;
  barCode?: string;
  admittedAt?: any;
  collectedAt?: any;
  id?: number;
  orderId?: number;
  ticketTypeId?: number;
  order?: Order;
  ticketType?: TicketType;
}

export class Ticket implements TicketInterface {
  name?: string;
  email?: string;
  price?: number;
  barCode?: string;
  admittedAt?: any;
  collectedAt?: any;
  id?: number;
  orderId?: number;
  ticketTypeId?: number;
  order?: Order;
  ticketType?: TicketType;
  constructor(instance?: Ticket) {
    Object.assign(this, instance);
  }
}
