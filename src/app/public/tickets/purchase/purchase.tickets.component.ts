import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AppState} from '../../../app.service';

@Component({
  selector: 'container',
  styleUrls: [
    './purchase.tickets.component.scss',
  ],
  templateUrl: './purchase.tickets.component.html'
})
export class PurchaseTicketsComponent {
  constructor(private appState: AppState,
              private router: Router) {
  }

  ngOnInit() {
    console.log(this.appState.state);
  }
}
