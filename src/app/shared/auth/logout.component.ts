import {LoopBackAuth} from '../sdk/services';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {UserApi} from '../sdk';
import {CookieService} from 'angular2-cookie/core';
import {AppState} from '../../app.service';

/**
 * Module to load the cookies set by loopback-component-passport into the Angular2 Loopback SDK format...
 */
@Component({
  template: `<span>Logging Out...</span>`
})
export class LogoutComponent {
  constructor(private auth: LoopBackAuth,
              private router: Router,
              private cookies: CookieService,
              private appState: AppState,
              private users: UserApi) {
    this.users.logout()
      .subscribe(() => {
        console.log('Logged out');
        this.auth.clear();
        this.cookies.removeAll();
        this.appState.set('profile', null);  // TODO: removeAll for appState
        this.router.navigate(['/']);
      }, (error) => {
        // TODO: error handling and try again? User tried to log out twice?
        console.error(error);
        this.router.navigate(['/']);
      });
  }
}
