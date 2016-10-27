import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {UserApi} from '../../shared/sdk';

@Component({
  selector: 'container',
  // encapsulation: ViewEncapsulation.Native,
  styleUrls: [
    './tickets.component.scss',
  ],
  templateUrl: './tickets.component.html'
})
export class TicketsComponent {
  constructor(private users: UserApi,
              private router: Router) {
  }

  ngOnInit() {
    if (!this.users.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }
}
