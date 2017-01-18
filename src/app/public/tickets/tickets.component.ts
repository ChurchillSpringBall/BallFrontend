import {Component, NgZone, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {UserApi, OrderApi, TicketTypeApi, TicketApi, Ticket, TicketType, Profile} from '../../shared/sdk';
import {Observable} from "rxjs";
import {SweetAlertService} from 'ng2-sweetalert2';
import {Order} from "../../shared/sdk/models/Order";

@Component({
  selector: 'tickets',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './tickets.component.scss',
  ],
  templateUrl: './tickets.component.html'
})
export class TicketsComponent {
  tickets: any[] = [];
  types: any[] = [];
  ticketTypesObject: {[key: number]: any} = {};
  editCount: number = 0;
  nameChange: boolean = false;
  sendingNameChangeRequest = false;
  stripeToken: string = 'pk_test_JI4TNsUtPqAwwppcYSeWzzVi'; //pk_live_C2R23weSkgmJYF1ZDsCbIXHk';  // pk_test_VzE4g2WQgyIECkn35raV5lwN
  profile: Profile;

  constructor(private users: UserApi,
              private orders: OrderApi,
              private ticketApi: TicketApi,
              private ticketTypes: TicketTypeApi,
              private swal: SweetAlertService,
              private router: Router,
              private _ngZone: NgZone) {
  }

