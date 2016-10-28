import {Routes} from '@angular/router';
import {PublicComponent} from './public.component';

import {
  HomeComponent,
  AboutComponent,
  TicketsComponent,
  PurchaseTicketsComponent
} from './index';

export const PUBLIC_ROUTES: Routes = [{
  path: '',
  component: PublicComponent,
  children: [
    {path: '', component: HomeComponent},
    {path: 'about', component: AboutComponent},
    {path: 'tickets', component: TicketsComponent},
    {path: 'tickets/purchase', component: PurchaseTicketsComponent}
  ]
}];
