import {Component, ViewEncapsulation} from '@angular/core';
import {UserApi} from '../shared/sdk';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'container',
  styleUrls: [
    './public.component.scss',
  ],
  templateUrl: './public.component.html'
})
export class PublicComponent {
  constructor(protected users: UserApi) {}

  // TODO: show customer's name in the nav
}
