/* tslint:disable */
import {
  Ticket
} from '../index';

declare var Object: any;
export interface TicketTypeInterface {
  name?: string;
  price?: number;
  quantity?: number;
  id?: number;
  tickets?: Array<Ticket>;
}

export class TicketType implements TicketTypeInterface {
  name: string;
  price: number;
  quantity: number;
  id: number;
  tickets: Array<Ticket>;
  constructor(instance?: TicketTypeInterface) {
    Object.assign(this, instance);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `TicketType`.
   */
  public static getModelName() {
    return "TicketType";
  }
}
