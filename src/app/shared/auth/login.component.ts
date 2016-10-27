import {SDKToken} from '../sdk/models';
import {LoopBackAuth} from '../sdk/services';
import {Component} from '@angular/core';
import {Router} from '@angular/router';

/**
 * Module to load the cookies set by loopback-component-passport into the Angular2 Loopback SDK format...
 */
@Component({
  template: `<a class="ui primary button" href="/auth/raven">Login with Raven</a>`
})
export class LoginComponent {
  constructor(private auth: LoopBackAuth,
              private router: Router) {
  }
}
