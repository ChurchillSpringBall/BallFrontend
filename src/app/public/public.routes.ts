import {Routes} from '@angular/router';
import {PublicComponent} from './public.component';
import {AUTH_ROUTES} from '../shared/auth/auth.routes';

import {
  EntsComponent,
  FAQComponent,
  HomeComponent,
  TermsComponent,
  TicketsComponent,
  PurchaseTicketsComponent,
  WorkComponent
} from './index';

export const PUBLIC_ROUTES: Routes = [{
  path: '',
  component: PublicComponent,
  children: [
    {path: '', component: HomeComponent},
    {path: 'ents', component: EntsComponent},
    {path: 'faq', component: FAQComponent},
    {path: 'terms', component: TermsComponent},
    {path: 'work', component: WorkComponent},
    {path: 'tickets', component: TicketsComponent},
    {path: 'tickets/purchase', component: PurchaseTicketsComponent},
    ...AUTH_ROUTES
  ]
}];
