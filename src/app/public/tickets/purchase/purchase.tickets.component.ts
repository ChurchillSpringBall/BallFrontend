import {Component, NgZone, ViewEncapsulation} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UserApi, OrderApi, TicketApi, TicketTypeApi, Order, Ticket, Profile} from '../../../shared/sdk';
import {SweetAlertService} from 'ng2-sweetalert2';

@Component({
  selector: 'purchase-tickets',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './purchase.tickets.component.scss',
  ],
  templateUrl: './purchase.tickets.component.html'
})
export class PurchaseTicketsComponent {
  public typesOfTickets: any = [];
  public isChurchill: boolean = false;
  public paymentMethod: string = 'stripe';
  public charitableDonation: number;

  private sendingPurchaseRequest: boolean = false;
  // TODO: factor out these settings into a static app.config.ts
  private flatFee: number = 0.2;
  private stripeRate: number = 0.014;
  private maxTickets: number = 20;
  private stripeToken: string = 'pk_test_JI4TNsUtPqAwwppcYSeWzzVi';  // pk_test_VzE4g2WQgyIECkn35raV5lwN

  private profile: Profile;

  constructor(private router: Router,
              private swal: SweetAlertService,
              private users: UserApi,
              private orders: OrderApi,
              private tickets: TicketApi,
              private ticketTypes: TicketTypeApi,
              private _ngZone: NgZone) {
  }

  /**
   * Ng Initialisation
   */
  ngOnInit() {
    if (!this.users.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.ticketTypes.find()
      .flatMap(types => { // Get all the ticket types types
        this.typesOfTickets = types;
        // TODO: use a single "ticket types available" endpoint so I don't give away the # of sold tickets?
        // This will send off parallel requests to count the number of each ticket sold
        return Observable.forkJoin(types.map(type => this.tickets.count({ticketTypeId: type.id})));
      })
      .subscribe(counts => { // Populate counts, initialise purchase quantity
        this.typesOfTickets.forEach((type: any, index: number) => {
          type.sold = counts[index].count;
          type.purchaseQuantity = 0;
        });
      });

    // Get the user profile for isChurchill
    this.users.getProfile(this.users.getCurrentId())
      .subscribe(profile => {
        this.profile = profile;
        this.isChurchill = profile.isChurchill;
      });
  }

  /**
   * TODO: refactor and optimise payment total calculation logic
   * @returns {number}
   */
  protected calculateStripeFee(): number {
    return this.flatFee + (this.stripeRate * this.calculateOrderTotal());
  }

  /**
   * Calculate the order total
   * @returns {any}
   */
  protected calculateOrderTotal(): number {
    return this.typesOfTickets.reduce((total, ticket) => (
      total + (ticket.purchaseQuantity * ticket.price)
  ), 0) + (this.charitableDonation ? this.charitableDonation : 0);
  }

  /**
   * Calculate the order total with fees
   * @returns {number}
   */
  protected calculateOrderTotalWithFees(): number {
    return this.calculateOrderTotal() + (this.paymentMethod === 'stripe' ? this.calculateStripeFee() : 0);
  }

  /**
   * Check if the user is able to buy the number of tickets they want
   * @returns {boolean}
   */
  protected checkTicketsAvailable(): boolean {
    return !!this.typesOfTickets.reduce((buying, type) => {
      if (buying === false || buying + type.purchaseQuantity > this.maxTickets || type.purchaseQuantity < 0) {
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
  protected makePayment(): void {
    this.sendingPurchaseRequest = true;
    this.typesOfTickets.forEach((type) => {
      //noinspection JSPrimitiveTypeWrapperUsage
      type.purchaseQuantity = Math.round(type.purchaseQuantity);
    });

    if (this.paymentMethod === 'stripe') { // Handle stripe
      let tokenSuccess = false;
      const stripePayment = (<any>window).StripeCheckout.configure({
        // TODO: set stripe token globally
        key: this.stripeToken,
        locale: 'auto',
        billingAddress: false,
        closed: () => {
          this._ngZone.run(() => {
            if (!tokenSuccess) {
              this.sendingPurchaseRequest = false;
            }
          });
        },
        token: (token: any) => {
          tokenSuccess = true;
          this._ngZone.run(() => {
            this.purchaseTickets.bind(this)(token);
          });
        }
      });

      // Count tickets
      const numberOfTickets = this.typesOfTickets.reduce((total, type) => {
        return total + type.purchaseQuantity;
      }, 0);

      stripePayment.open({
        name: 'Churchill Spring Ball',
        email: this.profile.email,
        allowRememberMe: false,
        description: `${numberOfTickets} Ticket${numberOfTickets > 1 ? 's' : ''}`,
        amount: Math.round(this.calculateOrderTotalWithFees() * 100),
        currency: 'GBP'
      });
    } else if (this.paymentMethod === 'college-account') {
      const formattedPrice = new CurrencyPipe('GB').transform(this.calculateOrderTotalWithFees(), 'GBP', true, '1.2-2');
      this.swal.confirm({
        title: 'Are you sure?',
        text: `You will be billed ${formattedPrice} to your Churchill College Haven Till Account.`,
        showCancelButton: true
      })
        .then(() => {
          this.purchaseTickets(null);
        })
        .catch((error) => {
          if (error !== 'cancel') {
            console.error(error);
            this.swal.error({
              title: 'Error',
              text: 'An error occurred before we could secure your tickets. Please try again.'
            });
          }
          this.sendingPurchaseRequest = false;
        });
    }
  }

  /**
   * Purchase tickets for a user
   * @param token - the stripe token
   */
  protected purchaseTickets(token): void {

    const order = new Order({
      paymentMethod: this.paymentMethod,
      paymentFee: (this.paymentMethod === 'stripe' ? this.calculateStripeFee() : 0),
      total: this.calculateOrderTotalWithFees(),
      paymentToken: token ? token.id : null,
      charitableDonation: this.charitableDonation ? this.charitableDonation : 0,
    });

    // Construct tickets array
    const tickets: Ticket[] = [];
    this.typesOfTickets.forEach(ticket => {
      for (let i = 0; i < ticket.purchaseQuantity; i += 1) {
        tickets.push(new Ticket({
          price: ticket.price,
          ticketTypeId: ticket.id,
        }));
      }
    });

    // Add tickets to order
    order.tickets = tickets;

    // Save to DB, open sweetalert
    // TODO: look into makeOrder `req` bug
    this.orders.makeOrder(order, undefined)
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

        this.sendingPurchaseRequest = false;
      });
  }
}
