import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {UserApi, OrderApi, TicketTypeApi, Ticket, TicketType} from '../../shared/sdk';
import {Observable} from "rxjs";
import {SweetAlertService} from 'ng2-sweetalert2';

@Component({
  selector: 'container',
  styleUrls: [
    './tickets.component.scss',
  ],
  templateUrl: './tickets.component.html'
})
export class TicketsComponent {
  tickets:Ticket[] = [];
  types:TicketType[] = [];
  editCount:number = 0;
  nameChange:boolean = false;

  constructor(private users: UserApi,
              private orders: OrderApi,
              private ticketTypes: TicketTypeApi,
              private router: Router) {
  }

  ngOnInit() {
    if (!this.users.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    let orderCache = null;
    this.users.getOrders(this.users.getCurrentId())
      .flatMap(orders => {
        orderCache = orders;
        return Observable.forkJoin(orders.map(order => this.orders.getTickets(order.id)));
      })
      .subscribe((ticketSets: any[][]) => {
        this.ticketTypes.find()
          .subscribe(types => {
            const ticketTypes = {};
            types.forEach(type => {
              ticketTypes[type.id] = type;
            });

            // bundle the order detail into each ticket so we can display it on the frontend
            ticketSets.forEach((ticketSet, index) => {
              ticketSet.forEach(ticket => {
                ticket.order = orderCache[index];
                ticket.type = ticketTypes[ticket.ticketTypeId];
                ticket.editing = false;
              });
            });

            this.tickets = [].concat.apply([], ticketSets);
          });
      });
  }

  /**
   * Handle the toggling of tickets for editing
   * @param ticket
   */
  protected toggleTicket(ticket:Ticket):void {
    ticket.editing = !ticket.editing;
    this.editCount = ticket.editing ? this.editCount+1 : this.editCount-1;
    this.nameChange = (this.editCount > 0);
  }

  /**
   * Save the name changes to the backend
   */
  protected saveNameChange():void {
    console.log(this.tickets);
  }
}
