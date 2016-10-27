import {Component} from '@angular/core';

import {UserApi} from '../../shared/sdk';

@Component({
  selector: 'home',  // <home></home>
  providers: [],
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(public users: UserApi) {
  }

  ngOnInit() {
    this.users.ldapLookup('lng25')
      .subscribe(console.log.bind(console), console.error.bind(console));
  }
}
