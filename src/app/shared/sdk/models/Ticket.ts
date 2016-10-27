/* tslint:disable */

declare var Object: any;
export interface TicketInterface {
  type: string;
  quantity: number;
  Price: number;
  id?: number;
}

export class Ticket implements TicketInterface {
  type: string;
  quantity: number;
  Price: number;
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
