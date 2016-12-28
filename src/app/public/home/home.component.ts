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

  committee: any[] = [
    {
      name: 'Shauna Gulrajani',
      title: 'PRESIDENT',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Max Edwards',
      title: 'PRESIDENT',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Kyle Da-Cunha',
      title: 'SECRETARY',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Thomas Upton',
      title: 'TREASURER',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Madeleine Jones Casey',
      title: 'PUBLICITY',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Karen Young',
      title: 'GRAPHIC DESIGN',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Hyun Ji Oh',
      title: 'PERSONNEL',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Laura Gimeno',
      title: 'TICKETING',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Nick Reyner',
      title: 'LIGHT AND SOUND',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Charlotte Jones',
      title: 'FOOD AND DRINKS',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Tom Weatherby',
      title: 'FOOD AND DRINKS',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Patrick Hutchinson',
      title: 'FOOD AND DRINKS',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Anna Bennett',
      title: 'ENTS',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Anirud Gupta',
      title: 'ENTS',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Imogen Muir',
      title: 'ENTS',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Daphne Argyrou',
      title: 'ARTS AND DECORATIONS',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Daphne Argyrou',
      title: 'ARTS AND DECORATIONS',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Chiara Haefliger-Piccinini',
      title: 'ARTS AND DECORATIONS',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Max Wolffe',
      title: 'ARTS AND DECORATIONS',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Eric Tay Jing Long',
      title: 'ARTS AND DECORATIONS',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Anna Kerekgyarto',
      title: 'ARTS AND DECORATIONS',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Kishan Patel',
      title: 'HEALTH AND SAFETY/SECURITY',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Neil Kraewinkels',
      title: 'HEALTH AND SAFETY/SECURITY',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Matthew Han',
      title: 'HEALTH AND SAFETY/SECURITY',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Liam Gray',
      title: 'WEBMASTER',
      image: '/assets/img/committee/user.png'
    },
    {
      name: 'Nick Rogers',
      title: 'WEBMASTER',
      image: '/assets/img/committee/user.png'
    }
  ];

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
