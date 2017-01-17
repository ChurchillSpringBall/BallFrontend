/* tslint:disable */
import {
  Ticket
} from '../index';

export interface TicketTypeInterface {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  id?: number;
  tickets?: Array<Ticket>;
}

export class TicketType implements TicketTypeInterface {
  name: string;
  description: string;
  price: number;
  quantity: number;
  id: number;
  tickets: Array<Ticket>;
  constructor(instance?: TicketType) {
    Object.assign(this, instance);
  }
}
