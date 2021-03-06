import {Component, ViewChild, ElementRef, ViewEncapsulation} from '@angular/core';
import {Carousel} from '../../shared/jquery/carousel';
import {TicketTypeApi, TicketType} from '../../shared/sdk';
import {PARTICLES_CONFIG} from './particles.config';

@Component({
  selector: 'home',  // <home></home>
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  @ViewChild('promoCarousel') promoCarousel: ElementRef;
  ticketTypes: TicketType[] = [];

  constructor(private types: TicketTypeApi) {
  }

  ngOnInit() {
    this.types.find()
      .subscribe(types => {
        this.ticketTypes = types;
      }, error => {
        console.error(error);
      });
  }

  ngAfterViewInit() {
    new Carousel(this.promoCarousel.nativeElement);
  }
}
