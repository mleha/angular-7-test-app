import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { Router } from '@angular/router';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './view/view.component';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import {NgxWebstorageModule} from 'ngx-webstorage';

@NgModule({
  declarations: [
    AppComponent,
    ViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	HttpClientModule,
	FormsModule,
	NgxWebstorageModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(router: Router) {
  }

}
