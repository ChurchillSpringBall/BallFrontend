import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {UserApi, OrderApi, TicketTypeApi, TicketApi, Ticket, TicketType} from '../../shared/sdk';
import {Observable} from "rxjs";
import {SweetAlertService} from 'ng2-sweetalert2';

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

  constructor(private users: UserApi,
              private orders: OrderApi,
              private ticketApi: TicketApi,
              private ticketTypes: TicketTypeApi,
              private swal: SweetAlertService,
              private router: Router) {
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
      .filter(ticket => ticket.editing)
      .map(ticket => {
        return {
          id: ticket.id,
          name: ticket.newName,
          email: ticket.newEmail
        };
      });

    this.sendingNameChangeRequest = true;

    Observable.forkJoin(editedTickets.map(ticket => this.ticketApi.nameChange(ticket)))
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
