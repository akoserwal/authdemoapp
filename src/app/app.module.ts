import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NavigationModule } from 'patternfly-ng';
import { HttpModule } from '@angular/http';
import { provideAuth } from 'angular2-jwt';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { AppRoutingModule } from './/app-routing.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NavigationModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [
    provideAuth({
      globalHeaders: [{'Content-Type': 'application/json'}],
      noJwtError: true,
      tokenGetter: () => {
        return window['_keycloak'].token;
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
