import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {UserApi} from '../../../shared/sdk';

@Component({
  selector: 'container',
  styleUrls: [
    './purchase.tickets.component.scss',
  ],
  templateUrl: './purchase.tickets.component.html'
})
export class PurchaseTicketsComponent {
  constructor(private users: UserApi,
              private router: Router) {
  }

  ngOnInit() {
    this.users.isChurchill('lng25')
      .subscribe(isChurchill => {
        console.log(isChurchill);
      }, error => {
        console.error(error);
        // TODO: error handling!
      })
  }
}
