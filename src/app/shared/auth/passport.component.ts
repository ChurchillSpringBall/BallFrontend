import {SDKToken} from '../sdk/models';
import {LoopBackAuth, UserApi, ProfileApi} from '../sdk/services';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {AppState} from '../../app.service';

/**
 * Module to load the cookies set by loopback-component-passport into the Angular2 Loopback SDK format...
 */
@Component({
  template: `<span>Redirecting...</span>`
})
export class PassportComponent {
  constructor(private auth: LoopBackAuth,
              private router: Router,
              private cookies: CookieService,
              private users: UserApi,
              private profiles: ProfileApi,
              private appState: AppState) {
  }

  ngOnInit() {
    const sdkToken: SDKToken = new SDKToken();

    sdkToken.id = this.cookies.get('access_token');
    sdkToken.userId = this.cookies.get('userId');

    this.auth.setUser(sdkToken);
    this.auth.setRememberMe(true);
    this.auth.save();

    // TODO: loading wheel
    return this.profiles.loadProfile(this.users.getCurrentId())
      .flatMap(() => {
        return this.users.getProfile(this.users.getCurrentId())
      }).subscribe(profile => {
        this.appState.set('profile', profile);

        // TODO: check if user is admin or not, then decide on route
        this.router.navigate(['/tickets']);
      }, error => {
        console.error(error);
        // TODO: handle error
      });
  }
}
