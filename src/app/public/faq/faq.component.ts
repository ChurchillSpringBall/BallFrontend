import {Component, ViewEncapsulation} from '@angular/core';
import {TicketTypeApi, TicketType} from '../../shared/sdk';

@Component({
  selector: 'faq',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./faq.component.scss'],
  templateUrl: './faq.component.html'
})
export class FAQComponent {
  protected ticketTypes: TicketType[] = [];

  constructor(private ticketTypeApi: TicketTypeApi) {
  }

  ngOnInit() {
    this.ticketTypeApi.find()
      .subscribe(types => {
        this.ticketTypes = types;
      });
  }
}
