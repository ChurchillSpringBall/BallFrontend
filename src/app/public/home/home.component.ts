import {Component, ViewChild, ElementRef} from '@angular/core';
import {Carousel} from '../../shared/jquery/carousel';

@Component({
  selector: 'home',  // <home></home>
  providers: [],
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  @ViewChild('promoCarousel') promoCarousel: ElementRef;

  constructor() {
  }

  ngAfterViewInit() {
    new Carousel(this.promoCarousel.nativeElement);
  }
}
