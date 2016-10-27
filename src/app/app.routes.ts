import {Routes, RouterModule} from '@angular/router';
import {PUBLIC_ROUTES} from './public/public.routes';
import {NoContentComponent} from './no-content';
import {AUTH_ROUTES} from './shared/auth/auth.routes';

import {DataResolver} from './app.resolver';


export const ROUTES: Routes = [
  ...AUTH_ROUTES,
  ...PUBLIC_ROUTES
];
