import {SDKToken} from '../sdk/models';
import {LoopBackAuth} from '../sdk/services';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';

/**
 * Module to load the cookies set by loopback-component-passport into the Angular2 Loopback SDK format...
 */
@Component({
  template: `<span>Redirecting...</span>`
})
export class PassportComponent {
  constructor(private auth: LoopBackAuth,
              private router: Router,
              private cookies: CookieService) {
    const sdkToken: SDKToken = new SDKToken();

    sdkToken.id = this.cookies.get('access_token');
    sdkToken.userId = this.cookies.get('userId');

    this.auth.setUser(sdkToken);
    this.auth.setRememberMe(true);
    this.auth.save();

    // TODO: check if user is admin or not, then decide on route
    this.router.navigate(['/tickets']);
  }
}
