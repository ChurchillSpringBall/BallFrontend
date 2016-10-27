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
export class Public {
  constructor() {}
}
