import {AccessToken, SDKToken} from '../sdk/models';
import {LoopBackAuth} from '../sdk/services';
import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';

@Component({
  template: `<span>redirecting...</span>`
})
export class PassportComponent {
  constructor(private auth: LoopBackAuth,
              private route: ActivatedRoute,
              private router: Router,
              private cookies: CookieService) {
    // this.route.params.subscribe((token: AccessToken) => {
    //   if (token.id && token.userId) {
    //     const sdkToken: SDKToken = new SDKToken(token);
    //     this.auth.setUser(sdkToken);
    //     this.auth.setRememberMe(true);
    //     this.auth.save();
    //     this.router.navigate(['/']);
    //   }
    // });
    const sdkToken: SDKToken = new SDKToken();

    sdkToken.id = this.cookies.get('access_token');
    sdkToken.userId = this.cookies.get('userId');

    console.log(sdkToken, this.cookies.get('userId'), this.cookies);

    this.auth.setUser(sdkToken);
    this.auth.setRememberMe(true);
    this.auth.save();
    this.router.navigate(['/']);

  }
}
