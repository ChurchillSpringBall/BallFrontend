import {LoopBackAuth} from '../sdk/services';
import {Component} from '@angular/core';
import {Router} from '@angular/router';

/**
 * Module to load the cookies set by loopback-component-passport into the Angular2 Loopback SDK format...
 */
@Component({
  template: `
<div class="bordered login component padded section">
  <div class="ui centered grid container">
    <div class="sixteen wide mobile eight wide tablet six wide computer center aligned column">
      <div class="ui segment">
        <h1 class="title">Log In</h1>
        <p>Note that we only support Raven log in for current members of the university (eg. those with a valid @cam.ac.uk address).</p>
        <a class="ui primary button" href="http://localhost:3001/auth/raven">Login with Raven</a>
      </div>
    </div>
  </div>
</div>
`
})
export class LoginComponent {
  constructor(private auth: LoopBackAuth,
              private router: Router) {
  }
}
