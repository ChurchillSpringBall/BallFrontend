import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {UserApi, OrderApi, TicketTypeApi} from '../../shared/sdk';
import {Observable} from "rxjs";

@Component({
  selector: 'container',
  // encapsulation: ViewEncapsulation.Native,
  styleUrls: [
    './tickets.component.scss',
  ],
  templateUrl: './tickets.component.html'
})
export class TicketsComponent {
  tickets = [];
  types = [];

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
              });
            });

            this.tickets = [].concat.apply([], ticketSets);
          });
      });
  }
}
