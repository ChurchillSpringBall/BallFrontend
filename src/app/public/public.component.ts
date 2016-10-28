import {Component, ViewEncapsulation} from '@angular/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'container',
  encapsulation: ViewEncapsulation.Native,
  styleUrls: [
    './public.component.scss',
  ],
  templateUrl: './public.component.html'
})
export class PublicComponent {
  constructor() {}

  // TODO: show customer's name in the nav
}
