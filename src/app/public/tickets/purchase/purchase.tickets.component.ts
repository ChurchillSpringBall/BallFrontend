import {Observable} from 'rxjs';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AppState} from '../../../app.service';
import {UserApi, OrderApi, TicketApi, TicketTypeApi, Order, Ticket} from '../../../shared/sdk';
import {SweetAlertService} from 'ng2-sweetalert2';

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
              private swal: SweetAlertService,
              private users: UserApi,
              private orders: OrderApi,
              private tickets: TicketApi,
              private ticketTypes: TicketTypeApi) {
  }

  ngOnInit() {
    // NOTE: this is a horrible hack to get Stripe.js to stop complaning about Angular2 zone and circular deps
    // See: http://stackoverflow.com/questions/36258252/stripe-json-circular-reference
    // const _stringify = <any>JSON.stringify;
    // JSON.stringify = function (value, ...args) {
    //   if (args.length) {
    //     return _stringify(value, ...args);
    //   } else {
    //     return _stringify(value, function (key, value) {
    //       if (value && key === 'zone' && value['_zoneDelegate']
    //         && value['_zoneDelegate']['zone'] === value) {
    //         return undefined;
    //       }
    //       return value;
    //     });
    //   }
    // };

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
    return 0.2 + 0.014 * this.calculateOrderTotal();
  }

  protected calculateOrderTotal() {
    return this.typesOfTickets.reduce((total, ticket) => {
      return total + (ticket.purchaseQuantity * ticket.price);
    }, 0);
  }

  protected calculateOrderTotalWithFees() {
    return this.calculateOrderTotal() + (this.paymentMethod === 'stripe' ? this.calculateStripeFee() : 0);
  }

  /**
   * Check if the user is able to buy the number of tickets they want
   * @returns {boolean}
   */
  protected checkTicketsAvailable() {
    return !!this.typesOfTickets.reduce((buying, type) => {
      // TODO: adjust max ticket purchase quantity
      if (buying === false || buying + type.purchaseQuantity > 20 || type.purchaseQuantity < 0) {
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
   * Purchase the tickets via Stripe checkout, or if using college account simply create the order
   * TODO: confirmation dialog for college account purchases
   */
  protected makePayment() {
    if (this.paymentMethod === 'stripe') {
      const stripePayment = (<any>window).StripeCheckout.configure({
        key: 'pk_test_pbW1kBm6URlNhqXhiRu7AynG',  // TODO: set stripe token globally
        locale: 'auto',
        billingAddress: false,
        // TODO: fix zone.js wrapping bug causing circular deps with JSON.stringify with this callback
        token: function (token: any) {
          this.purchaseTickets(token);
        }
      });

      const numberOfTickets = this.typesOfTickets.reduce((total, type) => {
        return total + type.purchaseQuantity;
      }, 0);

      stripePayment.open({
        name: 'Churchill Spring Ball',
        description: `${numberOfTickets} Ticket${numberOfTickets > 1 ? 's' : ''}`,
        amount: Math.round(this.calculateOrderTotalWithFees() * 100),
        currency: 'GBP'
      });
    } else if (this.paymentMethod === 'college-account') {
      this.purchaseTickets(null);
    }
  }

  /**
   * Purchase tickets for a user
   * TODO: stripe payments!
   * @param token - the stripe token
   */
  protected purchaseTickets(token) {
    const order = new Order({
      paymentMethod: this.paymentMethod,
      paymentFee: (this.paymentMethod === 'stripe' ? this.calculateStripeFee() : 0),
      total: this.calculateOrderTotalWithFees(),
      paymentToken: token
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

    // TODO: look into makeOrder `req` bug
    this.orders.makeOrder(undefined, order)
      .subscribe(savedOrder => {
        console.log(savedOrder);
        // TODO: emailing
        this.swal.success({
          title: 'Success',
          text: 'You have bought tickets to Churchill Spring Ball!'
        })
          .then(() => {
            this.router.navigate(['/tickets']);
          });
      }, error => {
        console.error(error);
        this.swal.error({
          title: 'Error Purchasing Tickets',
          text: 'Please contact the Spring Ball Committee! Error:' + error.message
        });
      });
  }
}
