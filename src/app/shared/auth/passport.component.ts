import {SDKToken} from '../sdk/models';
import {LoopBackAuth, UserApi, ProfileApi} from '../sdk/services';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {AppState} from '../../app.service';
import {SweetAlertService} from 'ng2-sweetalert2';

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
              private appState: AppState,
              private swal: SweetAlertService) {
  }

  ngOnInit() {
    const sdkToken: SDKToken = new SDKToken();

    sdkToken.id = this.cookies.get('access_token');
    sdkToken.userId = this.cookies.get('userId');

    this.auth.setUser(sdkToken);
    this.auth.setRememberMe(true);
    this.auth.save();

    // TODO: loading wheel
    // TODO: fix issue if user has no profile because they are no longer a cambridge student
    return this.profiles.loadProfile(this.users.getCurrentId())
      .flatMap(() => {
        return this.users.getProfile(this.users.getCurrentId())
      }).subscribe(profile => {
        this.appState.set('profile', profile);

        // TODO: check if user is admin or not, then decide on route
        this.router.navigate(['/tickets']);
      }, error => {
        // TODO: handle no-profile error by letting user enter their email etc?
        console.error(error);
        this.auth.clear();
        this.cookies.removeAll();
        this.appState.set('profile', null);
        this.swal.error({
          title: 'Raven Error',
          text: 'Your Raven account does not have a working email address, please contact the Churchill Spring Ball committee or have a current student purchase a ticket on your behalf.'
        });
      });
  }
}
