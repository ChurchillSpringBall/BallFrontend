import {Observable} from 'rxjs';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AppState} from '../../../app.service';
import {UserApi, OrderApi, TicketApi, TicketTypeApi, Order, Ticket} from '../../../shared/sdk';

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
  paymentMethod = 'stripe';

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
   * TODO: refactor and optimise payment total calculation logic
   * @returns {number}
   */
  protected calculateStripeFee() {
    return 0.2 + 0.018 * this.calculateOrderTotal();
  }

  protected calculateOrderTotal() {
    return this.typesOfTickets.reduce((total, ticket) => {
      return total + (ticket.purchaseQuantity * ticket.price);
    }, 0);
  }

  /**
   * Check if the user is able to buy the number of tickets they want
   * @returns {boolean}
   */
  protected checkTicketsAvailable() {
    return !!this.typesOfTickets.reduce((buying, type) => {
      // TODO: adjust max ticket purchase quantity
      if (buying === false || buying + type.purchaseQuantity > 5 || type.purchaseQuantity < 0) {
        return false;
      } else {
        if (type.sold + type.purchaseQuantity < type.quantity || type.purchaseQuantity === 0) {
          return type.purchaseQuantity + buying;
        } else {
          return false;
        }
      }
    }, 0);
  }

  /**
   * Purchase tickets for a user
   * TODO: stripe payments!
   */
  protected purchaseTickets() {
    const order = new Order({
      paymentMethod: this.paymentMethod,
      paymentFee: (this.paymentMethod === 'stripe' ? this.calculateStripeFee() : 0),
      total: this.calculateOrderTotal(),
      user: this.users.getCurrentId()
    });

    const tickets: Ticket[] = [];
    this.typesOfTickets.forEach(ticket => {
      for (let i = 0; i < ticket.purchaseQuantity; i += 1) {
        tickets.push(new Ticket({
          price: ticket.price,
          ticketTypeId: ticket.id,
        }));
      }
    });

    order.tickets = tickets;

    this.orders.makeOrder(order)
      .subscribe(savedOrder => {
        console.log(savedOrder);
        this.router.navigate(['/tickets']);
      }, error => {
        console.error(error);
      });
  }
}
