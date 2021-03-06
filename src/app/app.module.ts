import {NgModule, ApplicationRef} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

import {removeNgStyles, createNewHosts, createInputTransfer} from '@angularclass/hmr';
import {CookieService} from 'angular2-cookie/core';
import {SweetAlertService} from 'ng2-sweetalert2';

/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from './environment';
import {ROUTES} from './app.routes';
// App is our top level component
import {AppComponent} from './app.component';
import {APP_RESOLVER_PROVIDERS} from './app.resolver';
import {AppState, InternalStateType} from './app.service';
import {NoContentComponent} from './no-content';
import * as PUBLIC_COMPONENTS from './public';
import * as AUTH_COMPONENTS from './shared/auth';
import * as CUSTOM_PIPES from './shared/pipes';
import {SDKModule} from './shared/sdk/index';

// Set the Loopback SDK base url properly
import {LoopBackConfig} from './shared/sdk/lb.config';

import {AgmCoreModule} from 'angular2-google-maps/core';

declare const location: any;
if (typeof location.origin === 'undefined') {
  location.origin = location.protocol + '//' + location.host;
}
LoopBackConfig.setBaseURL(location.origin);

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  CookieService,
  SweetAlertService
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};


/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    NoContentComponent,
    ...Object.keys(PUBLIC_COMPONENTS).map((key) => PUBLIC_COMPONENTS[key]),  // convert object into array for decomposition
    ...Object.keys(AUTH_COMPONENTS).map((key) => AUTH_COMPONENTS[key]),
    ...Object.keys(CUSTOM_PIPES).map((key) => CUSTOM_PIPES[key]),
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, {useHash: true}),
    SDKModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBMPFU7jQ5ebxUO7LVOcef6Y4rLiQwrFiI'  // NOTE: this api key is locked to *.springball.com/*
    })
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {
  }

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}

