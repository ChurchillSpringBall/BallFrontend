import {Component, ViewChild, ElementRef} from '@angular/core';
import {Carousel} from '../../shared/jquery/carousel';
import {TicketTypeApi, TicketType} from '../../shared/sdk';
import {PARTICLES_CONFIG} from './particles.config';

declare const particlesJS: any;

@Component({
  selector: 'home',  // <home></home>
  providers: [],
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
