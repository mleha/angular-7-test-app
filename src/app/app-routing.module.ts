import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ViewComponent } from './view/view.component';


const routes: Routes = [
						{ path: '', redirectTo: '/page/all', pathMatch: 'full' },
						{path:'page/:page', component: ViewComponent},
						{path:'**', component: AppComponent}
						];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
