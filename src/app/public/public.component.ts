import {Component, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {UserApi} from '../shared/sdk';
import {Header} from '../shared/jquery/header';

declare const window: any;

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'container',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './public.component.scss',
  ],
  templateUrl: './public.component.html'
})
export class PublicComponent {
  @ViewChild('navbar') navbar: ElementRef;

  constructor(protected users: UserApi,
              protected router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((path) => {
      // if (path.url != this.url) {
        window.scrollTo(0, 0);
      // }
    });
  }

  ngAfterViewInit() {
    new Header(this.navbar.nativeElement);
  }
}
