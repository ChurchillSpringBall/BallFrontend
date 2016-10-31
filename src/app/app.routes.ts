import {Routes, RouterModule} from '@angular/router';
import {PUBLIC_ROUTES} from './public/public.routes';
import {NoContentComponent} from './no-content';

import {DataResolver} from './app.resolver';


export const ROUTES: Routes = [
  ...PUBLIC_ROUTES
];