  ngOnInit() {
    if (!this.users.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.tickets = [];
    this.types = [];
    this.ticketTypesObject = {};
    this.editCount = 0;
    this.nameChange = false;
    this.sendingNameChangeRequest = false;

    this.users.getProfile(this.users.getCurrentId())
      .subscribe(profile => {
        this.profile = profile;
      });

    let orderCache = null;
    this.users.getOrders(this.users.getCurrentId())
      .flatMap(orders => {
        orderCache = orders;
        return Observable.forkJoin(orders.map(order => this.orders.getTickets(order.id)));
      })
      .subscribe((ticketSets: any[][]) => {
        this.ticketTypes.find()
          .subscribe((types: any[]) => {
            this.types = types;

            types.forEach(type => {
              this.ticketTypesObject[type.id] = type;
              type.count = 0;
            });

            // bundle the order detail into each ticket so we can display it on the frontend
            ticketSets.forEach((ticketSet, index) => {
              ticketSet.forEach(ticket => {
                ticket.order = orderCache[index];
                ticket.type = this.ticketTypesObject[ticket.ticketTypeId];
                ticket.type.count += 1;
                ticket.editing = false;
                ticket.dimmed = false;
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
  protected toggleTicket(ticket: any): void {
    ticket.editing = !ticket.editing;

    if (ticket.editing) {
      this.editCount += 1;
      ticket.newName = ticket.name;
      ticket.newEmail = ticket.email;
    } else {
      this.editCount -= 1;
    }

    this.nameChange = (this.editCount > 0);
  }

  /**
   * Save the name changes to the backend
   */
  // TODO: Revert to original ticket state (just fetch them again if you want)
  protected saveNameChange(): void {
    const editedTickets = this.tickets
      .filter(ticket => ticket.editing && (
        ticket.newName.localeCompare(ticket.name) !== 0 ||
        ticket.newEmail.localeCompare(ticket.email) !== 0
      ));

    // If nothing actually changed then reset the UI and return
    if (editedTickets.length === 0) {
      this.ngOnInit();
      return;
    }

    const ticketsWithFeeDue = editedTickets
      .filter(ticket => ticket.name !== null && ticket.name !== "" &&
                        ticket.email !== null && ticket.email !== "")
      .map(ticket => {
        return {
          id: ticket.id,
          name: ticket.newName,
          email: ticket.newEmail
        };
      });

    const ticketsWithFreeNameChange = editedTickets
      .filter(ticket => ticket.name === null || ticket.name === "" ||
                        ticket.email === null || ticket.email === "")
      .map(ticket => {
        return {
          id: ticket.id,
          name: ticket.newName,
          email: ticket.newEmail
        };
      });

    this.sendingNameChangeRequest = true;

    // If there are no free ones, do the paid ones
    if (ticketsWithFreeNameChange.length === 0) {
      this.processNameChangesWithFees(ticketsWithFeeDue);
    } else {
      // Else do the free ones first, then do the payment request
      Observable.forkJoin(ticketsWithFreeNameChange.map(ticket => this.ticketApi.nameChange(ticket)))
        .subscribe(tickets => {
          if (ticketsWithFeeDue.length === 0) {
            this.swal.success({
              title: 'Success',
              text: 'We\'ve updated the names on your tickets!'
            });

            this.ngOnInit();

            return;
          }
          console.log('test');
          this.processNameChangesWithFees(ticketsWithFeeDue);
        }, error => {
          console.error(error);

          this.swal.error({
            title: 'Error',
            text: 'We could not save the names on your tickets. Please try again or contact the Churchill Spring Ball Committee.'
          });

          this.ngOnInit();
        });
      }
  }

  protected createNameChangeOrder(totalFee:number, ticketsWithFeeDue: any, token:any):void {

    const order = new Order({
      paymentMethod: 'stripe',
      paymentFee: 0, // TODO ask if we need this fee here
      total: totalFee,
      paymentToken: token.id,
    });
    this.orders.processNameChangeFee(order, undefined)
      .subscribe(savedOrder => {
        console.log(savedOrder);
        Observable.forkJoin(ticketsWithFeeDue.map(ticket => this.ticketApi.nameChange(ticket)))
          .subscribe(tickets => {
            console.log(tickets);
            this.swal.success({
              title: 'Success',
              text: 'We\'ve updated the names on your tickets!'
            });
            this.ngOnInit();
          }, error => {
            console.error(error);

            this.swal.error({
              title: 'Error',
              text: 'We could not save the names on your tickets. Please try again or contact the Churchill Spring Ball Committee.'
            });

            this.ngOnInit();
          });
      }, error => {
        console.error(error);

        this.swal.error({
          title: 'Error Changing Ticket Name',
          text: 'Please contact the Spring Ball Committee! Error:' + error.message
        });
        return;
      });
  }

  protected processNameChangesWithFees(ticketsWithFeeDue: any): void {
    let nameChangeFeePerTicket = 10;
    let totalFee = ticketsWithFeeDue.length * nameChangeFeePerTicket;

    this.swal.question({
      title: 'Name Change Fee',
      text: 'The deadline for free name changes has passed. Name changes are now charged at £10/ticket. To proceed you must pay a £' + totalFee + ' fee.',
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Proceed",
      cancelButtonText: "Cancel"
    }).then(() => {
      let tokenSuccess = false;
      const stripePayment = (<any>window).StripeCheckout.configure({
        // TODO: set stripe token globally
        key: this.stripeToken,
        locale: 'auto',
        billingAddress: false,
        closed: () => {
          this._ngZone.run(() => {
            if (!tokenSuccess) {
              this.ngOnInit();
            }
          });
        },
        token: (token: any) => {
          tokenSuccess = true;
          this._ngZone.run(() => {
            this.createNameChangeOrder(totalFee, ticketsWithFeeDue, token);
          });
        }
      });
      stripePayment.open({
        name: 'Churchill Spring Ball',
        email: this.profile.email,
        allowRememberMe: false,
        description: `Name change for ${ticketsWithFeeDue.length} Ticket${ticketsWithFeeDue.length > 1 ? 's' : ''}`,
        amount: totalFee * 100,
        currency: 'GBP'
      });
    }, () => {
      // cancelled
      this.ngOnInit();
    });
  }

  /**
   * Check that all of the name change tickets have their email and name filled out
   * @returns {any|boolean}
   */
  protected nameChangeValid(): boolean {
    return this.tickets
      .filter(ticket => ticket.editing)
      .reduce((valid, ticket) => valid && (ticket.newName && ticket.newEmail), true);
  }

  protected mouseHover(ticket: any): void {
    ticket.dimmed = true;
  }

  protected mouseLeave(ticket: any): void {
    if (!ticket.editing) {
      ticket.dimmed = false;
    }
  }
}
