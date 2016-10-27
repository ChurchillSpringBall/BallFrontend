/* tslint:disable */

declare var Object: any;
export interface TicketInterface {
  ticketTypeId: number;
  name?: string;
  email?: string;
  price?: string;
  barCode?: string;
  orderId?: number;
  admittedAt?: any;
  id?: number;
}

export class Ticket implements TicketInterface {
  ticketTypeId: number;
  name: string;
  email: string;
  price: string;
  barCode: string;
  orderId: number;
  admittedAt: any;
  id: number;
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
