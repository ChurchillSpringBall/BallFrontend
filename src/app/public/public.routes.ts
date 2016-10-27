import {Routes} from '@angular/router';
import {Public} from './public.component';

import {
  HomeComponent,
  AboutComponent,
} from './index';

export const PUBLIC_ROUTES: Routes = [{
  path: '',
  component: Public,
  children: [
    {path: '', component: HomeComponent},
    {path: 'about', component: AboutComponent},
  ]
}];
