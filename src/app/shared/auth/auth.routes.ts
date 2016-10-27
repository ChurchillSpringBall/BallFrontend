import {PassportComponent, LoginComponent, LogoutComponent} from './index';

export const AUTH_ROUTES = [
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'passport', component: PassportComponent}
];
