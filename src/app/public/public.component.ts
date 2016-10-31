import {Component, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import {UserApi} from '../shared/sdk';
import {Header} from '../shared/jquery/header';

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

  @ViewChild('navbar') navbar: ElementRef;

  constructor(protected users: UserApi) {}

  ngAfterViewInit() {
    new Header(this.navbar.nativeElement);
  }
}
