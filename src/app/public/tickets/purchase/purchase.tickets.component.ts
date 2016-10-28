import {Observable} from 'rxjs';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AppState} from '../../../app.service';
import {UserApi, OrderApi, TicketApi, TicketTypeApi} from '../../../shared/sdk';

@Component({
  selector: 'container',
  styleUrls: [
    './purchase.tickets.component.scss',
  ],
  templateUrl: './purchase.tickets.component.html'
})
export class PurchaseTicketsComponent {
  typesOfTickets = [];
  isChurchill = false;
  paymentMethod = 'college-account';

  constructor(private appState: AppState,
              private router: Router,
              private users: UserApi,
              private orders: OrderApi,
              private tickets: TicketApi,
              private ticketTypes: TicketTypeApi) {
  }

  ngOnInit() {
    this.ticketTypes.find()
      .flatMap(types => {
        this.typesOfTickets = types;
        // TODO: use a single "ticket types available" endpoint so I don't give away the # of sold tickets?
        // this will send off parallel requests to count the number of each ticket sold
        return Observable.forkJoin(types.map(type => this.tickets.count({where: {ticketTypeId: type.id}})));
      })
      .subscribe(counts => {
        this.typesOfTickets.forEach((type, index) => {
          type.sold = counts[index].count;
          type.purchaseQuantity = 0;
        });
      });

    this.users.getProfile(this.users.getCurrentId())
      .subscribe(profile => {
        this.isChurchill = profile.isChurchill;
      });
  }

  /**
   * Check if the user is able to buy the number of tickets they want
   * @returns {boolean}
   */
  protected checkTicketsAvailable() {
    return !!this.typesOfTickets.reduce((buying, type) => {
      if (buying === false || buying + type.purchaseQuantity > 5) {  // TODO: adjust max ticket purchase quantity
        return false;
      } else {
        if (type.sold + type.purchaseQuantity < type.quantity) {
          return type.purchaseQuantity + buying;
        } else {
          return false;
        }
      }
    }, 0);
  }
}
