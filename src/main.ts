import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Keycloak from 'keycloak-js';

if (environment.production) {
  enableProdMode();
}

const MIN_VALIDITY = 70;
const REFRESH_TIMEOUT = 60000;

let keycloak = Keycloak({url: 'http://localhost:8081/auth', realm: 'test', clientId: 'demo'});
window['_keycloak'] = keycloak;

window['_keycloak'].init(
  {onLoad: 'login-required'}
)
  .success(function (authenticated) {
    localStorage.setItem('jwt_token', keycloak.idToken);

    if (!authenticated) {
      window.location.reload();
    }

    // refresh login
    setInterval(function () {

      keycloak.updateToken(MIN_VALIDITY).success(function (refreshed) {
        if (refreshed) {
          console.log('Token refreshed');
          localStorage.setItem('jwt_token', keycloak.idToken);
        } else {
          console.log('Token not refreshed, valid for '
              + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
        }
      }).error(function () {
        console.error('Failed to refresh token');
      });

    }, REFRESH_TIMEOUT);

    console.log('Loading...');

    platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));

  });
